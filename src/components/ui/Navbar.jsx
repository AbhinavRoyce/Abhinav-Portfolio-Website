import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Code2, Terminal, Command } from "lucide-react";

const navItems = [
  { label: "Home", href: "#hero" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Stats", href: "#stats" },
  { label: "Certificates", href: "#certificates" },
  { label: "Skills", href: "#skills" },
  { label: "Timeline", href: "#timeline" },
  { label: "Resume", href: "#resume" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({ onTerminalOpen, onPaletteOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href) => {
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-2xl" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <button
          onClick={() => scrollTo("#hero")}
          className="flex items-center gap-2 font-black text-xl tracking-tight"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
            <Code2 size={16} className="text-white" />
          </div>
          <span className="gradient-text">AR</span>
        </button>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-0.5">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => scrollTo(item.href)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPaletteOpen}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-xs text-gray-500 border border-white/8 hover:border-violet-500/25 hover:text-gray-300 transition-all"
            title="Command Palette (⌘K)"
          >
            <Command size={12} />
            <span className="font-mono">⌘K</span>
          </button>
          <button
            onClick={onTerminalOpen}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-sm text-gray-300 hover:text-violet-400 transition-all border border-white/10 hover:border-violet-500/30"
            title="Open Terminal (Ctrl+`)"
          >
            <Terminal size={14} />
          </button>
          <a
            href="/resume.pdf"
            download
            className="btn-primary text-sm py-1.5 px-4 hidden sm:flex"
          >
            Resume
          </a>
          <button
            className="lg:hidden p-2 rounded-lg glass"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-t border-white/5"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollTo(item.href)}
                  className="text-left px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
                >
                  {item.label}
                </button>
              ))}
              <div className="border-t border-white/5 mt-2 pt-2 flex flex-col gap-1">
                <button
                  onClick={() => { onTerminalOpen(); setMobileOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-violet-400"
                >
                  <Terminal size={14} /> Terminal
                </button>
                <button
                  onClick={() => { onPaletteOpen?.(); setMobileOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-blue-400"
                >
                  <Command size={14} /> Command Palette
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
