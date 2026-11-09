import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  "Initializing ABHINAV.OS...",
  "Loading Projects...",
  "Connecting GitHub...",
  "Fetching LeetCode...",
  "Loading Certificates...",
  "SYSTEM READY",
];

export default function LoadingScreen({ onDone }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setStep(i);
      if (i >= steps.length - 1) {
        clearInterval(interval);
        setTimeout(() => {
          setDone(true);
          setTimeout(onDone, 600);
        }, 600);
      }
    }, 350);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[999] bg-[#050508] flex flex-col items-center justify-center"
        >
          <div className="grid-bg absolute inset-0 opacity-30" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative text-center"
          >
            <div className="w-16 h-16 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-3xl shadow-2xl shadow-violet-500/40">
              ⚡
            </div>
            <h1 className="font-mono text-2xl font-bold gradient-text mb-8 tracking-widest">
              ABHINAV.OS
            </h1>
            <div className="w-64 mx-auto space-y-2 text-left">
              {steps.slice(0, step + 1).map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`font-mono text-xs flex items-center gap-2 ${
                    i === step ? "text-violet-400" : "text-gray-600"
                  }`}
                >
                  <span className={i === step ? "text-violet-400" : "text-emerald-500"}>
                    {i === step ? "▶" : "✓"}
                  </span>
                  {s}
                </motion.div>
              ))}
            </div>
            <div className="mt-8 w-64 mx-auto h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(step / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
