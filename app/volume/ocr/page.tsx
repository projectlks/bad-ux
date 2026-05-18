"use client";

import { useState, useRef } from "react";
import { motion } from "motion/react";
import {
  ArrowUpTrayIcon,
  CameraIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import Tesseract, { PSM } from "tesseract.js";

export default function OCRVolume() {
  const [volume, setVolume] = useState<number>(50);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanText, setScanText] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImageSrc(imageUrl);
    setErrorMsg("");
    setScanText("Waking up the AI...");
    setIsScanning(true);

    try {
      const worker = await Tesseract.createWorker("eng", 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setScanText(`Analyzing pixels... ${Math.round(m.progress * 100)}%`);
          }
        },
      });

      // 🌟 ကြားထဲက Watermark တွေနဲ့ အခြားစာတွေကိုပါ ကျော်ဖတ်နိုင်အောင် SPARSE_TEXT ကို သုံးပါမည် 🌟
      await worker.setParameters({
        tessedit_pageseg_mode: PSM.SPARSE_TEXT,
      });

      const result = await worker.recognize(imageUrl);
      const extractedText = result.data.text.trim();

      await worker.terminate();

      console.log("Raw AI Output:", extractedText);

      // 🌟 The Magic Fix 🌟
      // ဂဏန်းမဟုတ်တဲ့ (Non-digit) အရာမှန်သမျှကို ဖျက်ပစ်ပြီး၊ ဂဏန်းတွေကိုသာ ပေါင်းယူပါမည်
      // ဥပမာ - "4 watermark 2" ဆိုရင် "42" ဟု ထွက်လာပါမည်
      const allDigits = extractedText.replace(/\D/g, "");

      if (allDigits.length > 0) {
        let scannedNumber = parseInt(allDigits, 10);
        // ဂဏန်းကို 0 မှ 100 အတွင်းသာ ကန့်သတ်ခြင်း
        scannedNumber = Math.max(0, Math.min(100, scannedNumber));

        setVolume(scannedNumber);
        setScanText(`Success! Detected Number: ${scannedNumber}`);
      } else {
        setErrorMsg(`AI is confused. It saw: "${extractedText || "Nothing"}"`);
        setScanText("Failed to find a number.");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Scanner exploded. Check console for details.");
      setScanText("Scan failed.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    // 🌟 Layout မှ Background Color ဖယ်ရှားထားပါသည် 🌟
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[500px] p-4 font-sans relative">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-[2rem] p-8 shadow-xl relative z-10 flex flex-col items-center">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-gray-800">Paper Volume</h2>
          <p className="text-gray-500 text-xs font-medium mt-2">
            Want to change the volume? <br />
            1. Write a number on a piece of paper.
            <br />
            2. Take a photo and upload it here.
          </p>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-6xl font-black text-emerald-600 tabular-nums tracking-tighter transition-colors">
            {volume}
            <span className="text-3xl text-gray-300 ml-1 font-medium">%</span>
          </h1>
        </div>

        {/* 📸 Image Upload & Preview Section */}
        <div className="w-full relative flex flex-col items-center mb-6">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageUpload}
          />

          <div
            onClick={() => !isScanning && fileInputRef.current?.click()}
            className={`w-full h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all relative
              ${isScanning ? "border-gray-300 cursor-not-allowed opacity-70" : "border-emerald-300 hover:border-emerald-500 cursor-pointer hover:bg-emerald-50"}
            `}>
            {imageSrc ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc}
                  alt="Scanned paper"
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[2px]">
                  {isScanning ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: "linear",
                      }}>
                      <ArrowPathIcon className="w-10 h-10 text-emerald-600" />
                    </motion.div>
                  ) : (
                    <CameraIcon className="w-10 h-10 text-emerald-600 drop-shadow-md" />
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-emerald-600/60 p-4 text-center">
                <ArrowUpTrayIcon className="w-10 h-10 mb-2" />
                <span className="text-sm font-bold">Tap to Upload Photo</span>
                <span className="text-[10px] mt-1">Accepts JPG/PNG</span>
              </div>
            )}
          </div>
        </div>

        {/* 🧠 Scanner Status Output */}
        <div className="w-full min-h-[60px] bg-gray-50 rounded-xl border border-gray-100 p-4 flex flex-col items-center justify-center text-center">
          {isScanning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-1 bg-gray-200 rounded-full overflow-hidden mb-2">
              <motion.div
                className="h-full bg-emerald-500"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
            </motion.div>
          )}
          <p
            className={`text-xs font-bold ${errorMsg ? "text-red-500" : "text-gray-500"}`}>
            {errorMsg || scanText || "Waiting for your handwriting..."}
          </p>
        </div>
      </div>
    </div>
  );
}
