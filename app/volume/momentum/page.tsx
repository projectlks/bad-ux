"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

export default function MomentumSlider() {
  const [displayVolume, setDisplayVolume] = useState<string>("50.000000");

  const actualVol = useRef<number>(0);
  const velocity = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const requestRef = useRef<number>(0);
  const lastTime = useRef<number>(0);
  const lastPos = useRef<number>(0);

  useEffect(() => {
    const updatePhysics = () => {
      if (!isDragging.current && Math.abs(velocity.current) > 0.0001) {
        const FRICTION = 0.985;
        const BOUNCE_FACTOR = -0.5;

        const currentActual = actualVol.current;
        const currentVelocity = velocity.current;

        const nextActual = currentActual + currentVelocity;
        const nextVelocity = currentVelocity * FRICTION;

        const checkBounds = (pos: number, vel: number) => {
          if (pos >= 100) return { newPos: 100, newVel: vel * BOUNCE_FACTOR };
          if (pos <= 0) return { newPos: 0, newVel: vel * BOUNCE_FACTOR };
          return { newPos: pos, newVel: vel };
        };

        const bounds = checkBounds(nextActual, nextVelocity);

        actualVol.current = bounds.newPos;
        velocity.current = bounds.newVel;

        setDisplayVolume(actualVol.current.toFixed(6));
      }

      requestRef.current = requestAnimationFrame(updatePhysics);
    };

    requestRef.current = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  const handleDragStart = () => {
    isDragging.current = true;
    velocity.current = 0;
    lastTime.current = performance.now();
    lastPos.current = actualVol.current;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    const now = performance.now();
    const dt = now - lastTime.current;

    if (dt > 0) {
      const v = ((newValue - lastPos.current) / dt) * 16.6;
      velocity.current = velocity.current * 0.4 + v * 0.6;
    }

    lastTime.current = now;
    lastPos.current = newValue;
    actualVol.current = newValue;
    setDisplayVolume(newValue.toFixed(6));
  };

  const handleDragEnd = () => {
    if (!isDragging.current) return;

    isDragging.current = false;

    // Mouse ဆွဲပြီး 50ms ကျော်အထိ ရပ်ထားပြီးမှ လွှတ်လိုက်ရင် အရှိန်ကို 0 ဖြစ်သွားစေပါတယ်
    if (performance.now() - lastTime.current > 50) {
      velocity.current = 0;
    }
  };

  // const handleApply = () => {
  //   alert(
  //     `Volume Set To: ${displayVolume}% \n\nTargeting exact numbers is impossible! 🤡`,
  //   );
  // };

  const currentNumericVol = Number(displayVolume);

  return (
    <div className="min-h-screen  flex flex-col items-center justify-center p-4 font-sans select-none overflow-hidden">
      <div className="w-full max-w-xl bg-white border border-gray-200 rounded-[2rem] p-8 shadow-2xl relative">
        {/* Header - Volume မှန်း သိသာအောင် ပြင်ထားပါသည် */}
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
            <SpeakerWaveIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div className="grow">
            <h2 className="text-xl font-black text-gray-800 tracking-wide">
              Volume Control
            </h2>
            <p className="text-gray-400 text-xs font-medium">
              Adjust volume level carefully 🧊
            </p>
          </div>
        </div>

        {/* 📢 THE ICE-PUCK DISPLAY */}
        <div className="w-full bg-gray-900 rounded-2xl p-6 mb-8 text-center shadow-inner border-[6px] border-gray-800 relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <p className="text-blue-400 text-[10px] font-black tracking-widest uppercase mb-2 flex items-center gap-1">
              <ExclamationCircleIcon className="w-4 h-4 text-blue-500" />
              Master Volume
            </p>

            {/* tracking-tighter လုံးဝ မသုံးထားပါ */}
            <h1 className="text-5xl font-black text-white tabular-nums tracking-wide w-full text-center">
              {displayVolume.split(".")[0]}
              <span className="text-3xl text-gray-400">
                .{displayVolume.split(".")[1]}
              </span>
            </h1>
          </div>
        </div>

        {/* 🎢 THE INERTIA SLIDER WITH ICONS */}
        <div className="flex items-center gap-3 w-full mb-10">
          {/* အသံတိတ် Icon (Volume 0) */}
          <SpeakerXMarkIcon className="w-6 h-6 text-gray-400 shrink-0" />

          <div className="relative h-12 flex items-center bg-blue-50/50 rounded-full border border-blue-100 px-4 grow">
            <input
              type="range"
              min="0"
              max="100"
              step="0.000001"
              value={currentNumericVol}
              onMouseDown={handleDragStart}
              onChange={handleChange}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchEnd={handleDragEnd}
              className="w-full appearance-none bg-transparent h-4 rounded-full cursor-grab active:cursor-grabbing standard-ui-thumb z-20 relative"
              style={{
                WebkitAppearance: "none",
                margin: 0,
                background: `linear-gradient(to right, #3b82f6 ${currentNumericVol}%, #e5e7eb ${currentNumericVol}%)`,
              }}
            />
          </div>

          {/* အသံအကျယ်ဆုံး Icon (Volume 100) */}
          <SpeakerWaveIcon className="w-6 h-6 text-gray-400 shrink-0" />
        </div>

        {/* Apply Button
        <button
          onClick={handleApply}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-sm tracking-widest uppercase shadow-md active:scale-95 transition-transform">
          Set Volume
        </button> */}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .standard-ui-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 32px;
          height: 32px;
          background: #ffffff;
          border: 2px solid #3b82f6;
          border-radius: 50%;
          box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.4), inset 0 2px 4px rgba(0,0,0,0.05);
          cursor: grab;
        }
        .standard-ui-thumb:active::-webkit-slider-thumb {
          cursor: grabbing;
          background: #eff6ff;
          transform: scale(0.95);
        }
        .standard-ui-thumb::-moz-range-thumb {
          width: 32px;
          height: 32px;
          background: #ffffff;
          border: 2px solid #3b82f6;
          border-radius: 50%;
          box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.4);
          cursor: grab;
        }
      `,
        }}
      />
    </div>
  );
}
