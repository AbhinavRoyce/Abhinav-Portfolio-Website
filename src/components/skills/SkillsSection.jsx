import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Grid, Network } from "lucide-react";
import { PORTFOLIO_CONFIG } from "../../data/config";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const CATEGORIES = [
  { key: "languages", label: "Languages", color: "#8b5cf6" },
  { key: "frontend", label: "Frontend", color: "#06b6d4" },
  { key: "backend", label: "Backend", color: "#10b981" },
  { key: "databases", label: "Databases", color: "#f59e0b" },
  { key: "ml", label: "ML & AI", color: "#ef4444" },
  { key: "devops", label: "DevOps", color: "#6366f1" },
  { key: "visualization", label: "Visualization", color: "#ec4899" },
];

function SkillBar({ skill, color }) {
  const { ref, visible } = useScrollAnimation(0.1);
  return (
    <div ref={ref} className="p-3 rounded-xl bg-white/3 border border-white/6 hover:border-white/10 transition-all hover:bg-white/5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{skill.icon}</span>
          <span className="text-sm font-medium text-gray-200">{skill.name}</span>
        </div>
        <span className="text-xs text-gray-600 font-mono">{skill.level}%</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: visible ? `${skill.level}%` : 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}99, ${color})` }}
        />
      </div>
    </div>
  );
}

export default function SkillsSection() {
  const { ref, visible } = useScrollAnimation();
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");
  const cfg = PORTFOLIO_CONFIG;

  const allSkills = CATEGORIES.flatMap(({ key, color }) =>
    (cfg.skills[key] || []).map((s) => ({ ...s, category: key, color }))
  );

  const filtered = search
    ? allSkills.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    : null;

  return (
    <section id="skills" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-[2px] bg-violet-500" />
              <span className="text-violet-400 text-sm font-mono font-medium">skills</span>
            </div>
            <h2 className="section-title text-white">
              My Technology <span className="gradient-text">Universe</span>
            </h2>
            <p className="section-subtitle mt-2">The tools and technologies I work with</p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
              <input
                type="text"
                placeholder="Search technologies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full glass border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-violet-500/40 transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setView("grid")}
                className={`px-3 py-2 rounded-xl border transition-all ${view === "grid" ? "bg-violet-500/20 border-violet-500/40 text-violet-400" : "glass border-white/10 text-gray-400"}`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setView("list")}
                className={`px-3 py-2 rounded-xl border transition-all ${view === "list" ? "bg-violet-500/20 border-violet-500/40 text-violet-400" : "glass border-white/10 text-gray-400"}`}
              >
                <Network size={16} />
              </button>
            </div>
          </div>

          {/* Search results */}
          {filtered ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
              {filtered.map((skill) => (
                <div
                  key={`${skill.category}-${skill.name}`}
                  className="p-3 rounded-xl glass border border-white/8 flex flex-col items-center gap-2 hover:border-violet-500/30 transition-all"
                >
                  <span className="text-2xl">{skill.icon}</span>
                  <span className="text-xs text-gray-300 text-center">{skill.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {CATEGORIES.map(({ key, label, color }) => {
                const skills = cfg.skills[key] || [];
                return (
                  <div key={key}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-3 h-3 rounded-full" style={{ background: color }} />
                      <h3 className="font-semibold text-gray-300 text-sm">{label}</h3>
                      <div className="flex-1 h-[1px] bg-white/5" />
                      <span className="text-xs text-gray-600">{skills.length} tools</span>
                    </div>
                    {view === "grid" ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {skills.map((skill) => (
                          <div
                            key={skill.name}
                            className="p-3 rounded-xl glass border border-white/8 flex flex-col items-center gap-2 hover:scale-105 transition-all hover:border-white/15 cursor-default"
                          >
                            <span className="text-2xl">{skill.icon}</span>
                            <span className="text-xs text-gray-300 text-center font-medium">{skill.name}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {skills.map((skill) => (
                          <SkillBar key={skill.name} skill={skill} color={color} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
