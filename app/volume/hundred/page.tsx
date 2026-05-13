"use client";

import React, { useState, useEffect } from "react";
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/solid";
import { motion, useMotionValue, useTransform, animate } from "motion/react";

export default function AverageSliders() {
  // Slider ၁၀၀ လုံးရဲ့ ကိုယ်ပိုင် တန်ဖိုးများကို သိမ်းထားမယ့် Array (0 to 100)
  const [sliderValues, setSliderValues] = useState<number[]>(
    Array(100).fill(0),
  );

  // 😈 Evil Logic: Slider ၁၀၀ လုံးရဲ့ စုစုပေါင်းပေါင်းလဒ်ကို ၁၀၀ နဲ့ စားပြီး Average ယူပါတယ်
  const totalSum = sliderValues.reduce((acc, curr) => acc + curr, 0);
  const masterVolume = totalSum / 100; // 0.00% to 100.00%

  // 🌟 .00 အထိ အိစက်စက် ပြေးတက်မယ့် Animation အတွက်
  const count = useMotionValue(0);
  const displayVolume = useTransform(count, (latest) => latest.toFixed(2));

  useEffect(() => {
    const controls = animate(count, masterVolume, {
      duration: 0.4,
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [masterVolume, count]);

  const slidersList = Array.from({ length: 100 }, (_, i) => i);

  const handleSliderChange = (index: number, value: number) => {
    const newValues = [...sliderValues];
    newValues[index] = value;
    setSliderValues(newValues);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans select-none relative overflow-x-hidden">
      {/*  Header */}
      {/* 📌 Sticky Header */}
      <div className="top-4 z-40 w-full max-w-md bg-white rounded-[1.5rem] p-5 shadow mb-6 border border-gray-200 flex items-center justify-between transition-all">
        <div>
          <h2 className="text-[11px] font-black tracking-widest uppercase text-gray-400 mb-1">
            Average Volume
          </h2>
          <div className="flex items-center gap-2">
            {masterVolume === 0 ? (
              <SpeakerXMarkIcon className="w-7 h-7 text-gray-300" />
            ) : (
              <SpeakerWaveIcon className="w-7 h-7 text-blue-600" />
            )}

            {/* 🌟 Animated Volume Number (.00 Precision) */}
            <h1 className="text-4xl font-black tabular-nums text-gray-800 flex items-baseline">
              <motion.span className="inline-block ">
                {displayVolume}
              </motion.span>
              <span className="text-xl text-gray-400 ml-1">%</span>
            </h1>
          </div>
        </div>
        <div className="text-right flex flex-col items-end">
          <p className="text-[10px] font-bold bg-red-50 text-red-600 px-3 py-1.5 rounded-full border border-red-100 uppercase tracking-wider mb-1">
            Extreme Pain
          </p>
          <p className="text-[10px] text-gray-400 font-medium">
            100 Sliders = 100%
          </p>
        </div>
      </div>

      {/* 🎛️ THE 100 AVERAGE SLIDERS */}
      <div className="w-full max-w-md bg-white rounded-[1.5rem] shadow-sm border border-gray-200 p-3 sm:p-5 mb-20">
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-gray-800">Mixer Channels</h3>
          <p className="text-red-500 text-[11px] font-bold mt-2 leading-relaxed bg-red-50 p-3 rounded-xl border border-red-100">
            သတိပေးချက်: Slider ၁၀၀ လုံးကို အဆုံးထိဆွဲမှ ၁၀၀% ပြည့်ပါမည်။ <br />
            <span className="text-gray-500 font-medium text-[10px] mt-1 block">
              Slider တစ်ခုကို အဆုံးထိဆွဲလျှင် ၁.၀၀% သာ တက်ပါမည်။
            </span>
          </p>
        </div>

        <div className="flex max-h-[500px] overflow-y-auto flex-col gap-3">
          {slidersList.map((index) => {
            const sliderValue = sliderValues[index];
            const isActive = sliderValue > 0;

            return (
              <div
                key={index}
                className={`flex items-center gap-3 p-2.5 rounded-xl border transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-50/20 border-blue-100"
                    : "bg-gray-50/50 border-gray-100 hover:bg-gray-50"
                }`}>
                {/* ဘယ်ဘက်က Label */}

                {/* 🛹 Standard Clean UI Slider */}
                <div className="grow relative flex items-center h-6">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={sliderValue}
                    onChange={(e) =>
                      handleSliderChange(index, Number(e.target.value))
                    }
                    className={`w-full appearance-none h-2.5 rounded-full outline-none cursor-grab active:cursor-grabbing standard-ui-thumb shadow-inner border z-10 transition-colors ${
                      isActive ? "border-blue-200" : "border-gray-200"
                    }`}
                    style={{
                      WebkitAppearance: "none",
                      margin: 0,
                      background: `linear-gradient(to right, ${isActive ? "#3b82f6" : "#9ca3af"} ${sliderValue}%, #f3f4f6 ${sliderValue}%)`,
                    }}
                  />
                </div>

                {/* ညာဘက်က Indicator (၁၀၀% ဆွဲထားရင် အပြာရင့်ရင့်လေး ပြမယ်) */}
                <div className="w-8 text-right shrink-0">
                  <span
                    className={`text-[10px] font-black transition-colors ${
                      sliderValue === 100
                        ? "text-blue-600"
                        : isActive
                          ? "text-blue-400"
                          : "text-gray-300"
                    }`}>
                    {sliderValue} %
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🌟 Custom CSS for the Small Standard Thumb */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .standard-ui-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px; 
          height: 20px;
          background: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          cursor: grab;
          transition: transform 0.1s, border-color 0.2s;
        }
        .standard-ui-thumb:active::-webkit-slider-thumb {
          cursor: grabbing;
          transform: scale(0.9);
          border-color: #3b82f6;
        }
        .standard-ui-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          cursor: grab;
        }
      `,
        }}
      />
    </div>
  );
}
