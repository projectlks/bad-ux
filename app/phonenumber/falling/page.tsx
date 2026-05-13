"use client";

import React, { useState, useEffect, useRef } from "react";

// ရူပဗေဒ (Physics) အတွက် လိုအပ်သော အချက်အလက်များ
interface FallingNumber {
  id: number;
  value: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isHovered: boolean;
  hitCooldown: number; // တိုက်မိပြီးပြီးချင်း ချက်ချင်း ပြန်ရပ်မသွားအောင် တားမယ့် Cooldown
}

const BALL_RADIUS = 24;

export default function PhoneCatcher() {
  const [digits, setDigits] = useState<(number | null)[]>(Array(11).fill(null));

  const [isPlaying, setIsPlaying] = useState(false);
  const [fallingNumbers, setFallingNumbers] = useState<FallingNumber[]>([]);

  const [gravity, setGravity] = useState(0.15);
  const [spawnRate, setSpawnRate] = useState(1000);

  const playAreaRef = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState({ w: 350, h: 500 });

  useEffect(() => {
    if (playAreaRef.current) {
      setBounds({
        w: playAreaRef.current.clientWidth,
        h: playAreaRef.current.clientHeight,
      });
    }
  }, [isPlaying]);

  const startGame = () => {
    setIsPlaying(true);
    setDigits(Array(11).fill(null));
    setFallingNumbers([]);
    setGravity(0.15);
    setSpawnRate(1000);
  };

  useEffect(() => {
    if (!isPlaying) return;

    const spawnInterval = setInterval(() => {
      setFallingNumbers((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          value: Math.floor(Math.random() * 10),
          x: BALL_RADIUS + Math.random() * (bounds.w - BALL_RADIUS * 2),
          y: -50,
          vx: (Math.random() - 0.5) * 6,
          vy: Math.random() * 2,
          isHovered: false,
          hitCooldown: 0,
        },
      ]);
    }, spawnRate);

    const speedInterval = setInterval(() => {
      setGravity((prev) => Math.min(0.6, prev + 0.05));
      setSpawnRate((prev) => Math.max(300, prev - 100));
    }, 5000);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(speedInterval);
    };
  }, [isPlaying, spawnRate, bounds.w]);

  // 2D Physics Engine (Bounce, Gravity & Collision)
  useEffect(() => {
    if (!isPlaying) return;
    let frameId: number;

    const gameLoop = () => {
      setFallingNumbers((prev) => {
        const next = prev.map((b) => ({ ...b }));

        // 1. Gravity and Movement
        next.forEach((b) => {
          if (b.hitCooldown > 0) {
            b.hitCooldown -= 1; // Cooldown ကို တဖြည်းဖြည်း လျှော့မယ်
          }

          if (b.isHovered) {
            // Hover လုပ်ထားချိန်မှာ Physics အရှိန်တွေ အကုန် 0 ဖြစ်ရပါမယ် (Collision တွက်ဖို့ အရေးကြီးပါတယ်)
            b.vx = 0;
            b.vy = 0;
          } else {
            b.vy += gravity;
            b.x += b.vx;
            b.y += b.vy;
          }
        });

        // 2. Wall Collisions
        next.forEach((b) => {
          if (b.x < BALL_RADIUS) {
            b.x = BALL_RADIUS;
            b.vx *= -0.8;
          }
          if (b.x > bounds.w - BALL_RADIUS) {
            b.x = bounds.w - BALL_RADIUS;
            b.vx *= -0.8;
          }
        });

        // 3. Ball-to-Ball Collisions
        for (let i = 0; i < next.length; i++) {
          for (let j = i + 1; j < next.length; j++) {
            const b1 = next[i];
            const b2 = next[j];

            const dx = b2.x - b1.x;
            const dy = b2.y - b1.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = BALL_RADIUS * 2;

            // တိုက်မိပြီဆိုရင်!
            if (dist < minDist && dist > 0) {
              const nx = dx / dist;
              const ny = dy / dist;
              const dvx = b1.vx - b2.vx;
              const dvy = b1.vy - b2.vy;
              let vn = dvx * nx + dvy * ny;

              // Hover လုပ်ထားတဲ့ ဂဏန်းကို တိုက်မိရင် လွင့်ထွက်သွားအောင် လုပ်တဲ့အပိုင်း
              if (b1.isHovered || b2.isHovered) {
                b1.isHovered = false;
                b2.isHovered = false;
                // တိုက်မိပြီးချင်း ချက်ချင်း ပြန်ရပ်မသွားအောင် 30 frames အထိ Cooldown ပေးထားမယ်
                b1.hitCooldown = 30;
                b2.hitCooldown = 30;

                // ရပ်နေတဲ့ကောင်ကို တိုက်မိရင် Physics လွင့်ထွက်အားတစ်ခု အတင်းထည့်ပေးမယ်
                if (vn <= 0) vn = 3;
              }

              if (vn > 0) {
                const bounce = 1.2; // Extra Bounciness (ပိုလွင့်အောင်)
                let impulse = ((1 + bounce) * vn) / 2;

                if (impulse < 5) impulse = 5; // တိုက်မိရင် အနည်းဆုံးတော့ အရှိန်တစ်ခုနဲ့ လွင့်ထွက်ရမယ်

                b1.vx -= impulse * nx;
                b1.vy -= impulse * ny;
                b2.vx += impulse * nx;
                b2.vy += impulse * ny;
              }

              // Positional Correction (အချင်းချင်း ထပ်မနေအောင် ပြန်ခွဲထုတ်ခြင်း)
              const overlap = minDist - dist;
              b1.x -= nx * overlap * 0.5;
              b1.y -= ny * overlap * 0.5;
              b2.x += nx * overlap * 0.5;
              b2.y += ny * overlap * 0.5;
            }
          }
        }

        return next.filter((b) => b.y < bounds.h + 50);
      });

      frameId = requestAnimationFrame(gameLoop);
    };

    frameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, gravity, bounds]);

  const catchNumber = (id: number, value: number) => {
    setFallingNumbers((prev) => prev.filter((num) => num.id !== id));
    setDigits((prev) => {
      const newDigits = [...prev];
      const firstEmptyIndex = newDigits.findIndex((d) => d === null);
      if (firstEmptyIndex !== -1) {
        newDigits[firstEmptyIndex] = value;
      }
      return newDigits;
    });
  };

  const removeDigit = (index: number) => {
    setDigits((prev) => {
      const newDigits = [...prev];
      newDigits[index] = null;
      return newDigits;
    });
  };

  const setHoverState = (id: number, isHovered: boolean) => {
    setFallingNumbers((prev) =>
      prev.map((num) => {
        if (num.id === id) {
          // လွင့်ထွက်နေတုန်း (hitCooldown ရှိနေတုန်း) Hover လုပ်လို့ မရအောင် တားထားပါတယ်
          if (isHovered && num.hitCooldown > 0) {
            return num;
          }
          return { ...num, isHovered };
        }
        return num;
      }),
    );
  };

  const isFull = digits.every((d) => d !== null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#F9FAFB] p-4 relative font-sans overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-200 rounded-full blur-[100px] opacity-40"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-200 rounded-full blur-[100px] opacity-40"></div>

      <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col h-187.5">
        <div className="text-center mb-6 flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 tracking-wide drop-shadow-sm mb-3">
            Catch Number To Fill The Phone!
          </h2>
          <p className="inline-block bg-red-50 text-red-600 text-sm font-bold px-4 py-2 rounded-full border border-red-200 shadow-sm tracking-wide">
            Hover to freeze. If hit, they fly away! 💥
          </p>
        </div>

        <div className="flex flex-row items-center space-x-1 justify-center w-full mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-200 shadow-inner">
          {digits.map((digit, index) => (
            <React.Fragment key={index}>
              <div
                onClick={() => digit !== null && removeDigit(index)}
                className={`w-6 h-8  sm:w-8 sm:h-10 flex items-center justify-center rounded-md text-lg sm:text-xl font-bold cursor-pointer transition-all ${
                  digit !== null
                    ? "bg-blue-100 text-blue-700 hover:bg-red-100 hover:text-red-600 shadow-sm border border-blue-200"
                    : "bg-gray-200/50 text-transparent border border-dashed border-gray-300"
                }`}>
                {digit !== null ? digit : "0"}
              </div>
              {index === 1 && (
                <span className="text-gray-400 font-bold mx-1">-</span>
              )}
              {(index === 4 || index === 7) && (
                <span className="w-1.5 sm:w-2"></span>
              )}
            </React.Fragment>
          ))}
        </div>

        <div
          ref={playAreaRef}
          className="flex-grow w-full bg-gray-900 rounded-3xl relative overflow-hidden shadow-inner border-4 border-gray-800">
          {!isPlaying ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80 backdrop-blur-sm z-20">
              <div className="text-6xl mb-4 animate-bounce">🌧️</div>
              <button
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black text-xl tracking-widest rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all">
                START GAME
              </button>
            </div>
          ) : isFull ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-500/90 backdrop-blur-sm z-20">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-white text-2xl font-black tracking-widest">
                NUMBER FULL!
              </h3>
              <button
                onClick={() => setIsPlaying(false)}
                className="mt-6 px-6 py-2 bg-white text-green-600 font-bold rounded-full shadow-md hover:bg-gray-100 active:scale-95 transition-all">
                Done
              </button>
            </div>
          ) : (
            fallingNumbers.map((num) => (
              <div
                key={num.id}
                className={`absolute w-12 h-12 rounded-full flex items-center justify-center text-2xl font-black shadow-[0_5px_15px_rgba(0,0,0,0.3)] cursor-pointer select-none transition-colors border-2 ${
                  num.isHovered
                    ? "bg-red-100 text-red-600 border-red-400 scale-110 z-20 shadow-[0_0_20px_rgba(239,68,68,0.5)]"
                    : "bg-white text-gray-800 border-gray-200 z-10 hover:bg-blue-50"
                }`}
                style={{
                  left: `${num.x - BALL_RADIUS}px`,
                  top: `${num.y - BALL_RADIUS}px`,
                }}
                onMouseEnter={() => setHoverState(num.id, true)}
                onMouseLeave={() => setHoverState(num.id, false)}
                onMouseDown={() => catchNumber(num.id, num.value)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  catchNumber(num.id, num.value);
                }}>
                {num.value}
              </div>
            ))
          )}

          {isPlaying && gravity > 0.3 && (
            <div className="absolute top-4 left-0 w-full text-center pointer-events-none z-30">
              <span className="bg-red-600 text-white px-3 py-1 text-[10px] font-black tracking-widest rounded-full animate-pulse shadow-md">
                GRAVITY WARNING! 🌍🔥
              </span>
            </div>
          )}
        </div>

        <div className="mt-6">
          <button
            disabled={!isFull}
            className={`w-full py-4 font-black rounded-xl shadow-md transition-all text-sm tracking-widest uppercase ${
              isFull
                ? "bg-gray-900 hover:bg-black text-white active:scale-95"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            onClick={() => alert(`Submitted Phone Number: ${digits.join("")}`)}>
            Confirm Number
          </button>
        </div>
      </div>
    </div>
  );
}
