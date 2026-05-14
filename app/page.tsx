"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { UX_PROJECTS } from "../data/projects";

export default function BadUXHome() {
  // 🌟 မိမိ၏ တကယ့် GitHub လင့်ခ်ကို ဤနေရာတွင် အစားထိုးပါ
  const GITHUB_URL = "https://github.com/projectlks/bad-ux";

  return (
    <div className="min-h-screen flex flex-col items-center p-6 sm:p-12 font-sans select-none relative overflow-x-hidden">
      {/* 📌 Background Details */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#000_1px,transparent_1px)] bg-[size:16px_16px]"></div>

      <div className="w-full max-w-full relative z-10">
        {/* 📌 Header Section */}
        <div className="text-center mb-16 mt-12 sm:mt-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-red-500 bg-red-50 py-2 px-4 rounded-full border border-red-100 mb-6 inline-block">
              Welcome to Hell
            </span>
            <h1 className="text-5xl sm:text-6xl font-black text-gray-900 mb-6 tracking-wide">
              The Museum of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                Bad UX
              </span>
            </h1>
            <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              A collection of the most frustrating, over-engineered, and
              user-hostile UI elements ever created. Try them at your own risk.
            </p>
          </motion.div>

          {/* 🌟 Buttons Section with Framer Motion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }} // စာတွေပေါ်ပြီး နည်းနည်းနေမှ ထွက်လာအောင် delay ထည့်ထားပါသည်
            className="flex flex-wrap items-center justify-center gap-4 w-fit mx-auto mt-8">
            {/* 🌟 Button 1: LinkedIn (For Professional Connections) */}
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://linkedin.com/in/your_profile"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#0A66C2] text-white hover:bg-[#084e96] py-2 px-5 rounded-full shadow-md hover:shadow-lg transition-colors font-bold text-sm shrink-0">
              {/* LinkedIn Logo SVG */}
              <svg
                className="w-4 h-4 shrink-0 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span>Follow for more chaos</span>
            </motion.a>

            {/* Button 2: GitHub Star */}
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50 py-2 px-5 rounded-full shadow-sm hover:shadow-md transition-colors font-bold text-sm shrink-0">
              <svg
                className="w-5 h-5 shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Star on GitHub</span>
            </motion.a>
          </motion.div>
        </div>

        {/* 📌 Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-6 w-full">
          {UX_PROJECTS.map((project, index) => {
            const IconComponent = project.icon;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full">

              
                <Link href={project.path} className="block group h-full">
                  <div className="bg-white border border-gray-200 rounded-[2rem] p-8 shadow-sm hover:shadow transition-all duration-300 h-full flex flex-col group-hover:-translate-y-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${project.bg}`}>
                        <IconComponent className={`w-7 h-7 ${project.color}`} />
                      </div>
                      <h2 className="text-2xl font-black text-gray-800 group-hover:text-blue-600 transition-colors">
                        {project.title}
                      </h2>
                    </div>

                    <p className="text-gray-500 font-medium mb-8 grow">
                      {project.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors">
                        Experience Pain
                      </span>
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors shrink-0">
                        <span className="text-gray-400 group-hover:text-blue-600 font-black">
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* 📌 Footer with GitHub CTA */}
        <div className="mt-20 text-center pb-10 flex flex-col items-center justify-center">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">
            Built with frustration & Next.js
          </p>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-yellow-500 transition-colors">
            <span>If you hate this, leave a star</span>
            <svg
              className="w-5 h-5 text-gray-300 group-hover:text-yellow-400 transition-colors shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
