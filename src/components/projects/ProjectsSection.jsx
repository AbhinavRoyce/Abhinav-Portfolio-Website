import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitBranch, ExternalLink, Zap } from "lucide-react";
import { PORTFOLIO_CONFIG } from "../../data/config";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const FILTERS = ["All Projects", "Full Stack", "Backend", "AI/ML", "Trading"];

// Shows image if it loads, emoji fallback if it errors
function ProjectImage({ src, alt, emoji, label }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  return (
    <>
      {!errored && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
        />
      )}
      {(!loaded || errored) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          <div className="text-5xl mb-3">{emoji}</div>
          <div className="text-sm text-gray-400">{label}</div>
        </div>
      )}
    </>
  );
}

function StatusBadge({ status }) {
  const colors = {
    "In Development": "text-amber-400 bg-amber-400/10 border-amber-400/20",
    Completed: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    "Open Source": "text-blue-400 bg-blue-400/10 border-blue-400/20",
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${colors[status] || colors.Completed}`}>
      {status}
    </span>
  );
}

function ProjectCard({ project, featured = false }) {
  const [hovered, setHovered] = useState(false);

  if (featured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className="bento-card col-span-full relative overflow-hidden"
        style={{ borderColor: hovered ? `${project.color}40` : undefined }}
      >
        {/* Background glow */}
        <div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none transition-opacity duration-500"
          style={{ background: project.color, opacity: hovered ? 0.2 : 0.08 }}
        />

        <div className="relative grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono text-violet-400 px-2 py-1 rounded bg-violet-500/10 border border-violet-500/20">
                ★ FEATURED PROJECT
              </span>
              <StatusBadge status={project.status} />
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">{project.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">{project.longDesc}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {project.tech.map((t) => (
                <span key={t} className="tech-badge">{t}</span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary flex items-center gap-2 text-sm"
                >
                  <GitBranch size={14} /> View Code
                </a>
              )}
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary flex items-center gap-2 text-sm"
                >
                  <ExternalLink size={14} /> Live Demo
                </a>
              ) : (
                <button
                  disabled
                  className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-white/5 text-gray-500 cursor-not-allowed border border-white/5"
                >
                  <Zap size={14} /> In Development
                </button>
              )}
            </div>
          </div>

          {/* Preview panel */}
          <div className="relative h-48 sm:h-64 rounded-xl overflow-hidden bg-gradient-to-br from-violet-900/30 to-blue-900/30 border border-white/5">
            <ProjectImage src={project.image} alt={project.title} emoji="📈" label="ML Algorithmic Trading Platform" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="bento-card flex flex-col relative overflow-hidden"
      style={{ borderColor: hovered ? `${project.color}40` : undefined }}
    >
      <div
        className="absolute top-0 left-0 w-full h-1 opacity-60"
        style={{ background: `linear-gradient(90deg, ${project.color}, transparent)` }}
      />

      {/* Project image */}
      <div className="h-40 rounded-xl overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 mb-4 relative">
        <ProjectImage
          src={project.image}
          alt={project.title}
          emoji={project.category.includes("AI/ML") ? "🤖" : project.category.includes("Backend") ? "⚙️" : "💻"}
          label={project.title}
        />
        <div className="absolute top-2 right-2">
          <StatusBadge status={project.status} />
        </div>
      </div>

      <h3 className="font-bold text-white text-lg mb-2">{project.title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">{project.shortDesc}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.tech.slice(0, 4).map((t) => (
          <span key={t} className="tech-badge">{t}</span>
        ))}
        {project.tech.length > 4 && (
          <span className="tech-badge">+{project.tech.length - 4}</span>
        )}
      </div>

      <div className="flex gap-2 mt-auto">
        {project.githubUrl ? (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary flex-1 flex items-center justify-center gap-1.5 text-xs py-2"
          >
            <GitBranch size={12} /> Code
          </a>
        ) : (
          <button
            disabled
            className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg bg-white/5 text-gray-600 cursor-not-allowed border border-white/5"
          >
            Private
          </button>
        )}
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-primary flex-1 flex items-center justify-center gap-1.5 text-xs py-2"
          >
            <ExternalLink size={12} /> Demo
          </a>
        ) : (
          <button
            disabled
            className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg bg-white/5 text-gray-500 cursor-not-allowed border border-white/5"
          >
            Dev Mode
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const { ref, visible } = useScrollAnimation();
  const [filter, setFilter] = useState("All Projects");
  const cfg = PORTFOLIO_CONFIG;

  const featured = cfg.projects.find((p) => p.featured);
  const rest = cfg.projects.filter((p) => !p.featured);

  const filtered = filter === "All Projects"
    ? rest
    : rest.filter((p) => p.category.some((c) => filter.includes(c)));

  return (
    <section id="projects" className="py-24 relative">
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
              <span className="text-violet-400 text-sm font-mono font-medium">projects</span>
            </div>
            <h2 className="section-title text-white">
              Project <span className="gradient-text">Dashboard</span>
            </h2>
            <p className="section-subtitle mt-2">Real-world software I've built</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  filter === f
                    ? "bg-violet-500 text-white shadow-lg shadow-violet-500/30"
                    : "glass text-gray-400 hover:text-white border border-white/10"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Featured spans full row */}
            {filter === "All Projects" && featured && (
              <ProjectCard project={featured} featured={true} />
            )}

            <AnimatePresence mode="popLayout">
              {filtered.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
