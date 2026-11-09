import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, MapPin, Calendar, Briefcase } from "lucide-react";
import { PORTFOLIO_CONFIG } from "../../data/config";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

function ExperienceCard({ exp, index }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
      className="bento-card cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          {/* Logo/icon */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-black text-lg"
            style={{ background: `linear-gradient(135deg, ${exp.color}, ${exp.color}99)` }}
          >
            {exp.company[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-bold text-white text-lg">{exp.role}</h3>
              <span className="tech-badge text-xs">{exp.type}</span>
            </div>
            <div className="text-violet-400 font-semibold mb-2">{exp.fullName}</div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Calendar size={13} />{exp.duration}</span>
              <span className="flex items-center gap-1"><MapPin size={13} />{exp.location}</span>
            </div>
          </div>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={20} className="text-gray-500 flex-shrink-0 mt-1" />
        </motion.div>
      </div>

      {/* Tech stack badges */}
      <div className="flex flex-wrap gap-2 mt-4">
        {exp.technologies.map((t) => (
          <span key={t} className="tech-badge">{t}</span>
        ))}
      </div>

      {/* Summary */}
      <p className="text-gray-400 text-sm mt-3 leading-relaxed">{exp.summary}</p>

      {/* Expanded content */}
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.35 }}
        style={{ overflow: "hidden" }}
      >
        <div className="mt-4 pt-4 border-t border-white/5">
          <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Briefcase size={14} className="text-violet-400" /> Key Responsibilities
          </h4>
          <ul className="space-y-2">
            {exp.responsibilities.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                <span className="text-violet-400 mt-1 flex-shrink-0">▸</span>
                {r}
              </li>
            ))}
          </ul>
          {exp.achievements.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Achievements</h4>
              <ul className="space-y-1">
                {exp.achievements.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="text-emerald-400">✓</span>{a}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ExperienceSection() {
  const { ref, visible } = useScrollAnimation();
  const cfg = PORTFOLIO_CONFIG;

  return (
    <section id="experience" className="py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Section header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-[2px] bg-violet-500" />
              <span className="text-violet-400 text-sm font-mono font-medium">experience</span>
            </div>
            <h2 className="section-title text-white">
              Professional <span className="gradient-text">Experience</span>
            </h2>
            <p className="section-subtitle mt-2">Building real-world software at scale</p>
          </div>

          {/* Experience cards */}
          <div className="space-y-6">
            {cfg.experience.map((exp, i) => (
              <ExperienceCard key={exp.id} exp={exp} index={i} />
            ))}
          </div>

          {/* Education card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="mt-6 bento-card"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl">
                🎓
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">{cfg.education.degree}</h3>
                <div className="text-blue-400 font-semibold">{cfg.education.institution}</div>
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Calendar size={13} />{cfg.education.duration}</span>
                  <span className="flex items-center gap-1"><MapPin size={13} />{cfg.education.location}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
