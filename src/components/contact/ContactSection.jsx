import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, GitBranch, Link, ExternalLink, Send, Copy, Check, Download } from "lucide-react";
import { PORTFOLIO_CONFIG } from "../../data/config";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

export default function ContactSection() {
  const { ref, visible } = useScrollAnimation();
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const cfg = PORTFOLIO_CONFIG;

  const copyEmail = async () => {
    await navigator.clipboard.writeText(cfg.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, integrate with a form backend (Formspree, EmailJS, etc.)
    const mailtoUrl = `mailto:${cfg.email}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
    window.location.href = mailtoUrl;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const socials = [
    { label: "GitHub", icon: GitBranch, url: cfg.githubUrl, color: "#8b5cf6" },
    { label: "LinkedIn", icon: Link, url: cfg.linkedinUrl, color: "#0ea5e9" },
    { label: "LeetCode", icon: ExternalLink, url: cfg.leetcodeUrl, color: "#f59e0b" },
  ];

  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-8 h-[2px] bg-violet-500" />
              <span className="text-violet-400 text-sm font-mono font-medium">contact</span>
              <div className="w-8 h-[2px] bg-violet-500" />
            </div>
            <h2 className="section-title text-white">
              Let's Build Something <span className="gradient-text">Together</span>
            </h2>
            <p className="section-subtitle mt-2">Have a project in mind? Let's talk.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Info panel */}
            <div className="space-y-6">
              {/* Email card */}
              <div className="bento-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                    <Mail size={18} className="text-violet-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Email</div>
                    <div className="text-sm font-medium text-white">{cfg.email}</div>
                  </div>
                  <button
                    onClick={copyEmail}
                    className="ml-auto p-2 rounded-lg glass border border-white/10 hover:border-violet-500/30 transition-all"
                    title="Copy email"
                  >
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-gray-400" />}
                  </button>
                </div>
                <a
                  href={`mailto:${cfg.email}`}
                  className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
                >
                  <Send size={14} /> Send Email
                </a>
              </div>

              {/* Social links */}
              <div className="bento-card">
                <div className="text-sm font-medium text-gray-300 mb-4">Find me online</div>
                <div className="space-y-3">
                  {socials.map(({ label, icon: Icon, url, color }) => (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
                        <Icon size={16} style={{ color }} />
                      </div>
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{label}</span>
                      <ExternalLink size={12} className="ml-auto text-gray-600 group-hover:text-gray-400" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Resume download */}
              <a
                href={cfg.resumeUrl}
                download
                className="bento-card flex items-center gap-3 hover:border-violet-500/30 transition-all cursor-pointer no-underline"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Download size={18} className="text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Download Resume</div>
                  <div className="text-xs text-gray-500">PDF · Updated 2025</div>
                </div>
              </a>
            </div>

            {/* Contact form */}
            <div className="bento-card">
              <h3 className="font-bold text-white mb-6">Send a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Full Name *</label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full glass border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-violet-500/40 transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Email *</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full glass border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-violet-500/40 transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Subject *</label>
                  <input
                    required
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full glass border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-violet-500/40 transition-colors"
                    placeholder="Project collaboration, hiring..."
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Message *</label>
                  <textarea
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    className="w-full glass border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-violet-500/40 transition-colors resize-none"
                    placeholder="Tell me about your project or opportunity..."
                  />
                </div>
                <button
                  type="submit"
                  className={`w-full btn-primary flex items-center justify-center gap-2 ${submitted ? "opacity-70" : ""}`}
                >
                  {submitted ? (
                    <><Check size={16} /> Message Sent!</>
                  ) : (
                    <><Send size={16} /> Send Message</>
                  )}
                </button>
                <p className="text-xs text-gray-600 text-center">
                  This will open your email client. For direct submission, configure a backend in contact settings.
                </p>
              </form>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-white/5 text-center">
            <p className="text-gray-600 text-sm">
              Built with React, JavaScript, Tailwind CSS & Framer Motion by{" "}
              <span className="gradient-text font-semibold">Abhinav Royce</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
