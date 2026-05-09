"use client";

import React, { useState, useRef } from "react";

export default function AlarmFromHell() {
  const [isRinging, setIsRinging] = useState(false);
  const [punishmentLevel, setPunishmentLevel] = useState(0);
  const [mathProblem, setMathProblem] = useState({ a: 0, b: 0 });
  const [userAnswer, setUserAnswer] = useState("");

  // States for Bad UX behaviors
  const [runawayPos, setRunawayPos] = useState({ top: "50%", left: "50%" });
  const [isHovering, setIsHovering] = useState(false);
  const [confirmStage, setConfirmStage] = useState(0); // 0: None, 1: Awake?, 2: REALLY?

  // Audio ref for the annoying alarm sound
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Generate random math problem (e.g., 47 x 18)
  const generateMath = () => {
    setMathProblem({
      a: Math.floor(Math.random() * 50) + 10,
      b: Math.floor(Math.random() * 20) + 10,
    });
    setUserAnswer("");
  };

  const startAlarm = () => {
    setIsRinging(true);
    setPunishmentLevel(0);
    setConfirmStage(0);
    generateMath();
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play();
    }
  };

  // Fake Stop (Actually snoozes for 5 seconds)
  const handleFakeStop = () => {
    setIsRinging(false);
    if (audioRef.current) audioRef.current.pause();

    // The villain move: Starts ringing again after 5 seconds
    setTimeout(() => {
      startAlarm();
    }, 5000);
  };

  // Moving Button Logic
  const handleRunaway = () => {
    if (!isHovering) setIsHovering(true);
    setRunawayPos({
      top: `${Math.floor(Math.random() * 80) + 10}%`,
      left: `${Math.floor(Math.random() * 80) + 10}%`,
    });
  };

  // Checking the Math Answer
  const checkAnswer = () => {
    const correct = mathProblem.a * mathProblem.b;
    if (parseInt(userAnswer) === correct) {
      // Start confirmation spam instead of stopping
      setConfirmStage(1);
    } else {
      // Punishment!
      setPunishmentLevel((prev) => prev + 1);
      generateMath(); // Give a new problem
      if (audioRef.current && audioRef.current.volume < 1) {
        audioRef.current.volume = Math.min(audioRef.current.volume + 0.2, 1);
      }
    }
  };

  // Screen shake classes based on punishment level
  const getShakeClass = () => {
    if (punishmentLevel === 0) return "";
    if (punishmentLevel === 1) return "animate-[bounce_0.5s_infinite]";
    if (punishmentLevel >= 2) return "animate-[ping_0.2s_infinite] bg-red-900";
    return "";
  };

  return (
    <main
      className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${isRinging ? "bg-red-600" : "bg-slate-900"}`}>
      {/* Hidden audio element (Add a real annoying alarm URL here for TikTok) */}
      <audio
        ref={audioRef}
        loop
        src="https://www.soundjay.com/buttons/sounds/beep-01a.mp3"
      />

      {!isRinging ? (
        <button
          onClick={startAlarm}
          className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl text-2xl shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all">
          Set Alarm ⏰
        </button>
      ) : (
        <div
          className={`w-full h-screen fixed inset-0 flex flex-col items-center justify-center p-4 ${getShakeClass()}`}>
          <h1 className="text-6xl font-black text-white mb-2 animate-pulse uppercase tracking-widest text-center shadow-black drop-shadow-2xl">
            Wake Up!
          </h1>
          <p className="text-red-200 mb-8 font-mono text-lg">
            Punishment Level: {punishmentLevel} 💀
          </p>

          {confirmStage === 0 && (
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 w-full max-w-md flex flex-col items-center relative z-10">
              <p className="text-white text-xl mb-4 font-medium text-center">
                Solve to Stop:
              </p>
              <div className="text-5xl font-black text-white mb-6 tracking-wider">
                {mathProblem.a} × {mathProblem.b}
              </div>

              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full text-center text-3xl p-4 rounded-xl bg-white/20 text-white placeholder-white/50 border-2 border-white/30 focus:border-white outline-none mb-6 font-mono"
                placeholder="???"
              />

              <div className="relative w-full h-24 mb-6">
                {/* The Runaway Submit Button */}
                <button
                  onMouseEnter={handleRunaway}
                  onClick={checkAnswer}
                  style={
                    isHovering
                      ? {
                          position: "absolute",
                          top: runawayPos.top,
                          left: runawayPos.left,
                          transform: "translate(-50%, -50%)",
                        }
                      : {}
                  }
                  className="w-full py-4 bg-slate-800 text-white font-bold rounded-xl shadow-xl transition-all duration-200">
                  Submit Answer
                </button>
              </div>

              {/* Fake Stop Button */}
              <button
                onClick={handleFakeStop}
                className="text-white/60 hover:text-white underline text-sm mt-4 transition-colors">
                Stop Alarm (Emergency)
              </button>
            </div>
          )}

          {/* Confirmation Spam Modals */}
          {confirmStage === 1 && (
            <div className="bg-white p-8 rounded-2xl shadow-2xl text-center z-50 transform scale-110">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">
                Are you awake?
              </h2>
              <button
                onClick={() => setConfirmStage(2)}
                className="w-full py-3 bg-emerald-500 text-white font-bold rounded-lg">
                Yes, I am awake.
              </button>
            </div>
          )}

          {confirmStage === 2 && (
            <div className="bg-red-500 p-8 rounded-2xl shadow-2xl text-center z-50 transform scale-125 rotate-2">
              <h2 className="text-3xl font-black text-white mb-6">
                Are you REALLY awake?? 🤡
              </h2>
              <button
                onClick={() => {
                  setIsRinging(false);
                  if (audioRef.current) audioRef.current.pause();
                }}
                className="w-full py-3 bg-slate-900 text-white font-bold rounded-lg animate-bounce">
                I SWEAR I AM! STOP!
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
