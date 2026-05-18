import {
    ArrowDownCircleIcon,
    RocketLaunchIcon,
    SquaresPlusIcon,
    CursorArrowRaysIcon,
    CpuChipIcon,
    CalculatorIcon,
    CubeIcon,
    ClockIcon,
    ArrowsUpDownIcon,
    BugAntIcon,
    ScaleIcon,
    CameraIcon
} from "@heroicons/react/24/outline";

// 🌟 'any' မသုံးဘဲ Type ကို တိတိကျကျ သတ်မှတ်ခြင်း
export type BadUXProject = {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    path: string;
    color: string;
    bg: string;
};

// 🌟 Terminal Output အရ Folder ၉ ခုလုံးအတွက် Data အပြည့်အစုံ
export const UX_PROJECTS: BadUXProject[] = [
    {
        id: "gravity",
        title: "Gravity Volume",
        description: "The slider falls back to zero due to gravity. Catch it if you can.",
        icon: ArrowDownCircleIcon,
        path: "/volume/gravity",
        color: "text-orange-500",
        bg: "bg-orange-50",
    },
    {
        id: "momentum",
        title: "Momentum Slider",
        description: "Slippery ice physics. Targeting exact numbers is impossible.",
        icon: RocketLaunchIcon,
        path: "/volume/momentum",
        color: "text-blue-500",
        bg: "bg-blue-50",
    },
    {
        id: "hundred",
        title: "100 Sliders (Average)",
        description: "100 separate sliders. You need all 100 at max to get 100%.",
        icon: SquaresPlusIcon,
        path: "/volume/hundred",
        color: "text-red-500",
        bg: "bg-red-50",
    },
    {
        id: "dragdrop",
        title: "Drag & Drop Pile",
        description: "Drag exactly 50 icons into the box to get 50% volume.",
        icon: CursorArrowRaysIcon,
        path: "/volume/drag-and-drop", // 👈 Folder နာမည်အတိုင်း အတိအကျ ထည့်ပေးထားပါသည်
        color: "text-purple-500",
        bg: "bg-purple-50",
    },
    {
        id: "binary",
        title: "Binary Volume",
        description: "Toggle 7 bits (0s and 1s) to set your volume. 1100100 = 100%.",
        icon: CpuChipIcon,
        path: "/volume/binary",
        color: "text-green-500",
        bg: "bg-green-50",
    },
    {
        id: "calculator",
        title: "Calculator Volume",
        description: "Manually calculate your desired volume. Don't divide by zero.",
        icon: CalculatorIcon,
        path: "/volume/calculator",
        color: "text-indigo-500",
        bg: "bg-indigo-50",
    },
    {
        id: "dice",
        title: "Dice Roll Volume",
        description: "Roll the dice to determine your volume. Feeling lucky today?",
        icon: CubeIcon,
        path: "/volume/dice",
        color: "text-pink-500",
        bg: "bg-pink-50",
    },
    {
        id: "loading",
        title: "Loading Bar Volume",
        description: "Wait for the volume to load. Stop it exactly at your desired percentage.",
        icon: ClockIcon,
        path: "/volume/loading",
        color: "text-teal-500",
        bg: "bg-teal-50",
    },
    {
        id: "vertical",
        title: "Vertical Slider",
        description: "A perfectly normal vertical slider... or is it hiding a dark secret?",
        icon: ArrowsUpDownIcon,
        path: "/volume/vertical",
        color: "text-cyan-500",
        bg: "bg-cyan-50",
    },
    {
        id: "random",
        title: "Chaos Slider",
        description: "A perfectly normal slider, but the numbers are completely scrambled. Pure gaslighting.",
        icon: BugAntIcon, // @heroicons/react/24/outline ထဲကနေ BugAntIcon လေး Import လုပ်လိုက်ပါ
        path: "/volume/random",
        color: "text-rose-500",
        bg: "bg-rose-50",
    },
    {
        id: "balance",
        title: "Balance Slider",
        description: "Volume is determined by torque. Grab weights, drop them on the seesaw, and pray they don't slide off when it tilts too much.",
        icon: ScaleIcon, // 🌟 အပေါ်ဆုံးမှာ import { ScaleIcon } from "@heroicons/react/24/outline"; ဆိုပြီး ထည့်ပေးပါ
        path: "/volume/balance",
        color: "text-blue-500",
        bg: "bg-blue-50",
    },
    {
        id: "ocr-volume",
        title: "Handwritten Volume",
        description: "Volume control is too easy. Let's make it harder. Write your desired volume on a paper, take a photo, and our AI will read it.",
        icon: CameraIcon, // 🌟 import { CameraIcon } from "@heroicons/react/24/outline"; 
        path: "/volume/ocr",
        color: "text-emerald-500",
        bg: "bg-emerald-50",
    },
];