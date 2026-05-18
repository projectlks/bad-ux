// "use client";

// import { useState, useMemo, useRef } from "react";
// import { motion, AnimatePresence, PanInfo } from "motion/react";
// import { ArrowPathIcon } from "@heroicons/react/24/solid";

// const WEIGHT_OPTIONS = [1, 5, 10, 25];
// const MAX_TORQUE = 1500;
// const MAX_ANGLE = 35;

// interface PlacedWeight {
//   id: number;
//   weight: number;
//   x: number;
// }

// export default function BalanceSliderDrag() {
//   const [weights, setWeights] = useState<PlacedWeight[]>([]);
//   const dropZoneRef = useRef<HTMLDivElement>(null);

//   const totalTorque = useMemo(() => {
//     return weights.reduce((acc, w) => acc + w.weight * w.x, 0);
//   }, [weights]);

//   const { angle, volume } = useMemo(() => {
//     const clampedTorque = Math.max(
//       -MAX_TORQUE,
//       Math.min(MAX_TORQUE, totalTorque),
//     );
//     const currentAngle = (clampedTorque / MAX_TORQUE) * MAX_ANGLE;
//     const currentVolume = Math.round(
//       ((currentAngle + MAX_ANGLE) / (MAX_ANGLE * 2)) * 100,
//     );
//     return { angle: currentAngle, volume: currentVolume };
//   }, [totalTorque]);

//   // အောက်ကနေ အသစ်ဆွဲတင်တဲ့အချိန် အလုပ်လုပ်မည့် Function
//   const handleDragEnd = (
//     weightValue: number,
//     event: MouseEvent | TouchEvent | PointerEvent,
//     info: PanInfo,
//   ) => {
//     if (!dropZoneRef.current) return;
//     const dropZone = dropZoneRef.current.getBoundingClientRect();
//     const { x, y } = info.point;

//     if (
//       x >= dropZone.left - 20 &&
//       x <= dropZone.right + 20 &&
//       y >= dropZone.top - 50 &&
//       y <= dropZone.bottom + 50
//     ) {
//       const relativeX = ((x - dropZone.left) / dropZone.width) * 100 - 50;
//       const clampedX = Math.max(-50, Math.min(50, relativeX));

//       setWeights((prev) => [
//         ...prev,
//         { id: Date.now(), weight: weightValue, x: clampedX },
//       ]);
//     }
//   };

//   // တင်ပြီးသား အလေးတုံးကို ပြန်ဆွဲတဲ့အချိန် အလုပ်လုပ်မည့် Function
//   const handlePlacedWeightDragEnd = (
//     id: number,
//     event: MouseEvent | TouchEvent | PointerEvent,
//     info: PanInfo,
//   ) => {
//     if (!dropZoneRef.current) return;
//     const dropZone = dropZoneRef.current.getBoundingClientRect();
//     const { x, y } = info.point;

//     // Dropzone ထဲ ပြန်ချရင် နေရာအသစ် ပြောင်းပေးမည်
//     if (
//       x >= dropZone.left - 20 &&
//       x <= dropZone.right + 20 &&
//       y >= dropZone.top - 50 &&
//       y <= dropZone.bottom + 50
//     ) {
//       const relativeX = ((x - dropZone.left) / dropZone.width) * 100 - 50;
//       const clampedX = Math.max(-50, Math.min(50, relativeX));

//       setWeights((prev) =>
//         prev.map((w) => (w.id === id ? { ...w, x: clampedX } : w)),
//       );
//     } else {
//       // Dropzone အပြင်ရောက်သွားရင် အလေးတုံးကို ဖယ်ရှားမည် (လွှင့်ပစ်မည်)
//       setWeights((prev) => prev.filter((w) => w.id !== id));
//     }
//   };

//   const handleReset = () => {
//     setWeights([]);
//   };

//   return (
//     <div className=" h-screen bg-gray-50 flex flex-col items-center justify-center font-sans select-none relative ">

//       <div className="w-full max-w-lg  border  border-gray-200 rounded-[2rem] p-8 shadow-xl relative z-10 flex flex-col items-center">
//         <div className="text-center mb-8">
//           <h2 className="text-2xl font-black text-gray-800">Balance Volume</h2>
//           <p className="text-gray-500 text-sm font-medium mt-1">
//             Grab a weight and drop it on the seesaw!
//           </p>
//         </div>

//         <div className="text-center mb-16">
//           <h1 className="text-6xl font-black text-blue-600 tabular-nums tracking-tighter transition-colors">
//             {volume}
//             <span className="text-3xl text-gray-300 ml-1 font-medium">%</span>
//           </h1>
//         </div>

//         {/* ⚖️ THE SEESAW DROP ZONE */}
//         <div
//           ref={dropZoneRef}
//           className="w-full relative h-32 flex flex-col items-center justify-end mb-16 px-4">
//           <motion.div
//             className="w-full h-3 bg-gray-200 rounded-full relative z-10"
//             animate={{ rotate: angle }}
//             transition={{ type: "spring", stiffness: 100, damping: 10 }}
//             style={{ originX: 0.5, originY: 0.5 }}>
//             {/* 🌟 Progress Bar Indicator */}
//             <motion.div
//               className="absolute top-0 left-0 h-full bg-blue-500 rounded-full pointer-events-none"
//               animate={{ width: `${volume}%` }}
//               transition={{ ease: "easeOut", duration: 0.2 }}
//             />

//             <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-5 bg-gray-400 rounded-full z-10"></div>
//             <AnimatePresence>
//               {weights.map((w) => (
//                 <div
//                   key={w.id}
//                   className="absolute w-0 flex justify-center z-50"
//                   style={{ left: `${w.x + 50}%`, bottom: "12px" }}>
//                   {/* 🌟 ပြင်ထားသော နေရာ: Animation များအားလုံးကို ဖျက်ပြီး key={w.x} ထည့်ထားသည် 🌟 */}
//                   <motion.div
//                     key={w.x}
//                     drag
//                     onDragEnd={(e, info) =>
//                       handlePlacedWeightDragEnd(w.id, e, info)
//                     }
//                     className="cursor-grab active:cursor-grabbing">
//                     <div
//                       className={`
//                       flex items-center justify-center text-white bg-slate-700 font-black text-[10px] rounded border-2 border-black/20 shadow-md
//                       ${
//                         w.weight === 1
//                           ? "w-5 h-5 "
//                           : w.weight === 5
//                             ? "w-6 h-6 "
//                             : w.weight === 10
//                               ? "w-8 h-8 "
//                               : "w-10 h-10 "
//                       }
//                     `}>
//                       {w.weight}
//                     </div>
//                   </motion.div>
//                 </div>
//               ))}
//             </AnimatePresence>
//           </motion.div>

//           <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[20px] border-b-gray-400 mt-1 z-0"></div>
//           <div className="w-12 h-2 bg-gray-300 rounded-full mt-1"></div>
//         </div>

//         {/* 🤌 DRAG SOURCES (Weights to Grab) */}
//         <div className="w-full bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col items-center">
//           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
//             Grab & Drag Weights
//           </p>
//           <div className="flex gap-4 items-end mb-6 min-h-[50px]">
//             {WEIGHT_OPTIONS.map((w) => (
//               <div
//                 key={w}
//                 className="relative flex flex-col items-center justify-end">
//                 <div
//                   className={`
//                   absolute bottom-0 opacity-10 rounded border-2 border-black/20 bg-slate-700
//                   ${
//                     w === 1
//                       ? "w-6 h-6"
//                       : w === 5
//                         ? "w-8 h-8"
//                         : w === 10
//                           ? "w-10 h-10"
//                           : "w-12 h-12"
//                   }
//                 `}
//                 />

//                 <motion.div
//                   drag
//                   dragSnapToOrigin={true}
//                   onDragEnd={(e, info) => handleDragEnd(w, e, info)}
//                   whileDrag={{ scale: 1.2, zIndex: 50, cursor: "grabbing" }}
//                   className={`
//                     relative z-40 flex items-center justify-center text-white bg-slate-700 font-black text-xs rounded shadow-lg border-2 border-black/20 cursor-grab active:cursor-grabbing
//                     ${
//                       w === 1
//                         ? "w-6 h-6"
//                         : w === 5
//                           ? "w-8 h-8"
//                           : w === 10
//                             ? "w-10 h-10"
//                             : "w-12 h-12"
//                     }
//                   `}>
//                   {w}
//                 </motion.div>
//               </div>
//             ))}
//           </div>

//           <button
//             onClick={handleReset}
//             className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-500 transition-colors">
//             <ArrowPathIcon className="w-4 h-4" />
//             Reset Balance
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "motion/react";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

const WEIGHT_OPTIONS = [1, 5, 10, 25];
const MAX_TORQUE = 1500;
const MAX_ANGLE = 35;
const SLIP_ANGLE = 25; // 🌟 ဒီဒီဂရီထက်ကျော်ရင် လျှောကျပါမည်

interface PlacedWeight {
  id: number;
  weight: number;
  x: number;
}

export default function BalanceSliderDrag() {
  const [weights, setWeights] = useState<PlacedWeight[]>([]);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Angle ကို Effect ထဲကနေ လှမ်းယူလို့ရအောင် Ref ထဲ ထည့်ထားပါမည်
  const angleRef = useRef<number>(0);

  const totalTorque = useMemo(() => {
    return weights.reduce((acc, w) => acc + w.weight * w.x, 0);
  }, [weights]);

  const { angle, volume } = useMemo(() => {
    const clampedTorque = Math.max(
      -MAX_TORQUE,
      Math.min(MAX_TORQUE, totalTorque),
    );
    const currentAngle = (clampedTorque / MAX_TORQUE) * MAX_ANGLE;
    const currentVolume = Math.round(
      ((currentAngle + MAX_ANGLE) / (MAX_ANGLE * 2)) * 100,
    );
    return { angle: currentAngle, volume: currentVolume };
  }, [totalTorque]);

  // Angle အသစ်ရတိုင်း Ref ကို Update လုပ်ပါမည်
  useEffect(() => {
    angleRef.current = angle;
  }, [angle]);

  // 🌟 1. Slipping Physics Loop (လျှောကျခြင်း) 🌟
  useEffect(() => {
    const slipInterval = setInterval(() => {
      const currentAngle = angleRef.current;

      // ၂၅ ဒီဂရီထက် ကျော်နေရင် လျှောကျမည်
      if (Math.abs(currentAngle) > SLIP_ANGLE) {
        setWeights((prev) => {
          // စောင်းတဲ့ ပမာဏပေါ်မူတည်ပြီး လျှောကျမည့် အမြန်နှုန်း တွက်မည်
          const slipSpeed = (Math.abs(currentAngle) - SLIP_ANGLE) * 0.15;
          const direction = currentAngle > 0 ? 1 : -1;

          const updatedWeights = prev.map((w) => ({
            ...w,
            x: w.x + direction * slipSpeed, // အောက်ဘက်သို့ လျှောဆင်းမည်
          }));

          // x တန်ဖိုး 55 ထက်ကျော်ရင် (သို့) -55 ထက်ငယ်ရင် ဘားတန်းပေါ်ကနေ ပြုတ်ကျသွားမည် (ဖယ်ရှားမည်)
          return updatedWeights.filter((w) => w.x >= -55 && w.x <= 55);
        });
      }
    }, 50); // စက္ကန့်ဝက်တိုင်း Physics ကို တွက်မည်

    return () => clearInterval(slipInterval);
  }, []);

  // 🌟 3. Visual Stress တွက်ချက်ခြင်း 🌟
  const stressRatio = Math.abs(totalTorque) / MAX_TORQUE;
  // Torque 60% ကျော်ရင် လိမ္မော်ရောင်၊ 85% ကျော်ရင် အနီရောင်ပြောင်းမည်
  const trackColor =
    stressRatio > 0.85 ? "#ef4444" : stressRatio > 0.6 ? "#f59e0b" : "#e5e7eb";
  // Torque 90% ကျော်ရင် တုန်ခါမည်
  const isShaking = stressRatio > 0.9;

  // အောက်ကနေ အသစ်ဆွဲတင်တဲ့အချိန် အလုပ်လုပ်မည့် Function
  const handleDragEnd = (
    weightValue: number,
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (!dropZoneRef.current) return;
    const dropZone = dropZoneRef.current.getBoundingClientRect();
    const { x, y } = info.point;

    if (
      x >= dropZone.left - 20 &&
      x <= dropZone.right + 20 &&
      y >= dropZone.top - 50 &&
      y <= dropZone.bottom + 50
    ) {
      const relativeX = ((x - dropZone.left) / dropZone.width) * 100 - 50;
      const clampedX = Math.max(-50, Math.min(50, relativeX));

      setWeights((prev) => [
        ...prev,
        { id: Date.now(), weight: weightValue, x: clampedX },
      ]);
    }
  };

  // တင်ပြီးသား အလေးတုံးကို ပြန်ဆွဲတဲ့အချိန် အလုပ်လုပ်မည့် Function
  const handlePlacedWeightDragEnd = (
    id: number,
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (!dropZoneRef.current) return;
    const dropZone = dropZoneRef.current.getBoundingClientRect();
    const { x, y } = info.point;

    // Dropzone ထဲ ပြန်ချရင် နေရာအသစ် ပြောင်းပေးမည်
    if (
      x >= dropZone.left - 20 &&
      x <= dropZone.right + 20 &&
      y >= dropZone.top - 50 &&
      y <= dropZone.bottom + 50
    ) {
      const relativeX = ((x - dropZone.left) / dropZone.width) * 100 - 50;
      const clampedX = Math.max(-50, Math.min(50, relativeX));

      setWeights((prev) =>
        prev.map((w) => (w.id === id ? { ...w, x: clampedX } : w)),
      );
    } else {
      // Dropzone အပြင်ရောက်သွားရင် အလေးတုံးကို ဖယ်ရှားမည် (လွှင့်ပစ်မည်)
      setWeights((prev) => prev.filter((w) => w.id !== id));
    }
  };

  const handleReset = () => {
    setWeights([]);
  };

  return (
    <div className=" h-screen  flex flex-col  items-center justify-center font-sans select-none relative ">
      <div className="w-full max-w-lg border border-gray-200 rounded-[2rem] p-8 shadow-xl relative z-10 flex flex-col items-center">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-gray-800">Balance Volume</h2>
          <p className="text-gray-500 text-sm font-medium mt-1">
            Grab a weight and drop it on the seesaw!
          </p>
        </div>

        <div className="text-center mb-16">
          <h1
            className={`text-6xl font-black tabular-nums tracking-tighter transition-colors ${stressRatio > 0.85 ? "text-red-600" : "text-blue-600"}`}>
            {volume}
            <span className="text-3xl text-gray-300 ml-1 font-medium">%</span>
          </h1>
        </div>

        {/* ⚖️ THE SEESAW DROP ZONE */}
        <div
          ref={dropZoneRef}
          className="w-full relative h-32 flex flex-col items-center justify-end mb-16 px-4">
          <motion.div
            className="w-full h-3 rounded-full relative z-10"
            animate={{
              rotate: angle,
              backgroundColor: trackColor,
              x: isShaking ? [-3, 3, -3, 3, 0] : 0,
            }}
            // 🌟 2. Bounciness လျှော့ချခြင်း (damping: 5 ဖြင့် ပိုယိမ်းထိုးစေသည်) 🌟
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 5,
              x: { duration: 0.1, repeat: isShaking ? Infinity : 0 },
            }}
            style={{ originX: 0.5, originY: 0.5 }}>
            {/* 🌟 Progress Bar Indicator */}
            <motion.div
              className={`absolute top-0 left-0 h-full rounded-full pointer-events-none transition-colors ${stressRatio > 0.85 ? "bg-red-600" : "bg-blue-500"}`}
              animate={{ width: `${volume}%` }}
              transition={{ ease: "easeOut", duration: 0.2 }}
            />

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-5 bg-gray-400 rounded-full z-10"></div>
            <AnimatePresence>
              {weights.map((w) => (
                <div
                  key={w.id}
                  className="absolute w-0 flex justify-center z-50"
                  style={{ left: `${w.x + 50}%`, bottom: "12px" }}>
                  {/* 🌟 ပြင်ထားသော နေရာ: Animation များအားလုံးကို ဖျက်ပြီး key={w.x} ထည့်ထားသည် 🌟 */}
                  <motion.div
                    key={w.x}
                    drag
                    onDragEnd={(e, info) =>
                      handlePlacedWeightDragEnd(w.id, e, info)
                    }
                    className="cursor-grab active:cursor-grabbing">
                    <div
                      className={`
                      flex items-center justify-center text-white bg-slate-700 font-black text-[10px] rounded border-2 border-black/20 shadow-md
                      ${
                        w.weight === 1
                          ? "w-5 h-5 "
                          : w.weight === 5
                            ? "w-6 h-6 "
                            : w.weight === 10
                              ? "w-8 h-8 "
                              : "w-10 h-10 "
                      }
                      ${isShaking ? "animate-pulse" : ""}
                    `}>
                      {w.weight}
                    </div>
                  </motion.div>
                </div>
              ))}
            </AnimatePresence>
          </motion.div>

          <div className="w-0 h-0 border-l-15 border-l-transparent border-r-15 border-r-transparent border-b-20 border-b-gray-400 mt-1 z-0"></div>
          <div className="w-12 h-2 bg-gray-300 rounded-full mt-1"></div>
        </div>

        {/* 🤌 DRAG SOURCES (Weights to Grab) */}
        <div className="w-full bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col items-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
            Grab & Drag Weights
          </p>
          <div className="flex gap-4 items-end mb-6 min-h-12.5">
            {WEIGHT_OPTIONS.map((w) => (
              <div
                key={w}
                className="relative flex flex-col items-center justify-end">
                <div
                  className={`
                  absolute bottom-0 opacity-10 rounded border-2 border-black/20 bg-slate-700
                  ${
                    w === 1
                      ? "w-6 h-6"
                      : w === 5
                        ? "w-8 h-8"
                        : w === 10
                          ? "w-10 h-10"
                          : "w-12 h-12"
                  }
                `}
                />

                <motion.div
                  drag
                  dragSnapToOrigin={true}
                  onDragEnd={(e, info) => handleDragEnd(w, e, info)}
                  whileDrag={{ scale: 1.2, zIndex: 50, cursor: "grabbing" }}
                  className={`
                    relative z-40 flex items-center justify-center text-white bg-slate-700 font-black text-xs rounded shadow-lg border-2 border-black/20 cursor-grab active:cursor-grabbing
                    ${
                      w === 1
                        ? "w-6 h-6"
                        : w === 5
                          ? "w-8 h-8"
                          : w === 10
                            ? "w-10 h-10"
                            : "w-12 h-12"
                    }
                  `}>
                  {w}
                </motion.div>
              </div>
            ))}
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-500 transition-colors">
            <ArrowPathIcon className="w-4 h-4" />
            Reset Balance
          </button>
        </div>
      </div>
    </div>
  );
}