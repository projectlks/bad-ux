"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const MAX_OVERFLOW = 50;

interface ElasticSliderProps {
  defaultValue?: number;
  startingValue?: number;
  maxValue?: number;
  className?: string;
  isStepped?: boolean;
  stepSize?: number;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const ElasticSlider: React.FC<ElasticSliderProps> = ({
  defaultValue = 50,
  startingValue = 0,
  maxValue = 100,
  className = "",
  isStepped = false,
  stepSize = 1,
  leftIcon = <>-</>,
  rightIcon = <>+</>,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 w-64 ${className}`}>
      <Slider
        defaultValue={defaultValue}
        startingValue={startingValue}
        maxValue={maxValue}
        isStepped={isStepped}
        stepSize={stepSize}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
      />
    </div>
  );
};

interface SliderProps {
  defaultValue: number;
  startingValue: number;
  maxValue: number;
  isStepped: boolean;
  stepSize: number;
  leftIcon: React.ReactNode;
  rightIcon: React.ReactNode;
}

const Slider: React.FC<SliderProps> = ({
  defaultValue,
  startingValue,
  maxValue,
  isStepped,
  stepSize,
  leftIcon,
  rightIcon,
}) => {
  // အတည်ပြုပြီးသား Value နှင့် ဆွဲနေစဉ်ယာယီပြမည့် tempValue
  const [value, setValue] = useState<number>(defaultValue);
  const [tempValue, setTempValue] = useState<number>(defaultValue);

  // Modal နှင့် Quiz အတွက် States
  const [modalStatus, setModalStatus] = useState<"closed" | "quiz" | "error">(
    "closed",
  );
  const [mathQuestion, setMathQuestion] = useState({
    num1: 0,
    num2: 0,
    operator: "+",
    answer: 0,
  });
  const [userAnswer, setUserAnswer] = useState("");

  const sliderRef = useRef<HTMLDivElement>(null);
  const [region, setRegion] = useState<"left" | "middle" | "right">("middle");
  const clientX = useMotionValue(0);
  const overflow = useMotionValue(0);
  const scale = useMotionValue(1);

  useEffect(() => {
    setTimeout(() => {
      setValue(defaultValue);
      setTempValue(defaultValue);
    }, 0);
  }, [defaultValue]);

  useMotionValueEvent(clientX, "change", (latest: number) => {
    if (sliderRef.current) {
      const { left, right } = sliderRef.current.getBoundingClientRect();
      let newValue: number;
      if (latest < left) {
        setRegion("left");
        newValue = left - latest;
      } else if (latest > right) {
        setRegion("right");
        newValue = latest - right;
      } else {
        setRegion("middle");
        newValue = 0;
      }
      overflow.jump(decay(newValue, MAX_OVERFLOW));
    }
  });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons > 0 && sliderRef.current) {
      const { left, width } = sliderRef.current.getBoundingClientRect();
      let newValue =
        startingValue +
        ((e.clientX - left) / width) * (maxValue - startingValue);
      if (isStepped) {
        newValue = Math.round(newValue / stepSize) * stepSize;
      }
      newValue = Math.min(Math.max(newValue, startingValue), maxValue);

      // ဆွဲနေစဉ်မှာ tempValue ကိုပဲ အရင်ပြောင်းပေးပါမယ်
      setTempValue(newValue);
      clientX.jump(e.clientX);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    handlePointerMove(e);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerUp = () => {
    animate(overflow, 0, { type: "spring", bounce: 0.5 });

    // Slider ကို လွှတ်လိုက်တာနဲ့ Quiz ပေါ်လာပါမယ်
    if (modalStatus === "closed") {
      generateMathQuestion();
      setModalStatus("quiz");
    }
  };

  // ကျပန်း သင်္ချာမေးခွန်းထုတ်ရန်
  const generateMathQuestion = () => {
    const operators = ["+", "-", "*", "/"];
    const randomOp = operators[Math.floor(Math.random() * operators.length)];
    let n1 = 0,
      n2 = 0,
      ans = 0;

    switch (randomOp) {
      case "+":
        n1 = Math.floor(Math.random() * 50) + 1;
        n2 = Math.floor(Math.random() * 50) + 1;
        ans = n1 + n2;
        break;
      case "-":
        const a = Math.floor(Math.random() * 50) + 1;
        const b = Math.floor(Math.random() * 50) + 1;
        n1 = Math.max(a, b);
        n2 = Math.min(a, b);
        ans = n1 - n2;
        break;
      case "*":
        n1 = Math.floor(Math.random() * 12) + 1;
        n2 = Math.floor(Math.random() * 12) + 1;
        ans = n1 * n2;
        break;
      case "/":
        n2 = Math.floor(Math.random() * 12) + 1;
        ans = Math.floor(Math.random() * 12) + 1;
        n1 = n2 * ans;
        break;
    }

    setMathQuestion({ num1: n1, num2: n2, operator: randomOp, answer: ans });
    setUserAnswer("");
  };

  // အဖြေကို စစ်ဆေးရန်
  const handleAnswerSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (parseInt(userAnswer) === mathQuestion.answer) {
      // မှန်ရင် အတည်ပြုပါမယ်
      setValue(tempValue);
      setModalStatus("closed");
    } else {
      // မှားရင် Error ပြပြီး Volume 0 ဖြစ်သွားပါမယ်
      setModalStatus("error");
      setValue(0);
      setTempValue(0);
    }
  };

  // UI မှာ အပြာရောင် Track ပြည့်တာကို tempValue နဲ့ တွက်ပါမယ်
  const getRangePercentage = (): number => {
    const totalRange = maxValue - startingValue;
    if (totalRange === 0) return 0;
    return ((tempValue - startingValue) / totalRange) * 100;
  };

  return (
    <>
      <motion.div
        onHoverStart={() => animate(scale, 1.2)}
        onHoverEnd={() => animate(scale, 1)}
        onTouchStart={() => animate(scale, 1.2)}
        onTouchEnd={() => animate(scale, 1)}
        style={{
          scale,
          opacity: useTransform(scale, [1, 1.2], [0.7, 1]),
        }}
        className="flex w-full touch-none select-none items-center justify-center gap-4">
        <motion.div
          animate={{
            scale: region === "left" ? [1, 1.4, 1] : 1,
            transition: { duration: 0.25 },
          }}
          style={{
            x: useTransform(() =>
              region === "left" ? -overflow.get() / scale.get() : 0,
            ),
          }}>
          {leftIcon}
        </motion.div>

        <div
          ref={sliderRef}
          className="relative flex w-full max-w-xs grow cursor-grab touch-none select-none items-center py-4"
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onLostPointerCapture={handlePointerUp}>
          <motion.div
            style={{
              scaleX: useTransform(() => {
                if (sliderRef.current) {
                  const { width } = sliderRef.current.getBoundingClientRect();
                  return 1 + overflow.get() / width;
                }
                return 1;
              }),
              scaleY: useTransform(overflow, [0, MAX_OVERFLOW], [1, 0.8]),
              transformOrigin: useTransform(() => {
                if (sliderRef.current) {
                  const { left, width } =
                    sliderRef.current.getBoundingClientRect();
                  return clientX.get() < left + width / 2 ? "right" : "left";
                }
                return "center";
              }),
              height: useTransform(scale, [1, 1.2], [12, 16]), // ပုံမှန် 12px, Hover လုပ်ရင် 16px
              marginTop: useTransform(scale, [1, 1.2], [0, -3]),
              marginBottom: useTransform(scale, [1, 1.2], [0, -3]),
            }}
            className="flex grow">
            {/* အစ်ကိုပေးထားတဲ့ မူလ UI အတိုင်းပါပဲ */}
            <div className="relative h-full grow overflow-hidden rounded-full bg-gray-400">
              <div
                className="absolute h-full bg-gray-500 rounded-full"
                style={{ width: `${getRangePercentage()}%` }}
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{
            scale: region === "right" ? [1, 1.4, 1] : 1,
            transition: { duration: 0.25 },
          }}
          style={{
            x: useTransform(() =>
              region === "right" ? overflow.get() / scale.get() : 0,
            ),
          }}>
          {rightIcon}
        </motion.div>
      </motion.div>

      {/* Custom Modal & Alert System */}
      <AnimatePresence>
        {modalStatus !== "closed" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
              {modalStatus === "quiz" ? (
                // Quiz Modal
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Security Check!
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Please solve the following math problem to change the
                    volume:
                  </p>

                  <div className="bg-gray-100 rounded-xl p-4 mb-6">
                    <span className="text-2xl font-black text-blue-600">
                      {mathQuestion.num1}{" "}
                      <span className="text-gray-500">
                        {mathQuestion.operator}
                      </span>{" "}
                      {mathQuestion.num2} = ?
                    </span>
                  </div>

                  <form onSubmit={handleAnswerSubmit} className="space-y-4">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="w-full bg-white border-2 border-gray-200 focus:border-blue-500 p-3 rounded-lg text-center text-lg font-bold outline-none"
                      placeholder="Enter answer..."
                      autoFocus
                    />
                    <div className="flex gap-2 mt-4">
                      <button
                        type="submit"
                        className="flex-2 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAnswerSubmit()}
                        className="flex-1 bg-gray-200 text-gray-600 py-3 rounded-lg font-bold hover:bg-gray-300">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                // Custom Error Alert Screen
                <div className="p-8 text-center ">
                  <div className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg shadow-red-200">
                    <XMarkIcon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-red-600 mb-2">
                    ACCESS DENIED
                  </h3>
                  <p className="text-red-800 text-sm mb-6 leading-relaxed">
                    Incorrect answer. <br />
                    <strong>Volume has been reset to 0.</strong>
                  </p>
                  <button
                    onClick={() => setModalStatus("closed")}
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-bold uppercase shadow-md hover:bg-red-700">
                    I Understand
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="absolute text-gray-500 transform translate-y-12 text-base font-bold tracking-wide">
        Volume: {Math.round(tempValue)}
      </p>
    </>
  );
};

function decay(value: number, max: number): number {
  if (max === 0) {
    return 0;
  }
  const entry = value / max;
  const sigmoid = 2 * (1 / (1 + Math.exp(-entry)) - 0.5);
  return sigmoid * max;
}

export default ElasticSlider;
