"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SpeakerWaveIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

export default function RandomSlider() {
  const [volume, setVolume] = useState(0);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [shuffledValues, setShuffledValues] = useState<number[]>([]);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  // 🌟 Component စပေါ်တာနဲ့ 0-100 ကို သမအောင် မွှေလိုက်ပါမည်
  useEffect(() => {
    // State ချက်ချင်း update လုပ်လို့ရအောင် setTimeout 0s နဲ့ ထုပ်ထားပါသည်
    setTimeout(() => {
      const arr = Array.from({ length: 101 }, (_, i) => i);
      // Fisher-Yates Shuffle
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      setShuffledValues(arr);
      setVolume(arr[0]);
    }, 0);
  }, []);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(e.target.value);
    setSliderIndex(index);
    setVolume(shuffledValues[index]);
  };

  const handleSave = () => {
    setShowAlert(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans select-none relative overflow-hidden">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-[2rem] p-6 shadow-xl relative overflow-hidden z-10">
        {/* Header - အပြာရောင် Theme ပြန်ပြောင်းထားပါသည် */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <SpeakerWaveIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Media Volume</h2>
            <p className="text-gray-400 text-xs font-medium">
              Chaos mode active
            </p>
          </div>
        </div>

        {/* Output Number */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black text-gray-800 tabular-nums  h-[60px] flex items-center justify-center">
            {shuffledValues.length > 0 ? volume : 0}
            <span className="text-2xl text-gray-400 ml-1 font-medium">%</span>
          </h1>
        </div>

        {/* 🎢 THE EVIL SLIDER SYSTEM */}
        <div className="relative w-full mx-auto flex items-end mb-8 mt-4">
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={sliderIndex}
            onChange={handleSliderChange}
            className="w-full appearance-none h-3 rounded-full outline-none cursor-grab active:cursor-grabbing standard-ui-thumb shadow-inner border border-gray-200 relative z-10"
            style={{
              WebkitAppearance: "none",
              margin: 0,
              background: `linear-gradient(to right, #3b82f6 ${sliderIndex}%, #f3f4f6 ${sliderIndex}%)`,
            }}
          />
        </div>

        {/* Warning Text */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
            Good luck finding exactly 50%
          </p>
        </div>

        {/* Save Button */}
        <div className="mt-2">
          <button
            onClick={handleSave}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-md active:scale-95 transition-transform">
            Done
          </button>
        </div>
      </div>

      {/* ✨ CUSTOM ALERT MODAL (Framer Motion) */}
      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-[2rem] shadow-2xl p-8 w-full max-w-[320px] flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircleIcon className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-2">Saved!</h3>
              <p className="text-gray-500 text-sm mb-6 font-medium leading-relaxed">
                Volume set to{" "}
                <span className="font-bold text-gray-800">{volume}%</span>
                .<br />
                <span className="text-xs text-gray-400 mt-1 block">
                  (Hope you didn&apos;t need exactly 50% 🤡)
                </span>
              </p>
              <button
                onClick={() => setShowAlert(false)}
                className="w-full bg-gray-900 hover:bg-black text-white py-3.5 rounded-xl font-bold shadow-md active:scale-95 transition-transform">
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .standard-ui-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 28px;
          height: 28px;
          background: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 50%;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          cursor: grab;
        }
        .standard-ui-thumb:active::-webkit-slider-thumb {
          cursor: grabbing;
          transform: scale(0.95);
        }
        .standard-ui-thumb::-moz-range-thumb {
          width: 28px;
          height: 28px;
          background: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 50%;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          cursor: grab;
        }
      `,
        }}
      />
    </div>
  );
}
