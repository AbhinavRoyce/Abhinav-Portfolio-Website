import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Sparkles, Command } from "lucide-react";

import Navbar from "./components/ui/Navbar";
import ScrollProgress from "./components/ui/ScrollProgress";
import LoadingScreen from "./components/ui/LoadingScreen";
import CommandPalette from "./components/ui/CommandPalette";
import AIAssistant from "./components/ui/AIAssistant";
import HeroSection from "./components/hero/HeroSection";
import ExperienceSection from "./components/experience/ExperienceSection";
import ProjectsSection from "./components/projects/ProjectsSection";
import StatsSection from "./components/stats/StatsSection";
import ContributionWall from "./components/stats/ContributionWall";
import CertificatesSection from "./components/certificates/CertificatesSection";
import SkillsSection from "./components/skills/SkillsSection";
import TimelineSection from "./components/timeline/TimelineSection";
import ResumeSection from "./components/resume/ResumeSection";
import ContactSection from "./components/contact/ContactSection";
import TerminalUI from "./components/terminal/TerminalUI";

import { PORTFOLIO_CONFIG } from "./data/config";
import { Zap, GitBranch } from "lucide-react";

function CurrentlyBuilding() {
  const cfg = PORTFOLIO_CONFIG;
  return (
    <section id="building" className="py-16 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-[2px] bg-emerald-500" />
            <span className="text-emerald-400 text-sm font-mono font-medium">currently building</span>
          </div>
          <h2 className="text-2xl font-black text-white">
            Active <span className="text-emerald-400">Development</span>
          </h2>
          <p className="text-gray-600 text-sm mt-1">What I'm working on right now</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {cfg.currentBuilding.map((item) => (
            <div key={item.id} className="bento-card border-emerald-500/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-transparent opacity-60" />
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-400 font-mono font-medium">{item.status}</span>
              </div>
              <h3 className="font-bold text-white mb-2">{item.name}</h3>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">{item.desc}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {item.tech.map((t) => <span key={t} className="tech-badge">{t}</span>)}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <Zap size={10} className="text-emerald-500" /> Milestone: {item.milestone}
                </span>
                <span>Updated {item.lastUpdated}</span>
              </div>
              {item.githubUrl && (
                <a
                  href={item.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/5 text-xs text-violet-400 hover:text-violet-300 transition-colors"
                >
                  <GitBranch size={11} /> View on GitHub ↗
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Floating FAB group
function FloatingActions({ onTerminal, onAI, onPalette }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Sub buttons */}
      <AnimatePresence>
        {expanded && (
          <>
            <motion.button
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ delay: 0.05 }}
              onClick={() => { onAI(); setExpanded(false); }}
              className="w-11 h-11 rounded-full bg-gradient-to-br from-pink-500 to-violet-600 flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
              title="Ask Abhinav AI"
            >
              <Sparkles size={17} className="text-white" />
            </motion.button>
            <motion.button
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ delay: 0.1 }}
              onClick={() => { onTerminal(); setExpanded(false); }}
              className="w-11 h-11 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
              title="Open Terminal"
            >
              <Terminal size={17} className="text-violet-400" />
            </motion.button>
            <motion.button
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ delay: 0.15 }}
              onClick={() => { onPalette(); setExpanded(false); }}
              className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
              title="Command Palette (⌘K)"
            >
              <Command size={17} className="text-white" />
            </motion.button>
          </>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: "spring" }}
        onClick={() => setExpanded(!expanded)}
        className={`w-13 h-13 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-2xl shadow-violet-500/40 hover:scale-110 transition-all ${expanded ? "rotate-45" : ""}`}
        style={{ width: "52px", height: "52px" }}
        aria-label="Open utilities"
      >
        <motion.div animate={{ rotate: expanded ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <span className="text-white text-xl font-bold">+</span>
        </motion.div>
      </motion.button>
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((p) => !p);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "`") {
        e.preventDefault();
        setTerminalOpen((p) => !p);
      }
      if (e.key === "Escape") {
        setTerminalOpen(false);
        setPaletteOpen(false);
        setAiOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <LoadingScreen onDone={() => setLoading(false)} />

      <AnimatePresence>
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-[#050508] text-white overflow-x-hidden"
          >
            <ScrollProgress />
            <Navbar
              onTerminalOpen={() => setTerminalOpen(true)}
              onPaletteOpen={() => setPaletteOpen(true)}
            />

            <main>
              <HeroSection />
              <ExperienceSection />
              <ProjectsSection />
              <StatsSection />
              <ContributionWall />
              <CertificatesSection />
              <SkillsSection />
              <TimelineSection />
              <ResumeSection />
              <CurrentlyBuilding />
              <ContactSection />
            </main>

            {/* Floating utilities */}
            <FloatingActions
              onTerminal={() => setTerminalOpen(true)}
              onAI={() => setAiOpen(true)}
              onPalette={() => setPaletteOpen(true)}
            />

            <TerminalUI isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />
            <AIAssistant isOpen={aiOpen} onClose={() => setAiOpen(false)} />
            <CommandPalette
              isOpen={paletteOpen}
              onClose={() => setPaletteOpen(false)}
              onTerminalOpen={() => setTerminalOpen(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
