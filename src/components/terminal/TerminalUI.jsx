import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Square, Terminal } from "lucide-react";
import { PORTFOLIO_CONFIG } from "../../data/config";

const COMMANDS = {
  help: () => [
    "Available commands:",
    "  whoami       — About Abhinav",
    "  about        — Professional summary",
    "  skills       — Technology stack",
    "  projects     — Project list",
    "  experience   — Work experience",
    "  github       — GitHub profile link",
    "  leetcode     — LeetCode profile link",
    "  certificates — Certifications",
    "  resume       — Download resume",
    "  contact      — Contact info",
    "  clear        — Clear terminal",
  ],
  whoami: (cfg) => [`${cfg.name} — ${cfg.tagline}`, `Location: ${cfg.location}`, `Status: ${cfg.availabilityText}`],
  about: (cfg) => [cfg.heroIntro],
  skills: (cfg) => [
    "Languages: " + cfg.skills.languages.map((s) => s.name).join(", "),
    "Frontend:  " + cfg.skills.frontend.map((s) => s.name).join(", "),
    "Backend:   " + cfg.skills.backend.map((s) => s.name).join(", "),
    "ML & AI:   " + cfg.skills.ml.map((s) => s.name).join(", "),
    "DevOps:    " + cfg.skills.devops.map((s) => s.name).join(", "),
  ],
  projects: (cfg) => cfg.projects.map((p) => `[${p.status}] ${p.title} — ${p.tech.slice(0, 3).join(", ")}`),
  experience: (cfg) => cfg.experience.map((e) => `${e.role} @ ${e.company} (${e.duration})`),
  github: (cfg) => [`Opening GitHub: ${cfg.githubUrl}`, "→ " + cfg.githubUrl],
  leetcode: (cfg) => [`Opening LeetCode: ${cfg.leetcodeUrl}`, "→ " + cfg.leetcodeUrl],
  certificates: (cfg) => cfg.certificates.map((c) => `${c.title} — ${c.issuer} (${c.date})`),
  resume: (cfg) => [`Resume: ${cfg.resumeUrl}`, "Use the Download Resume button in the hero section."],
  contact: (cfg) => [`Email: ${cfg.email}`, `LinkedIn: ${cfg.linkedinUrl}`, `GitHub: ${cfg.githubUrl}`],
};

const lineColor = {
  command: "text-violet-400",
  output: "text-gray-300",
  error: "text-red-400",
  info: "text-cyan-400",
};

export default function TerminalUI({ isOpen, onClose }) {
  const [lines, setLines] = useState([
    { text: "Welcome to ABHINAV.OS Terminal v1.0", type: "info" },
    { text: "Type 'help' for available commands.", type: "info" },
    { text: "", type: "output" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const cfg = PORTFOLIO_CONFIG;

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const execute = (cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    const newLines = [{ text: `$ ${cmd}`, type: "command" }];

    if (trimmed === "clear") {
      setLines([{ text: "Terminal cleared.", type: "info" }]);
      return;
    }

    if (trimmed === "") {
      setLines((prev) => [...prev, { text: "", type: "output" }]);
      return;
    }

    if (COMMANDS[trimmed]) {
      const result = COMMANDS[trimmed](cfg);
      result.forEach((r) => newLines.push({ text: r, type: "output" }));

      if (trimmed === "github") window.open(cfg.githubUrl, "_blank");
      if (trimmed === "leetcode") window.open(cfg.leetcodeUrl, "_blank");
    } else {
      newLines.push({ text: `Command not found: '${trimmed}'. Type 'help' for commands.`, type: "error" });
    }

    newLines.push({ text: "", type: "output" });
    setLines((prev) => [...prev, ...newLines]);
    setHistory((prev) => [cmd, ...prev.slice(0, 49)]);
    setHistIdx(-1);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") {
      execute(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(idx);
      setInput(history[idx] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      setInput(idx === -1 ? "" : history[idx]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-20 right-6 z-50 w-[90vw] max-w-xl shadow-2xl"
        >
          {/* Window chrome */}
          <div className="glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            {/* Title bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-black/30">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-violet-400" />
                <span className="text-xs text-gray-400 font-mono">abhinav@portfolio ~</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <button onClick={onClose} className="ml-2 text-gray-500 hover:text-white transition-colors">
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Output */}
            <div
              className="h-72 overflow-y-auto p-4 font-mono text-xs leading-relaxed cursor-text"
              onClick={() => inputRef.current?.focus()}
            >
              {lines.map((line, i) => (
                <div key={i} className={lineColor[line.type]}>
                  {line.text || "\u00A0"}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 px-4 py-3 border-t border-white/5 bg-black/20">
              <span className="text-violet-400 font-mono text-xs">$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                className="flex-1 bg-transparent outline-none text-gray-200 font-mono text-xs placeholder-gray-700"
                placeholder="type a command..."
                autoComplete="off"
                spellCheck={false}
                aria-label="Terminal input"
              />
              <span className="terminal-cursor" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
