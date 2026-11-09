import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronRight, Code2, Briefcase, Award, Star, Terminal, Mail, Download, User } from "lucide-react";

const COMMANDS = [
  { id: "hero", label: "Go to Home", icon: User, section: "#hero", category: "Navigation" },
  { id: "experience", label: "View Experience", icon: Briefcase, section: "#experience", category: "Navigation" },
  { id: "projects", label: "Browse Projects", icon: Code2, section: "#projects", category: "Navigation" },
  { id: "stats", label: "GitHub & LeetCode Stats", icon: Star, section: "#stats", category: "Navigation" },
  { id: "certificates", label: "Certificate Vault", icon: Award, section: "#certificates", category: "Navigation" },
  { id: "skills", label: "Technology Stack", icon: Code2, section: "#skills", category: "Navigation" },
  { id: "timeline", label: "Developer Timeline", icon: Star, section: "#timeline", category: "Navigation" },
  { id: "resume", label: "Interactive Resume", icon: User, section: "#resume", category: "Navigation" },
  { id: "contact", label: "Contact Me", icon: Mail, section: "#contact", category: "Navigation" },
  { id: "download-resume", label: "Download Resume PDF", icon: Download, section: null, action: () => { const a = document.createElement("a"); a.href = "/resume.pdf"; a.download = "resume.pdf"; a.click(); }, category: "Actions" },
  { id: "terminal", label: "Open Terminal", icon: Terminal, section: null, category: "Actions" },
];

export default function CommandPalette({ isOpen, onClose, onTerminalOpen }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);

  const filtered = COMMANDS.filter(
    (c) =>
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  const execute = (cmd) => {
    if (cmd.id === "terminal") {
      onTerminalOpen?.();
    } else if (cmd.action) {
      cmd.action();
    } else if (cmd.section) {
      document.getElementById(cmd.section.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
    }
    onClose();
  };

  const handleKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelected((s) => Math.min(s + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
    if (e.key === "Enter" && filtered[selected]) execute(filtered[selected]);
    if (e.key === "Escape") onClose();
  };

  const grouped = filtered.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {});

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[20vh]"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-xl mx-4 glass rounded-2xl border border-white/12 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/8">
              <Search size={16} className="text-gray-500 flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Search commands, sections..."
                className="flex-1 bg-transparent outline-none text-white placeholder-gray-600 text-sm"
              />
              <kbd className="hidden sm:block text-xs text-gray-600 border border-white/10 rounded px-1.5 py-0.5">ESC</kbd>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto py-2">
              {Object.entries(grouped).map(([cat, cmds]) => (
                <div key={cat}>
                  <div className="px-4 py-1.5 text-xs text-gray-600 font-medium">{cat}</div>
                  {cmds.map((cmd) => {
                    const globalIdx = filtered.indexOf(cmd);
                    const Icon = cmd.icon;
                    return (
                      <button
                        key={cmd.id}
                        onMouseEnter={() => setSelected(globalIdx)}
                        onClick={() => execute(cmd)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all ${
                          selected === globalIdx ? "bg-violet-500/15 text-white" : "text-gray-400 hover:text-white"
                        }`}
                      >
                        <Icon size={14} className={selected === globalIdx ? "text-violet-400" : "text-gray-600"} />
                        {cmd.label}
                        <ChevronRight size={12} className="ml-auto text-gray-700" />
                      </button>
                    );
                  })}
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-8 text-gray-600 text-sm">No commands found</div>
              )}
            </div>

            {/* Footer hint */}
            <div className="flex items-center gap-4 px-4 py-2 border-t border-white/5 text-xs text-gray-700">
              <span><kbd className="border border-white/10 rounded px-1">↑↓</kbd> navigate</span>
              <span><kbd className="border border-white/10 rounded px-1">↵</kbd> select</span>
              <span><kbd className="border border-white/10 rounded px-1">esc</kbd> close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
