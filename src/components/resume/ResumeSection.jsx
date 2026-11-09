import { useState } from "react";
import { motion } from "framer-motion";
import {
  Download, Mail, Eye, ChevronRight, Code2, Briefcase,
  Award, GraduationCap, User, ExternalLink, FileText
} from "lucide-react";
import { PORTFOLIO_CONFIG } from "../../data/config";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const SECTIONS = [
  { id: "summary",        label: "Summary",        icon: User          },
  { id: "education",      label: "Education",       icon: GraduationCap },
  { id: "experience",     label: "Experience",      icon: Briefcase     },
  { id: "skills",         label: "Skills",          icon: Code2         },
  { id: "projects",       label: "Projects",        icon: Eye           },
  { id: "certifications", label: "Certifications",  icon: Award         },
];

export default function ResumeSection() {
  const { ref, visible } = useScrollAnimation();
  const [activeSection, setActiveSection] = useState("summary");
  const [tab, setTab] = useState("interactive"); // "interactive" | "preview"
  const cfg = PORTFOLIO_CONFIG;

  // Check if resume PDF exists by trying to fetch HEAD
  const resumeUrl = cfg.resumeUrl || "/resume.pdf";

  const content = {
    summary: (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">{cfg.name}</h3>
        <p className="text-gray-400 leading-relaxed text-sm">
          Computer Science undergraduate with strong problem-solving skills and a solid foundation
          in C++ and Data Structures &amp; Algorithms. Skilled in full-stack development, database
          management, data visualization, and machine learning, with experience in building scalable
          software solutions and algorithmic trading projects. Currently expanding expertise in MLOps
          and actively learning DevOps practices to bridge the gap between development and deployment.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {[
            { label: "Email",    value: cfg.email,       href: `mailto:${cfg.email}` },
            { label: "GitHub",   value: cfg.github,      href: cfg.githubUrl         },
            { label: "LeetCode", value: cfg.leetcodeUsername, href: cfg.leetcodeUrl  },
            { label: "Location", value: cfg.location,   href: null                  },
          ].map(({ label, value, href }) => (
            <div key={label} className="p-3 rounded-xl glass border border-white/8">
              <div className="text-xs text-gray-600 mb-0.5">{label}</div>
              {href
                ? <a href={href} target="_blank" rel="noreferrer" className="text-sm text-violet-400 hover:underline truncate block">{value}</a>
                : <div className="text-sm text-white">{value}</div>
              }
            </div>
          ))}
        </div>
      </div>
    ),
    education: (
      <div className="space-y-3">
        {[
          { degree: cfg.education.degree, school: cfg.education.institution, duration: cfg.education.duration, grade: null },
          { degree: "XII (CBSE)", school: "Araria Public School", duration: "2021", grade: "76%" },
          { degree: "X (CBSE)",  school: "Araria Public School", duration: "2019", grade: "81%" },
        ].map((e, i) => (
          <div key={i} className="bento-card">
            <h3 className="font-bold text-white">{e.degree}</h3>
            <div className="text-violet-400 mt-1 text-sm">{e.school}</div>
            <div className="flex items-center gap-3 text-gray-500 text-xs mt-1">
              <span>{e.duration}</span>
              {e.grade && <span className="text-emerald-400 font-semibold">{e.grade}</span>}
            </div>
          </div>
        ))}
      </div>
    ),
    experience: (
      <div className="space-y-4">
        {cfg.experience.map((exp) => (
          <div key={exp.id} className="bento-card">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-white">{exp.role}</h3>
                <div className="text-violet-400 mt-0.5 text-sm">{exp.fullName}</div>
              </div>
              <span className="text-xs text-gray-500 flex-shrink-0 mt-0.5">{exp.duration}</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">{exp.location} · {exp.type}</div>
            <p className="text-gray-400 text-sm mt-3 leading-relaxed">{exp.summary}</p>
            {exp.responsibilities?.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {exp.responsibilities.map((r, i) => (
                  <li key={i} className="flex gap-2 text-xs text-gray-400">
                    <span className="text-violet-400 mt-0.5 flex-shrink-0">•</span>{r}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {exp.technologies.map((t) => <span key={t} className="tech-badge">{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    ),
    skills: (
      <div className="space-y-5">
        {[
          { label: "Full Stack", skills: [...cfg.skills.frontend.slice(0,3), ...cfg.skills.backend.slice(0,3)] },
          { label: "Programming Languages", skills: cfg.skills.languages },
          { label: "Databases", skills: cfg.skills.databases },
          { label: "ML & AI", skills: cfg.skills.ml },
          { label: "DevOps & Tools", skills: cfg.skills.devops },
        ].map(({ label, skills }) => (
          <div key={label}>
            <div className="text-xs text-violet-400 mb-2 font-mono font-medium">{label}</div>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s.name} className="text-sm px-3 py-1.5 rounded-lg glass border border-white/8 text-gray-300 flex items-center gap-1.5">
                  <span>{s.icon}</span>{s.name}
                </span>
              ))}
            </div>
          </div>
        ))}
        <div>
          <div className="text-xs text-gray-500 mb-2 font-mono">Concepts</div>
          <div className="flex flex-wrap gap-2">
            {["DSA", "Machine Learning", "Full Stack", "MLOps"].map((c) => (
              <span key={c} className="tech-badge">{c}</span>
            ))}
          </div>
        </div>
      </div>
    ),
    projects: (
      <div className="space-y-4">
        {cfg.projects.map((p) => (
          <div key={p.id} className="bento-card">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-white text-sm">{p.title}</h3>
              <span className="tech-badge flex-shrink-0 text-xs">{p.status}</span>
            </div>
            <p className="text-gray-400 text-xs mt-2 leading-relaxed">{p.shortDesc}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {p.tech.map((t) => <span key={t} className="tech-badge">{t}</span>)}
            </div>
            {p.githubUrl && (
              <a href={p.githubUrl} target="_blank" rel="noreferrer"
                className="text-xs text-violet-400 hover:underline mt-2 flex items-center gap-1">
                <ExternalLink size={10} /> View on GitHub
              </a>
            )}
          </div>
        ))}
      </div>
    ),
    certifications: (
      <div className="space-y-3">
        {cfg.certificates.map((c) => (
          <div key={c.id} className="flex items-start gap-3 p-3 rounded-xl glass border border-white/8">
            <Award size={16} className="text-violet-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white leading-snug">{c.title}</div>
              <div className="text-xs text-gray-500 mt-0.5">{c.issuer} · {c.date}</div>
              {c.score && <div className="text-xs text-emerald-400 font-semibold mt-0.5">Score: {c.score}</div>}
            </div>
            {c.verifyUrl && (
              <a href={c.verifyUrl} target="_blank" rel="noreferrer"
                className="text-xs text-violet-400 hover:text-violet-300 flex-shrink-0 flex items-center gap-1">
                <ExternalLink size={10} /> Verify
              </a>
            )}
          </div>
        ))}
      </div>
    ),
  };

  return (
    <section id="resume" className="py-24 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-[2px] bg-violet-500" />
              <span className="text-violet-400 text-sm font-mono font-medium">resume</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="section-title text-white">
                  Interactive <span className="gradient-text">Resume</span>
                </h2>
                <p className="section-subtitle mt-1">Navigate sections or download the full PDF</p>
              </div>
              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={resumeUrl}
                  download="Abhinav_Royce_Resume.pdf"
                  className="btn-primary flex items-center gap-2 text-sm"
                >
                  <Download size={15} /> Download PDF
                </a>
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary flex items-center gap-2 text-sm"
                >
                  <Eye size={15} /> View Resume
                </a>
                <button
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                  className="btn-secondary flex items-center gap-2 text-sm"
                >
                  <Mail size={15} /> Contact Me
                </button>
              </div>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-1 p-1 bg-white/3 rounded-xl border border-white/8 w-fit mb-6">
            {[
              { id: "interactive", label: "Interactive View", icon: FileText },
              { id: "preview",     label: "PDF Preview",      icon: Eye       },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === id
                    ? "bg-violet-500 text-white shadow-lg shadow-violet-500/20"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          {tab === "interactive" ? (
            /* Interactive viewer */
            <div className="grid md:grid-cols-4 gap-6">
              {/* Nav */}
              <div className="md:col-span-1 space-y-1">
                {SECTIONS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveSection(id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeSection === id
                        ? "bg-violet-500/15 text-violet-400 border border-violet-500/25"
                        : "text-gray-500 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon size={14} />
                    {label}
                    {activeSection === id && <ChevronRight size={12} className="ml-auto" />}
                  </button>
                ))}
              </div>

              {/* Content panel */}
              <div className="md:col-span-3">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="glass rounded-2xl p-6 border border-white/8 min-h-64"
                >
                  {content[activeSection]}
                </motion.div>
              </div>
            </div>
          ) : (
            /* PDF Preview */
            <div className="bento-card overflow-hidden p-0">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
                <span className="text-xs text-gray-500 font-mono">Abhinav_Royce_Resume.pdf</span>
                <div className="flex gap-2">
                  <a href={resumeUrl} download="Abhinav_Royce_Resume.pdf"
                    className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5">
                    <Download size={12} /> Download
                  </a>
                  <a href={resumeUrl} target="_blank" rel="noreferrer"
                    className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5">
                    <ExternalLink size={12} /> Open
                  </a>
                </div>
              </div>
              <div className="w-full bg-gray-900" style={{ height: "75vh" }}>
                <object
                  data={resumeUrl}
                  type="application/pdf"
                  className="w-full h-full"
                >
                  {/* Fallback if PDF can't be embedded */}
                  <div className="flex flex-col items-center justify-center h-full gap-6 p-8">
                    <div className="text-6xl">📄</div>
                    <div className="text-center">
                      <p className="text-gray-400 mb-2 font-medium">PDF preview requires a PDF file at <code className="text-violet-400">/public/resume.pdf</code></p>
                      <p className="text-gray-600 text-sm">Place your resume PDF in the <code className="text-violet-400">public/</code> folder and it will display here automatically.</p>
                    </div>
                    <div className="flex gap-3">
                      <a href={resumeUrl} download="Abhinav_Royce_Resume.pdf" className="btn-primary flex items-center gap-2">
                        <Download size={14} /> Download Resume
                      </a>
                      <button
                        onClick={() => setTab("interactive")}
                        className="btn-secondary flex items-center gap-2">
                        <FileText size={14} /> View Interactive Resume
                      </button>
                    </div>
                  </div>
                </object>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
