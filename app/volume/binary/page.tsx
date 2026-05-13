"use client";

import React, { useState, useEffect } from "react";
// motion အပြင် လိုအပ်တဲ့ hook တွေကိုပါ import လုပ်ထားပါတယ်
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import {
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ExclamationTriangleIcon,
  CpuChipIcon,
} from "@heroicons/react/24/solid";

const BIT_VALUES = [64, 32, 16, 8, 4, 2, 1];

export default function BinaryVolume() {
  const [bits, setBits] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  const toggleBit = (index: number) => {
    const newBits = [...bits];
    newBits[index] = newBits[index] === 0 ? 1 : 0;
    setBits(newBits);
  };

  const currentVolume = parseInt(bits.join(""), 2);
  const isOverload = currentVolume > 100;
  const isMuted = currentVolume === 0;

  // 🌟 Count Up / Count Down Animation အတွက် တွက်ချက်မှုများ
  const count = useMotionValue(0);
  const roundedVolume = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    // currentVolume ပြောင်းသွားတိုင်း 0.5 စက္ကန့်အတွင်း အသစ်ဆီကို ပြေးတက်/ပြေးဆင်းသွားပါမယ်
    const controls = animate(count, currentVolume, {
      duration: 0.5,
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [currentVolume, count]);

  return (
    <div className="min-h-screen  flex flex-col items-center justify-center p-4 font-mono">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Header */}
          <div className="text-center mb-6 flex flex-col items-center">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-blue-100">
              <CpuChipIcon className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-gray-800 tracking-[0.1em] uppercase">
              Audio Control
            </h2>
            <p className="text-gray-400 text-xs mt-1 font-sans font-medium">
              Toggle the bits below to adjust volume.
            </p>
          </div>

          {/* 📢 GIANT Volume Display */}
          <div
            className={`w-full flex flex-col items-center justify-center py-8 rounded-3xl mb-8 border-2 transition-all duration-300 shadow-inner ${
              isOverload
                ? "bg-red-50 border-red-200"
                : isMuted
                  ? "bg-gray-100 border-gray-200"
                  : "bg-blue-50/50 border-blue-100"
            }`}>
            <div className="flex items-center gap-3 mb-2">
              {isOverload ? (
                <ExclamationTriangleIcon className="w-8 h-8 text-red-500 animate-bounce" />
              ) : isMuted ? (
                <SpeakerXMarkIcon className="w-8 h-8 text-gray-400" />
              ) : (
                <SpeakerWaveIcon className="w-8 h-8 text-blue-500" />
              )}
            </div>

            {/* 🌟 အတိုး/အလျှော့ Animation ဖြစ်မယ့် ဂဏန်းနေရာ */}
            <h1
              className={`text-5xl sm:text-7xl font-black  transition-colors flex items-baseline tabular-nums ${
                isOverload
                  ? "text-red-500"
                  : isMuted
                    ? "text-gray-300"
                    : "text-gray-900"
              }`}>
              <motion.span>{roundedVolume}</motion.span>
              <span className="text-4xl sm:text-5xl ml-1 text-gray-400 font-sans">
                %
              </span>
            </h1>

            {/* Binary String */}
            <p className="text-gray-400 font-bold tracking-[0.3em] mt-4 text-sm bg-white px-4 py-1.5 rounded-full border border-gray-200 shadow-sm">
              {bits.join("")}
            </p>

            {isOverload && (
              <p className="text-red-600 text-xs mt-4 font-bold animate-pulse bg-red-100 px-3 py-1 rounded-full border border-red-200">
                OVERLOAD WARNING
              </p>
            )}
          </div>

          {/* Binary Toggle Switches */}
          <div className="flex justify-between items-center w-full bg-white p-5 rounded-3xl border border-gray-100 shadow-sm mb-8">
            {bits.map((bit, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <span className="text-gray-400 text-[10px] font-black">
                  {BIT_VALUES[index]}
                </span>

                <button
                  onClick={() => toggleBit(index)}
                  className={`w-8 h-12 sm:w-10 sm:h-14 rounded-xl relative transition-all border-b-[5px] active:border-b-0 active:translate-y-[5px] ${
                    bit === 1
                      ? "bg-blue-500 border-blue-700 shadow-[0_4px_10px_rgba(59,130,246,0.3)]"
                      : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                  }`}>
                  <span
                    className={`absolute inset-0 flex items-center justify-center font-black text-base sm:text-lg ${
                      bit === 1 ? "text-white" : "text-gray-400"
                    }`}>
                    {bit}
                  </span>
                </button>
              </div>
            ))}
          </div>

          {/* Apply Button */}
          <button
            disabled={isOverload}
            className={`w-full py-4 font-black uppercase tracking-widest rounded-2xl transition-all shadow-md active:scale-95 text-sm flex justify-center items-center gap-2 ${
              isOverload
                ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed shadow-none"
                : "bg-gray-900 hover:bg-black text-white"
            }`}
            onClick={() =>
              alert(`Audio Configured to: ${bits.join("")} (${currentVolume}%)`)
            }>
            {isOverload ? (
              <>
                <ExclamationTriangleIcon className="w-5 h-5" />
                Cannot Compile
              </>
            ) : (
              "Apply Volume"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
