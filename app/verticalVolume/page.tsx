import React from "react";
import ElasticSlider from "./ElasticSlider";
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/outline";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 overflow-hidden">
      <h1 className="text-2xl font-bold mb-10 text-gray-700">
        Volume Setting (Good Luck)
      </h1>

      <ElasticSlider
        // ပြောင်းပြန်ဖြစ်နေတဲ့အတွက် Icon တွေကိုလည်း နေရာပြောင်းထားပါတယ်
        leftIcon={<SpeakerXMarkIcon className="w-6 h-6 text-gray-700" />}
        rightIcon={<SpeakerWaveIcon className="w-6 h-6 text-gray-700" />}
        startingValue={0}
        defaultValue={100}
        maxValue={100}
        isStepped={false} // အဆင့်တွေကို ဖွင့်လိုက်ပါပြီ
        stepSize={33.3} // ၃၃.၃ ရာခိုင်နှုန်းစီပဲ ကျော်ပါမယ်
      />
    </div>
  );
}
