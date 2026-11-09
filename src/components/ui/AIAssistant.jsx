import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles } from "lucide-react";
import { PORTFOLIO_CONFIG } from "../../data/config";

const SUGGESTED = [
  "What backend technologies does Abhinav know?",
  "Tell me about his DRDO internship.",
  "Show me his ML projects.",
  "What is his experience with Spring Boot?",
  "What's his GitHub username?",
];

function portfolioSearch(query, cfg) {
  const q = query.toLowerCase();

  if (q.includes("backend") || q.includes("spring") || q.includes("java")) {
    const be = cfg.skills.backend.map((s) => s.name).join(", ");
    return `Abhinav's backend stack includes: **${be}**. At DRDO, he built a User Management System using Java, Spring Boot, and Spring Security with MySQL — handling authentication, authorization, and REST APIs.`;
  }
  if (q.includes("drdo") || q.includes("intern")) {
    const exp = cfg.experience[0];
    return `Abhinav completed a **${exp.type}** at **${exp.fullName} (${exp.company})** in **${exp.duration}**. He ${exp.summary} Technologies: ${exp.technologies.join(", ")}.`;
  }
  if (q.includes("ml") || q.includes("machine learning") || q.includes("trading") || q.includes("ai")) {
    const mlProjects = cfg.projects.filter(p => p.category.includes("AI/ML"));
    return `Abhinav's AI/ML projects include:\n${mlProjects.map(p => `• **${p.title}** — ${p.shortDesc}`).join("\n")}\n\nHis ML stack: ${cfg.skills.ml.map((s) => s.name).join(", ")}.`;
  }
  if (q.includes("project") || q.includes("built")) {
    return cfg.projects.map(p => `• **${p.title}** [${p.status}] — ${p.shortDesc}`).join("\n");
  }
  if (q.includes("skill") || q.includes("tech") || q.includes("know") || q.includes("languages")) {
    return `Abhinav's technology stack:\n• **Languages**: ${cfg.skills.languages.map((s) => s.name).join(", ")}\n• **Frontend**: ${cfg.skills.frontend.map((s) => s.name).join(", ")}\n• **Backend**: ${cfg.skills.backend.map((s) => s.name).join(", ")}\n• **ML/AI**: ${cfg.skills.ml.map((s) => s.name).join(", ")}`;
  }
  if (q.includes("github")) {
    return `Abhinav's GitHub profile: **${cfg.githubUrl}** — Username: **${cfg.github}**`;
  }
  if (q.includes("leetcode")) {
    return `Abhinav's LeetCode profile: **${cfg.leetcodeUrl}** — Username: **${cfg.leetcodeUsername}**`;
  }
  if (q.includes("contact") || q.includes("email") || q.includes("reach")) {
    return `You can reach Abhinav at **${cfg.email}**\n• LinkedIn: ${cfg.linkedinUrl}\n• GitHub: ${cfg.githubUrl}\n• LeetCode: ${cfg.leetcodeUrl}`;
  }
  if (q.includes("educat") || q.includes("college") || q.includes("university") || q.includes("degree")) {
    const edu = cfg.education;
    return `Abhinav is pursuing **${edu.degree}** at **${edu.institution}** (${edu.duration}), located in ${edu.location}.`;
  }
  if (q.includes("resume") || q.includes("cv")) {
    return `You can download Abhinav's resume from the Resume section, or directly at **/resume.pdf**. The interactive resume section shows his full profile.`;
  }
  if (q.includes("certif")) {
    return `Abhinav has ${cfg.certificates.length} certificate(s) in the Certificate Vault. Scroll to the Certificates section to explore them with 3D flip cards.`;
  }
  if (q.includes("hello") || q.includes("hi") || q.includes("hey")) {
    return `Hello! I'm the **Ask Abhinav AI** assistant. I can answer questions about Abhinav's skills, projects, experience, and more. What would you like to know?`;
  }
  return `I found relevant information about Abhinav's portfolio. He's a **${cfg.tagline}** currently **${cfg.availabilityText.toLowerCase()}**.\n\nTry asking about: skills, projects, DRDO internship, ML projects, GitHub, education, or contact details.`;
}

export default function AIAssistant({ isOpen, onClose }) {
  const cfg = PORTFOLIO_CONFIG;
  const [messages, setMessages] = useState([
    { role: "assistant", content: `Hi! I'm the **Ask Abhinav AI** — a portfolio search assistant.\n\nI can answer questions about Abhinav's **skills, projects, experience, and certifications** using real portfolio data.\n\n_Note: I'm a portfolio search tool, not a generative AI._` },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text) => {
    const q = text || input;
    if (!q.trim()) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: q }]);
    setTyping(true);
    // Simulate a brief delay
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
    const answer = portfolioSearch(q, cfg);
    setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    setTyping(false);
  };

  const renderContent = (text) => {
    return text.split("\n").map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} className={i > 0 ? "mt-1" : ""}>
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j} className="text-white font-semibold">{part}</strong> : part
          )}
        </p>
      );
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-24 right-6 z-50 w-[92vw] max-w-sm shadow-2xl"
        >
          <div className="glass rounded-2xl border border-white/12 overflow-hidden flex flex-col" style={{ height: "480px" }}>
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8 bg-gradient-to-r from-violet-900/40 to-blue-900/40">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                <Sparkles size={14} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Ask Abhinav AI</div>
                <div className="text-xs text-violet-400">Portfolio Search Assistant</div>
              </div>
              <button onClick={onClose} className="ml-auto text-gray-500 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-violet-500/30 text-gray-200 border border-violet-500/20"
                        : "bg-white/5 text-gray-300 border border-white/8"
                    }`}
                  >
                    {renderContent(msg.content)}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/8 rounded-xl px-3 py-2">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          className="w-1.5 h-1.5 rounded-full bg-violet-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggested */}
            {messages.length <= 1 && (
              <div className="px-3 pb-2">
                <div className="text-xs text-gray-600 mb-1.5">Suggested questions</div>
                <div className="flex flex-col gap-1">
                  {SUGGESTED.slice(0, 3).map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-left text-xs text-violet-400 hover:text-violet-300 px-2 py-1 rounded-lg hover:bg-violet-500/10 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="flex items-center gap-2 px-3 py-2.5 border-t border-white/8">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about Abhinav's skills, projects..."
                className="flex-1 bg-transparent outline-none text-xs text-white placeholder-gray-700"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || typing}
                className="w-7 h-7 rounded-lg bg-violet-500/80 hover:bg-violet-500 flex items-center justify-center transition-all disabled:opacity-30"
              >
                <Send size={12} className="text-white" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
