    "use client";

import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { motion } from "motion/react";

export default function VolumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="fixed top-0 left-0 right-0 z-50 p-4 pointer-events-none">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="pointer-events-auto inline-block">
            <motion.div 
              whileHover={{ x: -4 }}
              className="flex items-center gap-2 bg-white/80 backdrop-blur-md border border-slate-200 px-4 py-2 rounded-full shadow-sm text-slate-600 hover:text-slate-900 transition-colors font-medium text-sm"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Back to Museum</span>
            </motion.div>
          </Link>
        </div>
      </nav>
      <div className="pt-16">{children}</div>
    </div>
  );
}