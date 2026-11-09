import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { GitBranch, Mail, Download, ChevronDown, Zap } from "lucide-react";
import { PORTFOLIO_CONFIG } from "../../data/config";

const techIcons = ["⚛️", "🐍", "☕", "🤖", "🧠", "📊", "🔷", "🌱"];

function TypingText({ texts }) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const timer = useRef();

  useEffect(() => {
    const full = texts[idx];
    if (!deleting) {
      if (displayed.length < full.length) {
        timer.current = setTimeout(() => setDisplayed(full.slice(0, displayed.length + 1)), 60);
      } else {
        timer.current = setTimeout(() => setDeleting(true), 2000);
      }
    } else {
      if (displayed.length > 0) {
        timer.current = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
      } else {
        setDeleting(false);
        setIdx((i) => (i + 1) % texts.length);
      }
    }
    return () => clearTimeout(timer.current);
  }, [displayed, deleting, idx, texts]);

  return (
    <span className="gradient-text font-mono">
      {displayed}
      <span className="terminal-cursor" />
    </span>
  );
}

function FloatingIcon({ icon, style }) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
      transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, ease: "easeInOut" }}
      className="absolute text-2xl select-none pointer-events-none opacity-60"
      style={style}
    >
      {icon}
    </motion.div>
  );
}

export default function HeroSection() {
  const cfg = PORTFOLIO_CONFIG;

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 grid-bg opacity-40" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1.5s" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-2 lg:order-1"
          >
            {/* Availability badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-emerald-500/25 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400 font-medium">{cfg.availabilityText}</span>
            </motion.div>

            {/* Name */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-4 leading-none">
              {cfg.name.split(" ").map((w, i) => (
                <span key={i} className={i === 0 ? "text-white block" : "gradient-text block"}>
                  {w}
                </span>
              ))}
            </h1>

            {/* Typing title */}
            <div className="text-xl sm:text-2xl font-semibold mb-6 min-h-[2em]">
              <TypingText texts={cfg.heroTitles} />
            </div>

            {/* Intro */}
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
              {cfg.heroIntro}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-primary flex items-center gap-2"
              >
                <Zap size={16} /> Explore Projects
              </button>
              <a href={cfg.resumeUrl} download className="btn-secondary flex items-center gap-2">
                <Download size={16} /> Download Resume
              </a>
              <a
                href={cfg.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary flex items-center gap-2"
              >
                <GitBranch size={16} /> GitHub
              </a>
              <button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-secondary flex items-center gap-2"
              >
                <Mail size={16} /> Contact
              </button>
            </div>

            {/* Quick stats */}
            <div className="flex gap-8 text-center">
              {[
                { value: "4+", label: "Projects" },
                { value: "7+", label: "Technologies" },
                { value: "1", label: "Internship" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-black gradient-text">{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Photo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative">
              {/* Floating tech icons */}
              {techIcons.map((icon, i) => (
                <FloatingIcon
                  key={i}
                  icon={icon}
                  style={{
                    top: `${10 + ((i * 40) % 80)}%`,
                    left: i % 2 === 0 ? `-${20 + (i * 5) % 30}px` : "auto",
                    right: i % 2 !== 0 ? `-${20 + (i * 5) % 30}px` : "auto",
                    animationDelay: `${i * 0.5}s`,
                  }}
                />
              ))}

              {/* Photo container */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96"
              >
                {/* Animated gradient border */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-500 animate-pulse-slow" />
                <div className="absolute inset-1 rounded-3xl bg-[#050508]" />

                {/* Photo or placeholder */}
                <div className="absolute inset-2 rounded-2xl overflow-hidden bg-gradient-to-br from-violet-900/50 to-blue-900/50">
                  <img
                    src="/photo.jpg"
                    alt="Abhinav Royce"
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      e.target.style.display = "none";
                      if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = "flex";
                    }}
                  />
                  {/* Fallback avatar */}
                  <div
                    className="w-full h-full hidden items-center justify-center"
                    style={{ display: "none" }}
                  >
                    <div className="text-center">
                      <div className="text-8xl mb-4">👨‍💻</div>
                      <p className="text-gray-400 text-sm">Place photo.jpg in /public/</p>
                    </div>
                  </div>

                  {/* Soft overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>

                {/* Glow */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 blur-xl -z-10 scale-110" />
              </motion.div>

              {/* Floating info cards */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-4 -left-8 glass rounded-xl p-3 border border-white/10 shadow-xl"
              >
                <div className="text-xs text-gray-400 mb-0.5">Current Focus</div>
                <div className="text-sm font-semibold text-violet-400">ML Trading Platform</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute -top-4 -right-8 glass rounded-xl p-3 border border-white/10 shadow-xl"
              >
                <div className="text-xs text-gray-400 mb-0.5">Primary Stack</div>
                <div className="text-sm font-semibold text-blue-400">Java · Python · React</div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-600 cursor-pointer"
          onClick={() => document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" })}
        >
          <span className="text-xs font-mono">scroll down</span>
          <ChevronDown size={20} />
        </motion.div>
      </div>
    </section>
  );
}
