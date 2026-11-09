import { useState } from "react";
import { motion } from "framer-motion";
import { PORTFOLIO_CONFIG } from "../../data/config";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

function TimelineNode({ item, index }) {
  const { ref, visible } = useScrollAnimation(0.2);
  const [expanded, setExpanded] = useState(false);
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
      animate={visible ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`flex items-start gap-4 ${isLeft ? "flex-row" : "flex-row-reverse"} md:flex-row`}
    >
      {/* Card */}
      <div
        className={`flex-1 bento-card cursor-pointer ${isLeft ? "md:text-right md:items-end" : ""}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-xs font-mono text-violet-400 px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/20">
            {item.year}
          </span>
        </div>
        <h3 className="font-bold text-white text-base mb-2">{item.title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>

        <motion.div
          initial={false}
          animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
          style={{ overflow: "hidden" }}
        >
          <div className="mt-3 flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
            {item.tech.map((t) => (
              <span key={t} className="tech-badge">{t}</span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Center node */}
      <div className="flex-shrink-0 flex flex-col items-center">
        <div className="w-10 h-10 rounded-full glass border-2 border-violet-500/50 flex items-center justify-center text-xl shadow-lg shadow-violet-500/20">
          {item.icon}
        </div>
      </div>

      {/* Spacer for alternating layout on desktop */}
      <div className="flex-1 hidden md:block" />
    </motion.div>
  );
}

export default function TimelineSection() {
  const { ref, visible } = useScrollAnimation();

  return (
    <section id="timeline" className="py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
        >
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-8 h-[2px] bg-violet-500" />
              <span className="text-violet-400 text-sm font-mono font-medium">journey</span>
              <div className="w-8 h-[2px] bg-violet-500" />
            </div>
            <h2 className="section-title text-white">
              Developer <span className="gradient-text">Timeline</span>
            </h2>
            <p className="section-subtitle mt-2">My software development journey — click milestones for details</p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 md:left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-violet-500/50 via-blue-500/30 to-transparent" />

            <div className="space-y-8">
              {PORTFOLIO_CONFIG.timeline.map((item, i) => (
                <TimelineNode key={item.id} item={item} index={i} />
              ))}
            </div>

            {/* End marker */}
            <div className="flex justify-center mt-8">
              <div className="w-4 h-4 rounded-full bg-violet-500 shadow-lg shadow-violet-500/50 animate-pulse-slow" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
