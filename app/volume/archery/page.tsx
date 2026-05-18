"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

const VIEW_W = 600;
const VIEW_H = 400;
const BOW_X = 80;
const BOW_Y = 250;
const ARROW_LENGTH = 60;
const WALL = { x: 300, y: 150, w: 12, h: 250 };
const TARGET = { x: 570, y: 50, w: 30, h: 300 };
const GRAVITY = 0.4;
const POWER_MULTIPLIER = 0.15;
const MAX_PULL = 200;

export default function ArcheryVolume() {
  const [volume, setVolume] = useState<number>(0);
  const [status, setStatus] = useState<string>("Pull back anywhere to aim!");
  const [trajectory, setTrajectory] = useState<{ x: number; y: number }[]>([]);

  const arrowRef = useRef<SVGGElement>(null);
  const bowStringRef = useRef<SVGPathElement>(null);
  const bowGroupRef = useRef<SVGGElement>(null);
  const playAreaRef = useRef<HTMLDivElement>(null);

  const physics = useRef({
    isAiming: false,
    isFlying: false,
    startX: 0,
    startY: 0,
    pullX: 0,
    pullY: 0,
    x: BOW_X + ARROW_LENGTH,
    y: BOW_Y,
    vx: 0,
    vy: 0,
    reqId: 0,
  });

  const resetArrow = () => {
    physics.current.x = BOW_X + ARROW_LENGTH;
    physics.current.y = BOW_Y;
    physics.current.vx = 0;
    physics.current.vy = 0;
    physics.current.isFlying = false;

    if (arrowRef.current) {
      arrowRef.current.setAttribute(
        "transform",
        `translate(${BOW_X + ARROW_LENGTH}, ${BOW_Y}) rotate(0)`,
      );
    }
    if (bowStringRef.current) {
      // 🌟 [Fix] လေးညှို့ကြိုးကို V ပုံစံဖြင့် တိကျစွာ ပြန်ထားခြင်း
      bowStringRef.current.setAttribute(
        "d",
        `M ${BOW_X} ${BOW_Y - 80} L ${BOW_X} ${BOW_Y} L ${BOW_X} ${BOW_Y + 80}`,
      );
    }
    if (bowGroupRef.current) {
      bowGroupRef.current.setAttribute("opacity", "1");
    }

    setStatus("Pull back anywhere to aim!");
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (physics.current.isFlying) return;
    physics.current.isAiming = true;
    physics.current.startX = e.clientX;
    physics.current.startY = e.clientY;
    setStatus("Aiming... (Adjust angle and power)");
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!physics.current.isAiming) return;

    let dx = physics.current.startX - e.clientX;
    let dy = physics.current.startY - e.clientY;

    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > MAX_PULL) {
      dx = (dx / dist) * MAX_PULL;
      dy = (dy / dist) * MAX_PULL;
    }

    physics.current.pullX = dx;
    physics.current.pullY = dy;

    const vx = dx * POWER_MULTIPLIER;
    const vy = dy * POWER_MULTIPLIER;

    const angleRad = Math.atan2(vy, vx);
    const angleDeg = angleRad * (180 / Math.PI);

    if (bowStringRef.current) {
      // 🌟 [Fix] ကြိုးဆွဲလိုက်သောအခါ မြှားအမြီး(dx, dy) နေရာသို့ ကွက်တိရောက်လာအောင် ပြင်ဆင်ထားသည် 🌟
      bowStringRef.current.setAttribute(
        "d",
        `M ${BOW_X} ${BOW_Y - 80} L ${BOW_X - dx} ${BOW_Y - dy} L ${BOW_X} ${BOW_Y + 80}`,
      );
    }

    const headX = BOW_X - dx + ARROW_LENGTH * Math.cos(angleRad);
    const headY = BOW_Y - dy + ARROW_LENGTH * Math.sin(angleRad);

    if (arrowRef.current) {
      arrowRef.current.setAttribute(
        "transform",
        `translate(${headX}, ${headY}) rotate(${angleDeg})`,
      );
    }

    const points = [];
    let simX = headX;
    let simY = headY;
    let simVy = vy;

    for (let i = 0; i < 80; i++) {
      simX += vx;
      simY += simVy;
      simVy += GRAVITY;

      if (i % 3 === 0) points.push({ x: simX, y: simY });

      if (
        simX >= WALL.x &&
        simX <= WALL.x + WALL.w &&
        simY >= Math.max(0, WALL.y)
      )
        break;
      if (simX >= TARGET.x && simY >= TARGET.y && simY <= TARGET.y + TARGET.h)
        break;
      if (simY > VIEW_H) break;
    }
    setTrajectory(points);
  };

  
  useEffect(() => {
    setTimeout(() => {
      
      resetArrow();
    }, 0);
    return () => cancelAnimationFrame(physics.current.reqId);
  }, []);


  const handlePointerUp = () => {
    if (!physics.current.isAiming) return;
    physics.current.isAiming = false;
    physics.current.isFlying = true;
    setTrajectory([]);

    physics.current.vx = physics.current.pullX * POWER_MULTIPLIER;
    physics.current.vy = physics.current.pullY * POWER_MULTIPLIER;

    const angleRad = Math.atan2(physics.current.vy, physics.current.vx);
    physics.current.x =
      BOW_X - physics.current.pullX + ARROW_LENGTH * Math.cos(angleRad);
    physics.current.y =
      BOW_Y - physics.current.pullY + ARROW_LENGTH * Math.sin(angleRad);

    setStatus("Arrow released!");

    if (bowStringRef.current) {
      // 🌟 [Fix] မြှားလွှတ်လိုက်သောအခါ ကြိုးမူလအတိုင်းပြန်ဖြစ်သွားမည်
      bowStringRef.current.setAttribute(
        "d",
        `M ${BOW_X} ${BOW_Y - 80} L ${BOW_X} ${BOW_Y} L ${BOW_X} ${BOW_Y + 80}`,
      );
    }

    if (bowGroupRef.current) {
      bowGroupRef.current.setAttribute("opacity", "0.3");
    }

    const updatePhysics = () => {
      physics.current.x += physics.current.vx;
      physics.current.y += physics.current.vy;
      physics.current.vy += GRAVITY;

      const { x, y, vx, vy } = physics.current;
      let isHit = false;

      if (x >= WALL.x && x <= WALL.x + WALL.w && y >= WALL.y) {
        setStatus("Ouch! You hit the wall. Arch it higher!");
        isHit = true;
      } else if (
        x >= TARGET.x &&
        x <= TARGET.x + TARGET.w &&
        y >= TARGET.y &&
        y <= TARGET.y + TARGET.h
      ) {
        const hitPoint = y - TARGET.y;
        const newVol = Math.round(100 - (hitPoint / TARGET.h) * 100);
        const clampedVol = Math.max(0, Math.min(100, newVol));

        setVolume(clampedVol);
        setStatus(`🎯 Bullseye! Volume changed to ${clampedVol}%`);
        isHit = true;
      } else if (y > VIEW_H + 50 || x > VIEW_W + 50) {
        setStatus("Missed entirely... You are a terrible archer.");
        isHit = true;
      }

      if (arrowRef.current) {
        const currentAngle = Math.atan2(vy, vx) * (180 / Math.PI);
        arrowRef.current.setAttribute(
          "transform",
          `translate(${x}, ${y}) rotate(${currentAngle})`,
        );
      }

      if (!isHit) {
        physics.current.reqId = requestAnimationFrame(updatePhysics);
      } else {
        setTimeout(() => {
          if (!physics.current.isAiming) resetArrow();
        }, 1500);
      }
    };

    physics.current.reqId = requestAnimationFrame(updatePhysics);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen  min-h-150 p-4 font-sans select-none relative">
      <div className="w-full max-w-xl  border border-gray-200 rounded-[2rem] p-6 shadow-xl relative z-10 flex flex-col items-center">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-gray-800">Archery Volume</h2>
          <p className="text-gray-500 text-sm font-medium mt-1">
            Drag anywhere to aim. Shoot the arrow over the wall to change the
            volume.
          </p>
        </div>

        <div className="text-center mb-4">
          <h1 className="text-5xl font-black text-orange-500 tabular-nums trakking-wide">
            <span className="text-3xl text-gray-400 font-medium">
              Vol - 
            </span>
            {volume}
            <span className="text-2xl text-gray-300 ml-1 font-medium">%</span>
          </h1>
          <p className="text-sm font-bold text-gray-400 mt-2 h-5">{status}</p>
        </div>

        <div
          ref={playAreaRef}
          className="w-full aspect-[3/2] bg-sky-50 rounded-2xl overflow-hidden relative cursor-crosshair touch-none border-2 border-sky-100 shadow-inner"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}>
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="w-full h-full block">
            <rect
              x="0"
              y={VIEW_H - 10}
              width={VIEW_W}
              height="10"
              fill="#22c55e"
            />

            <rect
              x={WALL.x}
              y={WALL.y}
              width={WALL.w}
              height={WALL.h}
              fill="#475569"
              rx="4"
            />

            <defs>
              <linearGradient id="vol-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            <rect
              x={TARGET.x}
              y={TARGET.y}
              width={TARGET.w}
              height={TARGET.h}
              fill="url(#vol-gradient)"
              rx="6"
            />

            <text
              x={TARGET.x - 10}
              y={TARGET.y + 12}
              fill="#94a3b8"
              fontSize="14"
              fontWeight="bold"
              textAnchor="end">
              100
            </text>
            <text
              x={TARGET.x - 10}
              y={TARGET.y + TARGET.h}
              fill="#94a3b8"
              fontSize="14"
              fontWeight="bold"
              textAnchor="end">
              0
            </text>

            {trajectory.map((pt, i) => (
              <circle key={i} cx={pt.x} cy={pt.y} r="2" fill="#cbd5e1" />
            ))}

            <g ref={bowGroupRef} opacity={1}>
              <path
                d={`M ${BOW_X} ${BOW_Y - 80} Q ${BOW_X + 40} ${BOW_Y} ${BOW_X} ${BOW_Y + 80}`}
                fill="none"
                stroke="#b45309"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                ref={bowStringRef}
                d={`M ${BOW_X} ${BOW_Y - 80} L ${BOW_X} ${BOW_Y} L ${BOW_X} ${BOW_Y + 80}`}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
              />
            </g>

            {/* ➡️ 🌟 မြှားဒီဇိုင်း အသစ် 🌟 */}
            <g ref={arrowRef}>
              <line
                x1={`-${ARROW_LENGTH}`}
                y1="0"
                x2="0"
                y2="0"
                stroke="#334155"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <polygon points="0,0 -14,-6 -10,0 -14,6" fill="#0f172a" />
              {/* အမြီးပိုင်း အမွှေး (Feathers) ပုံစံအသစ် */}
              <polygon
                points={`-${ARROW_LENGTH},0 -52,-6 -42,-6 -48,0`}
                fill="#ef4444"
              />
              <polygon
                points={`-${ARROW_LENGTH},0 -52,6 -42,6 -48,0`}
                fill="#ef4444"
              />
            </g>
          </svg>
        </div>

        <button
          onClick={resetArrow}
          className="mt-6 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-500 transition-colors">
          <ArrowPathIcon className="w-4 h-4" />
          Give up and reset
        </button>
      </div>
    </div>
  );
}
