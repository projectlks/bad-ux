"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";

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
      className={`flex flex-col items-center justify-center gap-4 w-48 ${className}`}>
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
  // အတည်ပြုပြီးသား အသံအတိုးအကျယ်
  const [value, setValue] = useState<number>(defaultValue);

  // ဆွဲနေစဉ် မြင်ရမယ့် ယာယီ အသံအတိုးအကျယ်
  const [tempValue, setTempValue] = useState<number>(defaultValue);

  // Math Modal အတွက် States
  const [isModalOpen, setIsModalOpen] = useState(false);
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

      // ဆွဲနေစဉ်မှာ tempValue ကိုပဲ အရင်ပြောင်းပါမယ်
      setTempValue(newValue);
      clientX.jump(e.clientX);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    handlePointerMove(e);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  // Slider ကို လွှတ်လိုက်တဲ့အချိန်
  const handlePointerUp = () => {
    animate(overflow, 0, { type: "spring", bounce: 0.5 });

    // ပြဿနာ ဖြေရှင်းချက်: တန်ဖိုးပြောင်းပြောင်း မပြောင်းပြောင်း လွှတ်လိုက်တာနဲ့ Modal ခေါ်ပါမယ်
    if (!isModalOpen) {
      generateMathQuestion();
      setIsModalOpen(true);
    }
  };

  // အပေါင်း၊ အနုတ်၊ အမြှောက်၊ အစား ကျပန်းထုတ်မယ့် Function
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

  const handleAnswerSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // အဖြေမှန်လျှင်
    if (parseInt(userAnswer) === mathQuestion.answer) {
      setValue(tempValue);
    } else {
      // အဖြေမှားလျှင်
      setValue(0);
      setTempValue(0);
      alert("အဖြေမှားပါတယ်။ ပြစ်ဒဏ်အနေနဲ့ Volume 0 ဖြစ်သွားပါပြီ။");
    }
    setIsModalOpen(false);
  };

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
              height: useTransform(scale, [1, 1.2], [6, 12]),
              marginTop: useTransform(scale, [1, 1.2], [0, -3]),
              marginBottom: useTransform(scale, [1, 1.2], [0, -3]),
            }}
            className="flex grow">
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

      <p className="absolute text-gray-400 transform -translate-y-4 text-xs font-medium tracking-wide">
        {Math.round(tempValue)}
      </p>

      {/* သင်္ချာမေးခွန်း Modal - ပြဿနာဖြေရှင်းရန် z-[9999] ထည့်ထားပါတယ် */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80 text-center text-black">
            <h3 className="text-lg font-bold mb-4 text-red-600">
              လုံခြုံရေး စစ်ဆေးမှု!
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              အသံအတိုးအကျယ် ပြောင်းလဲရန် အောက်ပါ သင်္ချာပုစ္ဆာကို ဖြေရှင်းပါ-
            </p>
            <p className="text-2xl font-bold mb-4">
              {mathQuestion.num1} {mathQuestion.operator} {mathQuestion.num2} =
              ?
            </p>

            <form onSubmit={handleAnswerSubmit}>
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full border-2 border-gray-300 p-2 rounded-md mb-4 text-center text-lg"
                placeholder="အဖြေရေးပါ..."
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md font-bold hover:bg-blue-700">
                  အတည်ပြုမည်
                </button>
                <button
                  type="button"
                  onClick={() => handleAnswerSubmit()}
                  className="flex-1 bg-red-100 text-red-700 py-2 rounded-md font-bold hover:bg-red-200">
                  မလုပ်တော့ပါ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
