"use client";

import React, { useState, useRef } from "react";
import { SpeakerWaveIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "motion/react";

// Icon တစ်ခုချင်းစီရဲ့ နေရာနဲ့ အချက်အလက်ကို သိမ်းဖို့ Type
type DroppedIcon = {
  id: number;
  x: number;
  y: number;
  rotation: number;
};

export default function DragDropVolume() {
  const [droppedIcons, setDroppedIcons] = useState<DroppedIcon[]>([]);

  // ဘောက်စ်ရဲ့ နေရာ (Coordinates) ကို တွက်ချက်ရန်
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // ညာဘက်က Icon ကို ဆွဲပြီး လွှတ်လိုက်တဲ့အချိန် အလုပ်လုပ်မယ့် Function
  const handleDragEnd = (
    event: PointerEvent,
    info: { point: { x: number; y: number } },
  ) => {
    const dropZone = dropZoneRef.current;
    if (!dropZone) return;

    const rect = dropZone.getBoundingClientRect();

    // Mouse (သို့) လက်ချောင်း လွှတ်လိုက်တဲ့ နေရာ
    const dropX = info.point.x;
    const dropY = info.point.y;

    // အဲ့ဒီနေရာက ဘောက်စ်ထဲမှာ ဟုတ်မဟုတ် စစ်ဆေးခြင်း
    const isInside =
      dropX >= rect.left &&
      dropX <= rect.right &&
      dropY >= rect.top &&
      dropY <= rect.bottom;

    if (isInside) {
      if (droppedIcons.length >= 100) {
        alert("100% ပြည့်သွားပါပြီ! နားကွဲတော့မယ် 🤡");
        return;
      }

      // Icon လေးကို ချလိုက်တဲ့နေရာမှာ ကွက်တိပေါ်အောင် တွက်ချက်ခြင်း (Icon အရွယ်အစား 32px ရဲ့ တစ်ဝက် 16px ကို နှုတ်ထားပါသည်)
      const relativeX = dropX - rect.left - 16;
      const relativeY = dropY - rect.top - 16;
      const randomRotation = Math.floor(Math.random() * 360);

      const newIcon: DroppedIcon = {
        id: Date.now() + Math.random(),
        x: relativeX,
        y: relativeY,
        rotation: randomRotation,
      };

      setDroppedIcons((prev) => [...prev, newIcon]);
    }
  };

  // အသံပြန်လျှော့ချင်ရင် Icon ကို ပြန်နှိပ်ပြီး ဖျက်ရန်
  const removeIcon = (idToRemove: number) => {
    const filteredIcons = droppedIcons.filter((icon) => icon.id !== idToRemove);
    setDroppedIcons(filteredIcons);
  };

  const volume = droppedIcons.length;

  return (
    <div className="min-h-screen  flex flex-col items-center justify-center p-4 font-sans select-none overflow-hidden">
      <div className="w-full max-w-2xl bg-white   p-8  relative flex flex-col items-center">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-lg font-bold text-gray-500 mb-2">
            Adjust Volume
          </h2>

          <h1 className="text-6xl font-black text-gray-800 tabular-nums flex items-baseline justify-center">
            <motion.span
              key={volume}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="inline-block">
              {volume}
            </motion.span>
            <span className="text-4xl text-gray-400 ml-1">%</span>
          </h1>

          <p className="text-gray-400 text-[10px] font-bold mt-4 uppercase tracking-widest bg-gray-50 py-2 px-4 rounded-full border border-gray-100">
            Click dropped icons to decrease volume
          </p>
        </div>

        {/* Drag & Drop Work Area */}
        <div className="flex flex-col sm:flex-row gap-6 w-full justify-center items-center">
          {/* 📥 LEFT: The Drop Zone Box */}
          <div
            ref={dropZoneRef}
            className="w-64 h-64 sm:w-80 sm:h-80 border-2 border-dashed border-gray-400 rounded-3xl relative overflow-hidden bg-gray-50/50 shrink-0">
            {volume === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-300 font-medium text-sm">
                Drop icons here
              </div>
            )}

            {/* Render Dropped Icons */}
            <AnimatePresence>
              {droppedIcons.map((icon) => (
                <motion.div
                  key={icon.id}
                  initial={{ scale: 0, opacity: 0, rotate: -90 }}
                  animate={{ scale: 1, opacity: 1, rotate: icon.rotation }}
                  exit={{ scale: 0, opacity: 0, rotate: 90 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={() => removeIcon(icon.id)}
                  className="absolute cursor-pointer hover:scale-110 hover:text-red-500 text-gray-800 transition-colors z-10"
                  style={{ top: icon.y, left: icon.x }}
                  title="Click to remove 1%">
                  <SpeakerWaveIcon className="w-8 h-8 drop-shadow-sm" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* 🖐️ RIGHT: The Drag Source Panel */}
          <div className="w-32 h-32 sm:w-32 sm:h-80 bg-gray-100 rounded-3xl flex flex-col items-center justify-center shrink-0 border border-gray-200 shadow-inner relative">
            {/* The Draggable Source Icon */}
            <motion.div
              drag
              dragSnapToOrigin={true}
              onDragEnd={handleDragEnd}
              whileDrag={{ scale: 1.5, cursor: "grabbing" }}
              whileHover={{ scale: 1.1 }}
              className="z-50 cursor-grab p-4 bg-white rounded-full shadow-md border border-gray-200 text-gray-800 hover:text-blue-600 transition-colors">
              <SpeakerWaveIcon className="w-8 h-8 pointer-events-none" />
            </motion.div>

            <p className="text-gray-400 text-[10px] font-bold mt-4 uppercase hidden sm:block">
              drag to box
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
