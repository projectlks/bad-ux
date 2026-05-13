"use client";

import React, { useState, useEffect, useRef } from "react";
import { SpeakerWaveIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "motion/react";

export default function GravityVolume() {
  const [displayVolume, setDisplayVolume] = useState<number>(0);

  // Custom Alert ကို အဖွင့်အပိတ်လုပ်ရန် State
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const volumeRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const requestRef = useRef<number>(0);

  const GRAVITY = 0.35;
  const BOUNCE_FACTOR = -0.25;
  const FRICTION = 0.96;

  useEffect(() => {
    const updatePhysics = () => {
      if (!isDraggingRef.current) {
        const currentVelocity = velocityRef.current;
        const nextVelocity = (currentVelocity + GRAVITY) * FRICTION;
        velocityRef.current = nextVelocity;

        const currentVolume = volumeRef.current;
        const nextVolume = currentVolume - nextVelocity;

        if (nextVolume <= 0) {
          volumeRef.current = 0;
          const bounceVelocity = nextVelocity * BOUNCE_FACTOR;
          velocityRef.current =
            Math.abs(bounceVelocity) < 0.3 ? 0 : bounceVelocity;
        } else if (nextVolume > 100) {
          volumeRef.current = 100;
          velocityRef.current = 0;
        } else {
          volumeRef.current = nextVolume;
        }
      }

      setDisplayVolume(Math.round(volumeRef.current));
      requestRef.current = requestAnimationFrame(updatePhysics);
    };

    requestRef.current = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  const handleDragStart = () => {
    isDraggingRef.current = true;
    velocityRef.current = 0;
  };

  const handleDragEnd = () => {
    isDraggingRef.current = false;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    volumeRef.current = newVolume;
    setDisplayVolume(Math.round(newVolume));
  };

  const handleSave = () => {
    setShowAlert(true); // Default alert အစား Custom Modal ကို ခေါ်ပါမည်
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans select-none relative">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-[2rem] p-6 shadow-xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <SpeakerWaveIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Media Volume</h2>
            <p className="text-gray-400 text-xs font-medium">Drag to adjust</p>
          </div>
        </div>

        {/* Output Number */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black text-gray-800 tabular-nums tracking-tighter">
            {displayVolume}
            <span className="text-2xl text-gray-400 ml-1 font-medium">%</span>
          </h1>
        </div>

        {/* 🎢 THE TILTED SLIDER SYSTEM */}
        <div className="relative w-full h-30 mx-auto flex items-end mb-6">
          <div
            className="absolute bottom-0 bg-red-500 rounded-sm shadow-md flex items-center justify-center z-0"
            style={{ left: "220px", width: "30px", height: "51px" }}>
            <div className="text-white font-bold text-[8px] -rotate-90 whitespace-nowrap tracking-widest opacity-80">
              ERROR
            </div>
          </div>

          <div
            className="absolute bottom-0 left-4 origin-bottom-left z-10 w-70"
            style={{ transform: "rotate(-12deg)" }}>
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={displayVolume}
              onChange={handleChange}
              onMouseDown={handleDragStart}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchEnd={handleDragEnd}
              className="w-full appearance-none h-3 rounded-full outline-none cursor-grab active:cursor-grabbing standard-ui-thumb shadow-inner border border-gray-200"
              style={{
                WebkitAppearance: "none",
                margin: 0,
                background: `linear-gradient(to right, #3b82f6 ${displayVolume}%, #f3f4f6 ${displayVolume}%)`,
              }}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-4">
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
                <span className="font-bold text-gray-800">
                  {displayVolume}%
                </span>
                .<br />
                <span className="text-xs text-gray-400 mt-1 block">
                  (Did you notice it sliding down? 🤡)
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
