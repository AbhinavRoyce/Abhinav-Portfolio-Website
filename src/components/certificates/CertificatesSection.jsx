import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Award, X, Clock, CheckCircle2, BadgeCheck } from "lucide-react";
import { PORTFOLIO_CONFIG } from "../../data/config";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const CATEGORY_COLORS = {
  "AI/ML": "from-violet-600 to-purple-600",
  "Education": "from-red-600 to-orange-500",
  "Programming": "from-blue-600 to-cyan-500",
  "Data Science": "from-emerald-600 to-teal-500",
};

const ISSUER_ICONS = {
  "Udemy": "🎓",
  "NPTEL — IIT Kharagpur": "🏛️",
  "Coursera": "📚",
  "Google": "🔵",
};

function CertificateCard({ cert, onClick }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const gradient = CATEGORY_COLORS[cert.category] || "from-violet-600 to-blue-600";
  const icon = ISSUER_ICONS[cert.issuer] || "📜";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      onClick={() => onClick(cert)}
      className="bento-card cursor-pointer group flex flex-col overflow-hidden hover:border-white/20 transition-all duration-300"
      style={{ borderColor: `${cert.color}20` }}
    >
      {/* Color top stripe */}
      <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r ${gradient} opacity-80`} />

      {/* Certificate preview image */}
      <div
        className="w-full h-44 rounded-xl overflow-hidden mb-4 relative flex-shrink-0"
        style={{ background: `linear-gradient(135deg, ${cert.color}15, ${cert.color}05)` }}
      >
        {!imgError && cert.image && (
          <img
            src={cert.image}
            alt={cert.title}
            className={`w-full h-full object-cover object-top transition-all duration-500 group-hover:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        )}
        {(!imgLoaded || imgError) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <span className="text-4xl">{icon}</span>
            <span className="text-xs text-gray-500 font-mono">{cert.issuer}</span>
          </div>
        )}
        {/* Overlay with "click to view" */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all duration-300">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-1.5">
            <Award size={12} /> View Certificate
          </span>
        </div>
        {/* Category badge */}
        <div className={`absolute top-2 left-2 text-xs font-medium px-2 py-0.5 rounded-full bg-gradient-to-r ${gradient} text-white shadow-lg`}>
          {cert.category}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1">
        <div className="flex items-start gap-2 mb-2">
          <span className="text-xl flex-shrink-0">{icon}</span>
          <h3 className="font-bold text-white text-sm leading-snug group-hover:text-violet-300 transition-colors line-clamp-2">
            {cert.title}
          </h3>
        </div>

        <div className="text-xs text-gray-500 mb-1 font-medium">{cert.issuer}</div>
        <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
          <span className="flex items-center gap-1"><Clock size={10} /> {cert.date}</span>
          {cert.hours && <span>{cert.hours}</span>}
          {cert.score && (
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <CheckCircle2 size={10} /> {cert.score}
            </span>
          )}
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1 mt-auto mb-3">
          {cert.skills.slice(0, 3).map((s) => (
            <span key={s} className="tech-badge text-xs">{s}</span>
          ))}
          {cert.skills.length > 3 && (
            <span className="tech-badge text-xs">+{cert.skills.length - 3}</span>
          )}
        </div>

        {/* Verify link */}
        {cert.verifyUrl && (
          <a
            href={cert.verifyUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors mt-auto"
          >
            <BadgeCheck size={12} /> Verify Credential ↗
          </a>
        )}
      </div>
    </motion.div>
  );
}

// ── Full-screen modal viewer ────────────────────────────────────────────────

function CertModal({ cert, onClose }) {
  if (!cert) return null;
  const icon = ISSUER_ICONS[cert.issuer] || "📜";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

        <motion.div
          className="relative z-10 w-full max-w-3xl bg-gray-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Certificate image */}
          <div className="w-full aspect-[16/9] bg-gray-900 relative overflow-hidden">
            {cert.image ? (
              <img
                src={cert.image}
                alt={cert.title}
                className="w-full h-full object-contain bg-white"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-8xl">{icon}</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-1 font-mono">{cert.issuer}</div>
                <h2 className="text-xl font-bold text-white mb-2 leading-tight">{cert.title}</h2>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Clock size={13} /> {cert.date}</span>
                  {cert.hours && <span>· {cert.hours}</span>}
                  {cert.score && (
                    <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <CheckCircle2 size={13} /> Score: {cert.score}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X size={16} className="text-gray-400" />
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs text-gray-600 mb-2 font-mono">Skills Covered</div>
                <div className="flex flex-wrap gap-1.5">
                  {cert.skills.map((s) => (
                    <span key={s} className="tech-badge">{s}</span>
                  ))}
                </div>
              </div>
              {cert.verifyUrl && (
                <a
                  href={cert.verifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary flex items-center gap-2 text-sm flex-shrink-0"
                >
                  <ExternalLink size={14} /> Verify on {cert.issuer.split(" ")[0]} ↗
                </a>
              )}
            </div>

            {cert.credentialId && (
              <div className="mt-3 text-xs text-gray-700 font-mono">
                Credential ID: {cert.credentialId}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Main Section ────────────────────────────────────────────────────────────

export default function CertificatesSection() {
  const { ref, visible } = useScrollAnimation();
  const [selected, setSelected] = useState(null);
  const certs = PORTFOLIO_CONFIG.certificates;

  return (
    <section id="certificates" className="py-24 relative">
      <CertModal cert={selected} onClose={() => setSelected(null)} />

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
              <span className="text-violet-400 text-sm font-mono font-medium">credentials</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="section-title text-white">
                  Certificates &amp; <span className="gradient-text">Credentials</span>
                </h2>
                <p className="section-subtitle mt-2">
                  {certs.length} verified credentials — click any to view &amp; verify
                </p>
              </div>
            </div>
          </div>

          {/* Grid */}
          <motion.div
            layout
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {certs.map((cert) => (
              <CertificateCard key={cert.id} cert={cert} onClick={setSelected} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
