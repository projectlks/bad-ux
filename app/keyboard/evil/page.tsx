"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const INITIAL_KEYS = [
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
];

const CAPTCHA_EMOJIS = ["🚗", "🚦", "🚌", "🚲", "🛑", "🌴", "🐈", "🍎", "📱"];

// 1. Random လုပ်ပေးမယ့် Helper Function များကို Component အပြင်ထုတ်လိုက်ပါသည်
const getRandomTarget = () =>
  CAPTCHA_EMOJIS[Math.floor(Math.random() * CAPTCHA_EMOJIS.length)];

const generateRandomGrid = (target: string) => {
  const grid = Array(9)
    .fill(null)
    .map(() => {
      return Math.random() > 0.7
        ? target
        : CAPTCHA_EMOJIS[Math.floor(Math.random() * CAPTCHA_EMOJIS.length)];
    });

  if (!grid.includes(target)) {
    grid[Math.floor(Math.random() * 9)] = target;
  }
  return grid;
};

export default function EvilKeyboard() {
  const [text, setText] = useState<string>("");
  const [keyboardLayout, setKeyboardLayout] = useState<string[]>(INITIAL_KEYS);

  // Modals State
  const [pendingChar, setPendingChar] = useState<string | null>(null);
  const [showCaptcha, setShowCaptcha] = useState<boolean>(false);
  const [showPremium, setShowPremium] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  // Captcha State
  const [captchaTarget, setCaptchaTarget] = useState<string>("");
  const [captchaGrid, setCaptchaGrid] = useState<string[]>([]);
  const [selectedSquares, setSelectedSquares] = useState<number[]>([]);

  // ကီးဘုတ်နေရာ ကျပန်းပြောင်းမယ့် Function
  const shuffleKeyboard = () => {
    const shuffled = [...keyboardLayout].sort(() => Math.random() - 0.5);
    setKeyboardLayout(shuffled);
  };

  // Captcha အသစ် ဖန်တီးမယ့် Function
  const generateCaptcha = () => {
    const target = getRandomTarget();
    setCaptchaTarget(target);
    setCaptchaGrid(generateRandomGrid(target));
    setSelectedSquares([]);
  };

  // ခလုတ်နှိပ်တဲ့အခါ အလုပ်လုပ်မယ့် Function
  const handleKeyPress = (char: string) => {
    shuffleKeyboard(); // နှိပ်လိုက်တာနဲ့ ကီးဘုတ်က ချက်ချင်း နေရာပြောင်းသွားမယ် 💀

    setPendingChar(char);
    generateCaptcha();
    setShowCaptcha(true);
  };

  const handleSpace = () => {
    shuffleKeyboard();
    setShowPremium(true);
  };

  const handleBackspace = () => {
    if (text.length === 0) return;
    shuffleKeyboard();
    setShowDeleteConfirm(true);
  };

  // Captcha စစ်ဆေးခြင်း
  const verifyCaptcha = () => {
    const targetIndexes = captchaGrid
      .map((emoji, index) => (emoji === captchaTarget ? index : -1))
      .filter((index) => index !== -1);

    const isCorrect =
      targetIndexes.length === selectedSquares.length &&
      targetIndexes.every((val) => selectedSquares.includes(val));

    if (isCorrect && pendingChar) {
      // မှန်ရင် စာရိုက်ပေးမယ်
      setText((prev) => prev + pendingChar);
      setShowCaptcha(false);
      setPendingChar(null);
    } else {
      // မှားရင် အကုန်ဖျက်ပစ်မယ်! 💀🔥
      setText("");
      setShowCaptcha(false);
      setPendingChar(null);
      alert("Verification Failed. You are a robot. Input Cleared! 🤖");
    }
  };

  const toggleCaptchaSquare = (index: number) => {
    setSelectedSquares((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center p-4 font-sans overflow-hidden">
      {/* 📱 Phone Simulator Container */}
      <div className="w-full max-w-[400px] h-[800px] bg-white rounded-[3rem] shadow-2xl border-[8px] border-gray-900 relative flex flex-col overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-gray-900 rounded-b-3xl z-50"></div>

        {/* 💬 App Header */}
        <div className="pt-12 pb-4 px-6 bg-gray-50 border-b border-gray-200 flex items-center shadow-sm">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl mr-3">
            🤖
          </div>
          <div>
            <h1 className="font-bold text-gray-800">Secure Chat</h1>
            <p className="text-xs text-green-500 font-medium">Online</p>
          </div>
        </div>

        {/* 📜 Chat History (Dummy) */}
        <div className="flex-1 bg-gray-100 p-4 flex flex-col justify-end">
          <div className="bg-gray-200 p-3 rounded-2xl rounded-tl-none w-3/4 mb-4 text-sm text-gray-800">
            Hey, what&apos;s the password for the Wi-Fi? Just type it here.
          </div>
        </div>

        {/* ⌨️ Input Box */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="w-full min-h-[50px] bg-gray-50 border border-gray-300 rounded-2xl px-4 py-3 text-gray-800 font-medium break-all flex items-center shadow-inner relative">
            {text || <span className="text-gray-400">Type a message...</span>}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="ml-1 w-0.5 h-5 bg-blue-500 inline-block"
            />
          </div>
        </div>

        {/* 🔠 THE EVIL KEYBOARD */}
        <div className="bg-gray-200 pb-8 pt-4 px-2 select-none">
          {/* Alphabet Keys */}
          <div className="flex flex-wrap justify-center gap-1.5 mb-2">
            {keyboardLayout.map((key, index) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className="w-[9%] h-12 bg-white rounded-lg shadow-sm border-b-2 border-gray-300 flex items-center justify-center font-bold text-gray-800 active:bg-gray-300 active:translate-y-1 transition-all">
                {key}
              </button>
            ))}
          </div>

          {/* Action Keys */}
          <div className="flex justify-center gap-2 mt-3 px-1">
            <button
              onClick={handleSpace}
              className="flex-1 h-12 bg-white rounded-xl shadow-sm border-b-2 border-gray-300 flex items-center justify-center font-bold text-gray-500 text-sm active:bg-gray-300 active:translate-y-1 transition-all">
              SPACE <span className="ml-2 text-yellow-500">🔒</span>
            </button>
            <button
              onClick={handleBackspace}
              className="w-16 h-12 bg-gray-300 rounded-xl shadow-sm border-b-2 border-gray-400 flex items-center justify-center font-bold text-gray-800 active:bg-gray-400 active:translate-y-1 transition-all">
              ⌫
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 👿 POPUPS & MODALS (The True Bad UX) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {/* 1. CAPTCHA MODAL */}
        {showCaptcha && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-[320px] flex flex-col">
              <div className="bg-blue-600 text-white p-4 rounded-t-xl -mx-6 -mt-6 mb-4">
                <p className="text-sm">Select all squares with</p>
                <h3 className="text-2xl font-black">{captchaTarget}</h3>
              </div>

              <div className="grid grid-cols-3 gap-1 mb-4">
                {captchaGrid.map((emoji, idx) => {
                  const isSelected = selectedSquares.includes(idx);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleCaptchaSquare(idx)}
                      className={`aspect-square flex items-center justify-center text-4xl cursor-pointer border-2 transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 scale-95"
                          : "border-gray-200 hover:bg-gray-100"
                      }`}>
                      {emoji}
                      {isSelected && (
                        <div className="absolute bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs bottom-1 right-1">
                          ✓
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-200">
                <span className="text-xs text-gray-400">reCAPTCHA v6.0</span>
                <button
                  onClick={verifyCaptcha}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold shadow-md active:scale-95">
                  Verify
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* 2. SPACEBAR PREMIUM MODAL */}
        {showPremium && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-br from-yellow-50 to-white rounded-3xl shadow-2xl p-8 w-full max-w-[320px] text-center border-2 border-yellow-400">
              <div className="text-6xl mb-4">👑</div>
              <h3 className="text-2xl font-black text-gray-800 mb-2">
                Typing Pro™
              </h3>
              <p className="text-gray-500 text-sm mb-6 font-medium">
                The space bar is a premium feature. Upgrade now to unlock spaces
                between words!
              </p>

              <button
                onClick={() => {
                  alert("Insufficient funds! 💸");
                  setShowPremium(false);
                }}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white py-3 rounded-xl font-black shadow-lg mb-3 active:scale-95">
                Pay $99.99 / month
              </button>
              <button
                onClick={() => setShowPremium(false)}
                className="text-gray-400 text-xs font-bold underline">
                Continue writing without spaces
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* 3. DELETE CONFIRMATION MODAL */}
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-[320px] text-center border-t-8 border-red-500">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-black text-gray-800 mb-2">
                Critical Action
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Are you absolutely sure you want to permanently delete exactly
                ONE (1) character? This action cannot be undone.
              </p>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-md active:scale-95">
                  No, keep my character
                </button>
                <button
                  onClick={() => {
                    setText((prev) => prev.slice(0, -1));
                    setShowDeleteConfirm(false);
                  }}
                  className="w-full bg-white text-red-500 border border-red-200 py-3 rounded-xl font-bold active:scale-95">
                  Yes, I understand the risks
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
