"use client";

import React, { useState } from "react";
import { motion } from "motion/react";

export default function PhoneSpinner() {
  const [digits, setDigits] = useState<number[]>(Array(11).fill(0));

  // လက်ရှိ ရွေးချယ်ထားတဲ့ ဂဏန်းရဲ့ အမှတ်စဉ် (Index)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState<number>(0);

  const handleSpinWheel = () => {
    // ဂဏန်းမရွေးဘဲ ခလုတ်နှိပ်ရင် Alert ပြပါမယ်
    if (selectedIndex === null) {
      alert("Please select a digit first! 🤡");
      return;
    }

    if (isSpinning) return;
    setIsSpinning(true);

    // 0 ကနေ 9 ထဲက ကျပန်းဂဏန်း တစ်ခု ရွေးပါမယ်
    const targetNum = Math.floor(Math.random() * 10);

    // Wheel ကို တွက်ချက်ခြင်း (၅ ပတ်တိတိ လည်ပြီးမှ လိုချင်တဲ့ ဂဏန်းဆီ ရပ်အောင် တွက်ထားပါတယ်)
    const spins = 1800; // 360 * 5
    // အလယ်တည့်တည့်ကျအောင် +18 ဒီဂရီ ထပ်ပေါင်းထည့်ပြီး တွက်ချက်ထားပါတယ်
    const targetAngle = (360 - (targetNum * 36 + 18)) % 360;

    const nextRotation = wheelRotation + spins;
    const currentMod = nextRotation % 360;
    let diff = targetAngle - currentMod;
    if (diff < 0) diff += 360;

    const finalRotation = nextRotation + diff;
    setWheelRotation(finalRotation);

    // လည်မယ့် အချိန် ၃ စက္ကန့် ပြည့်ရင် ဂဏန်းကို အစားထိုးပါမယ်
    setTimeout(() => {
      setDigits((prev) => {
        const newDigits = [...prev];
        newDigits[selectedIndex] = targetNum;
        return newDigits;
      });
      setIsSpinning(false);
      setSelectedIndex(null); // Bad UX: ပြီးတာနဲ့ Select ဖြုတ်ချလိုက်ပါမယ်
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center overflow-hidden min-h-screen w-full p-4 relative font-sans">
      {/* Background Aesthetic Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-200 rounded-full blur-[100px] opacity-40 mix-blend-multiply pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pink-200 rounded-full blur-[100px] opacity-40 mix-blend-multiply pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-2xl  p-8  flex flex-col items-center ">
        <div className="mb-8 text-center">
          <h2 className="text-xl sm:text-2xl font-black text-gray-800 tracking-wide">
            Wheel of Phone Numbers
          </h2>
          <p className="w-full bg-blue-50 border-l-4 border-blue-500 text-blue-900 text-sm sm:text-base mt-4 text-left font-bold p-3 rounded-r-lg shadow-sm">
            1. Select a digit. <br />
            2. Spin the wheel to get a random number!
          </p>
        </div>

        {/* 11 Digits Row with Formatted Spacing */}
        <div className="flex flex-row items-end justify-center w-full mb-10 cursor-pointer">
          {digits.map((digit, index) => {
            const isSelected = selectedIndex === index;

            return (
              <React.Fragment key={index}>
                <div
                  className="flex flex-col items-center gap-1 mx-px sm:mx-1"
                  onClick={() => {
                    // လည်နေတုန်းမှာ တခြားဂဏန်းကို ပြောင်းရွေးလို့ မရအောင် တားထားပါတယ်
                    if (!isSpinning) {
                      setSelectedIndex(index);
                    }
                  }}>
                  <div className="relative h-10 w-6 flex items-center justify-center overflow-hidden">
                    <div
                      className={`text-2xl sm:text-3xl font-bold transition-all duration-200 ${
                        isSelected
                          ? "text-blue-600 scale-125 border-b-4 border-blue-600" // ရွေးထားရင် အပြာရောင်ပြောင်းပြီး မျဉ်းတားမယ်
                          : "text-gray-800 hover:text-gray-500"
                      }`}>
                      {digit}
                    </div>
                  </div>
                </div>

                {/* 09 ပြီးရင် " - " ထည့်ပါမယ် */}
                {index === 1 && (
                  <span className="text-gray-400 font-bold mx-1 sm:mx-2 mb-1 text-xl">
                    -
                  </span>
                )}

                {/* 3 လုံးပြည့်တိုင်း ကွက်လပ် (Space) ခြားပါမယ် */}
                {(index === 4 || index === 7) && (
                  <span className="w-2 sm:w-3"></span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* 🎡 THE GIANT SPIN WHEEL */}
        <div className="relative flex justify-center items-center mb-10 mt-4">
          {/* Pointer (မြား) */}
          {/* Pointer (Premium ညွှန်တံ) */}
          <div className="absolute -top-5 z-30 flex flex-col items-center drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)]">
            {/* အပေါ်က ခေါင်းလုံးလုံးလေး */}
            <div className="w-8 h-8 bg-linear-to-b from-red-500 to-red-700 rounded-full border-[3px] border-white shadow-inner flex items-center justify-center z-10">
              {/* အလယ်က အလင်းပြန်တဲ့ အစက်လေး */}
              <div className="w-2.5 h-2.5 bg-red-200 rounded-full shadow-[0_0_4px_rgba(255,255,255,0.8)]"></div>
            </div>
            {/* အောက်ကို စိုက်နေတဲ့ အချွန် */}
            <div className="w-0 h-0 border-l-10 border-r-10 border-t-20 border-l-transparent border-r-transparent border-t-red-700 -mt-2"></div>
          </div>

          {/* Wheel Container */}
          <div className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-full border-8 border-gray-800 bg-white overflow-hidden shadow-2xl">
            <motion.div
              className="w-full h-full relative"
              animate={{ rotate: wheelRotation }}
              // လည်တဲ့အခါ Casino Wheel လို အရှိန်နဲ့ထွက်ပြီး ဖြည်းဖြည်းချင်း ရပ်သွားအောင် (easeOut) လုပ်ထားပါတယ်
              transition={{ duration: 3, ease: [0.15, 0.85, 0.35, 1] }}
              style={{
                // Wheel ရဲ့ အရောင်ကွက်လပ်လေးတွေ (Alternating Slices)
                background:
                  "conic-gradient(#f3f4f6 0 36deg, #ffffff 36deg 72deg, #f3f4f6 72deg 108deg, #ffffff 108deg 144deg, #f3f4f6 144deg 180deg, #ffffff 180deg 216deg, #f3f4f6 216deg 252deg, #ffffff 252deg 288deg, #f3f4f6 288deg 324deg, #ffffff 324deg 360deg)",
              }}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <div
                  key={num}
                  className="absolute top-0 left-0 w-full h-full flex justify-center"
                  // ဂဏန်းတွေကို မျဉ်းပေါ်မကျစေဘဲ အလယ်တည့်တည့်ရောက်အောင် +18 ဒီဂရီ ရွှေ့လိုက်ပါတယ်
                  style={{ transform: `rotate(${num * 36 + 18}deg)` }}>
                  <span className="text-xl sm:text-3xl font-black mt-3 sm:mt-4 text-gray-800">
                    {num}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Center Dot (Wheel အလယ်က ဝင်ရိုး) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gray-800 rounded-full border-4 border-white shadow-inner"></div>
          </div>
        </div>

        {/* GIANT SPIN BUTTON */}
        {/* GIANT 3D SPIN BUTTON */}
        <div className="text-center w-full max-w-xs mx-auto mb-6 relative">
          <button
            onClick={handleSpinWheel}
            disabled={isSpinning || selectedIndex === null}
            className={`relative w-full py-4 font-black rounded-2xl transition-all duration-150 text-lg sm:text-xl tracking-[0.2em] uppercase overflow-hidden ${
              isSpinning
                ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-inner translate-y-[6px]"
                : selectedIndex === null
                  ? "bg-gray-50 text-gray-400 border-2 border-dashed border-gray-300 cursor-not-allowed opacity-80"
                  : "bg-gradient-to-b from-red-500 to-red-700 text-white border border-red-400 shadow-[0_6px_0_#991b1b,0_15px_20px_rgba(220,38,38,0.4)] hover:from-red-400 hover:to-red-600 active:translate-y-[6px] active:shadow-[0_0px_0_#991b1b,0_0px_0_rgba(220,38,38,0.0)] animate-pulse"
            }`}>
            {/* စာသားကို ပိုကြွလာအောင် Text Shadow ထည့်ထားပါတယ် */}
            <span className="drop-shadow-md">
              {isSpinning ? "SPINNING..." : "SPIN THE WHEEL"}
            </span>

            {/* ခလုတ်ပေါ်က အလင်းပြန်တဲ့ Effect လေး (Ready ဖြစ်ချိန်မှ ပေါ်မည်) */}
            {!isSpinning && selectedIndex !== null && (
              <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/30 to-transparent rounded-t-2xl pointer-events-none"></div>
            )}
          </button>
        </div>

        {/* Confirm Section */}
        <div className="text-center w-full max-w-xs mx-auto">
          <button
            className="w-full py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-md transition-all active:scale-95 text-sm tracking-wider"
            onClick={() => alert(`Submitted Phone Number: ${digits.join("")}`)}>
            Confirm Number
          </button>
        </div>
      </div>
    </div>
  );
}
