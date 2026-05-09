"use client";

import React, { useState, useRef } from "react";
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/outline";

type ActionType = "INCREASE" | "DECREASE" | null;

export default function DiceVolumeControl() {
  const [volume, setVolume] = useState<number>(50);
  const [rolledNumber, setRolledNumber] = useState<number | null>(null);
  const [action, setAction] = useState<ActionType>(null);
  const [isRolling, setIsRolling] = useState<boolean>(false);

  // Hold Button အတွက် State များ
  const [holdMessage, setHoldMessage] = useState<string>(
    "Hold button for EXACTLY 3.14s to apply",
  );
  const [messageColor, setMessageColor] = useState<string>("text-slate-500");
  const pressTimeRef = useRef<number | null>(null);

  const rollNumberDice = () => {
    setIsRolling(true);
    setHoldMessage("Hold button for EXACTLY 3.14s to apply");
    setMessageColor("text-slate-500");
    setTimeout(() => {
      const num = Math.floor(Math.random() * 6) + 1;
      setRolledNumber(num);
      setIsRolling(false);
    }, 600);
  };

  const rollActionDice = () => {
    setIsRolling(true);
    setTimeout(() => {
      const isIncrease = Math.random() > 0.5;
      setAction(isIncrease ? "INCREASE" : "DECREASE");
      setIsRolling(false);
    }, 600);
  };

  // Mouse စနှိပ်တဲ့အချိန်ကို မှတ်ပါမယ်
  const handlePointerDown = () => {
    if (rolledNumber === null || action === null) return;
    pressTimeRef.current = Date.now();
    setHoldMessage("Holding... Don't let go too early!");
    setMessageColor("text-orange-500 animate-pulse");
  };

  // Mouse လွှတ်လိုက်တဲ့အချိန်မှာ စစ်ဆေးပါမယ်
  const handlePointerUp = () => {
    if (!pressTimeRef.current || rolledNumber === null || action === null)
      return;

    const durationInSeconds = (Date.now() - pressTimeRef.current) / 1000;
    pressTimeRef.current = null;

    // ၃.၁၀ စက္ကန့် နဲ့ ၃.၁၈ စက္ကန့် ကြားဆိုရင် အောင်မြင်ပါတယ်
    if (durationInSeconds >= 3.1 && durationInSeconds <= 3.18) {
      setVolume((prev) => {
        let newVolume =
          action === "INCREASE" ? prev + rolledNumber : prev - rolledNumber;
        if (newVolume > 100) newVolume = 100;
        if (newVolume < 0) newVolume = 0;
        return newVolume;
      });
      setRolledNumber(null);
      setAction(null);
      setHoldMessage(
        `Success! You held it for ${durationInSeconds.toFixed(2)}s.`,
      );
      setMessageColor("text-emerald-500 font-bold");
    } else {
      // ကျရှုံးရင် အကုန် Reset ချပါမယ်
      setRolledNumber(null);
      setAction(null);
      setHoldMessage(
        `FAILED! You held it for ${durationInSeconds.toFixed(2)}s. Must be exactly 3.14s! Try again.`,
      );
      setMessageColor("text-red-500 font-bold");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 font-sans user-select-none">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-200 text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-8">
          <span>Dice Volume Controller</span>
        </h1>

 
        <div className="flex items-center justify-center gap-4 mb-10 bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner">
          {volume === 0 ? (
            <SpeakerXMarkIcon className="w-8 h-8 text-slate-400" />
          ) : (
            <SpeakerWaveIcon className="w-8 h-8 text-emerald-500" />
          )}
          <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${volume}%` }}
            />
          </div>
          <span className="text-slate-700 font-mono text-xl w-12 font-semibold">
            {volume}%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-100 p-4 rounded-xl flex flex-col items-center justify-center min-h-30 border border-slate-200">
            <span className="text-slate-500 text-sm mb-2 font-medium">
              Volume Amount
            </span>
            {rolledNumber ? (
              <span className="text-4xl font-bold text-slate-800 my-2">
                {rolledNumber}
              </span>
            ) : (
              <button
                onClick={rollNumberDice}
                disabled={isRolling}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50">
                <span>Roll Dice 🎲</span>
              </button>
            )}
          </div>

          <div className="bg-slate-100 p-4 rounded-xl flex flex-col items-center justify-center min-h-30 border border-slate-200">
            <span className="text-slate-500 text-sm mb-2 font-medium">
              Action (+ / -)
            </span>
            {action ? (
              <span
                className={`text-4xl font-bold my-2 ${action === "INCREASE" ? "text-emerald-500" : "text-red-500"}`}>
                {action === "INCREASE" ? "+" : "-"}
              </span>
            ) : (
              <button
                onClick={rollActionDice}
                disabled={isRolling}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50">
                <span>Roll Dice 🎲</span>
              </button>
            )}
          </div>
        </div>

        {/* Precision Hold Button */}
        <button
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={() => pressTimeRef.current && handlePointerUp()} // Mouse လွတ်သွားရင်လည်း စစ်မယ်
          disabled={rolledNumber === null || action === null}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl transition-colors shadow-md disabled:cursor-not-allowed select-none active:scale-95">
          <span>Apply Changes</span>
        </button>

        {/* Status Message */}
        <p
          className={`text-sm mt-6 transition-colors duration-300 ${messageColor}`}>
          <span>{holdMessage}</span>
        </p>
      </div>
    </main>
  );
}
