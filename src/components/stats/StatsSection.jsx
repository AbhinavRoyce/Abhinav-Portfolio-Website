import { motion } from "framer-motion";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
} from "recharts";
import { GitBranch, Star, GitFork, Code2, Trophy, Target, Zap, Loader2, ExternalLink } from "lucide-react";
import { useGitHub } from "../../hooks/useGitHub";
import { useLeetCode } from "../../hooks/useLeetCode";
import { PORTFOLIO_CONFIG } from "../../data/config";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

// ─── Shared ───────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bento-card h-full animate-pulse space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/5" />
        <div className="space-y-2 flex-1">
          <div className="h-3 bg-white/5 rounded w-2/3" />
          <div className="h-2 bg-white/5 rounded w-1/3" />
        </div>
      </div>
      <div className="h-28 bg-white/5 rounded-xl" />
      <div className="space-y-2">
        <div className="h-2 bg-white/5 rounded" />
        <div className="h-2 bg-white/5 rounded w-4/5" />
        <div className="h-2 bg-white/5 rounded w-3/5" />
      </div>
    </div>
  );
}

function StatItem({ value, label, icon: Icon, color }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
        <Icon size={16} style={{ color }} />
      </div>
      <div>
        <div className="font-bold text-white text-lg leading-none">{value}</div>
        <div className="text-gray-500 text-xs mt-0.5">{label}</div>
      </div>
    </div>
  );
}

// ─── GitHub Card ──────────────────────────────────────────────────────────────

function GitHubCard() {
  const { data, loading, error } = useGitHub(PORTFOLIO_CONFIG.github);
  const cfg = PORTFOLIO_CONFIG;

  if (loading) return <SkeletonCard />;

  const langColors = {
    Java: "#b07219", Python: "#3572A5", JavaScript: "#f1e05a",
    TypeScript: "#2b7489", HTML: "#e34c26", CSS: "#563d7c",
    "C++": "#f34b7d", Go: "#00ADD8", Rust: "#dea584", Other: "#8b5cf6",
  };

  const langData = data
    ? Object.entries(data.languages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([name, count]) => ({ name, count, color: langColors[name] || "#6b7280" }))
    : [];

  const total = langData.reduce((a, b) => a + b.count, 0);

  return (
    <div className="bento-card h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-violet-500/30 flex-shrink-0">
            {data?.avatar_url
              ? <img src={data.avatar_url} alt="GitHub avatar" className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-gray-700 flex items-center justify-center text-white font-bold">A</div>
            }
          </div>
          <div>
            <div className="font-bold text-white leading-tight">{data?.name || cfg.name}</div>
            <div className="text-gray-500 text-xs">@{cfg.github}</div>
          </div>
        </div>
        <a href={cfg.githubUrl} target="_blank" rel="noreferrer"
          className="btn-secondary flex items-center gap-1.5 text-xs py-1.5 px-3 flex-shrink-0">
          <ExternalLink size={11} /> GitHub ↗
        </a>
      </div>

      {error && (
        <div className="text-xs text-amber-400 mb-4 px-3 py-2 rounded-lg bg-amber-400/8 border border-amber-400/20">
          ⚠️ Rate limited — showing cached data.{" "}
          <a href={cfg.githubUrl} target="_blank" rel="noreferrer" className="underline">View live ↗</a>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <StatItem value={data?.public_repos ?? "—"} label="Repositories" icon={Code2} color="#8b5cf6" />
        <StatItem value={data?.followers ?? "—"} label="Followers" icon={Star} color="#f59e0b" />
      </div>

      {/* Bio */}
      {data?.bio && (
        <p className="text-xs text-gray-500 mb-4 leading-relaxed italic">"{data.bio}"</p>
      )}

      {/* Language distribution */}
      {langData.length > 0 && (
        <div className="mb-5 flex-1">
          <div className="text-xs text-gray-500 mb-3 font-mono font-medium">Language Distribution</div>
          <div className="space-y-2">
            {langData.map(({ name, count, color }) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div key={name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                  <div className="text-xs text-gray-400 w-20 truncate">{name}</div>
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                      style={{ background: color }}
                    />
                  </div>
                  <div className="text-xs text-gray-600 w-8 text-right">{pct}%</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pinned repos */}
      {data?.repos && data.repos.length > 0 && (
        <div>
          <div className="text-xs text-gray-500 mb-2 font-mono font-medium">Recent Repositories</div>
          <div className="space-y-1.5">
            {data.repos.slice(0, 3).map((repo) => (
              <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer"
                className="flex items-center justify-between p-2 rounded-lg bg-white/3 hover:bg-white/6 border border-white/5 hover:border-violet-500/20 transition-all group">
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-white font-medium truncate group-hover:text-violet-400 transition-colors">
                    {repo.name}
                  </div>
                  {repo.language && <div className="text-xs text-gray-600 mt-0.5">{repo.language}</div>}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 ml-2 flex-shrink-0">
                  <span className="flex items-center gap-0.5"><Star size={9} />{repo.stargazers_count}</span>
                  <span className="flex items-center gap-0.5"><GitFork size={9} />{repo.forks_count}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {!data && !error && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600 text-sm text-center">
            Add <code className="text-violet-400">VITE_GITHUB_TOKEN</code> in <code className="text-violet-400">.env</code> for authenticated access
          </p>
        </div>
      )}
    </div>
  );
}

// ─── LeetCode Card ────────────────────────────────────────────────────────────

function AnimatedNumber({ value }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {value}
    </motion.span>
  );
}

function LeetCodeCard() {
  const { data, loading, error } = useLeetCode(PORTFOLIO_CONFIG.leetcodeUsername);
  const cfg = PORTFOLIO_CONFIG;

  if (loading) return <SkeletonCard />;

  const difficulties = data
    ? [
        { name: "Easy", value: data.easySolved, total: Math.round(data.totalQuestions * 0.32), color: "#10b981" },
        { name: "Medium", value: data.mediumSolved, total: Math.round(data.totalQuestions * 0.44), color: "#f59e0b" },
        { name: "Hard", value: data.hardSolved, total: Math.round(data.totalQuestions * 0.24), color: "#ef4444" },
      ]
    : [];

  const pieData = difficulties.length > 0
    ? difficulties
    : [
        { name: "Easy", value: 1, color: "#10b981" },
        { name: "Medium", value: 1, color: "#f59e0b" },
        { name: "Hard", value: 1, color: "#ef4444" },
      ];

  return (
    <div className="bento-card h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xl shadow-lg shadow-amber-500/20">
            🏆
          </div>
          <div>
            <div className="font-bold text-white leading-tight">{cfg.leetcodeUsername}</div>
            <div className="text-gray-500 text-xs">LeetCode Profile</div>
          </div>
        </div>
        <a href={cfg.leetcodeUrl} target="_blank" rel="noreferrer"
          className="btn-secondary flex items-center gap-1.5 text-xs py-1.5 px-3 flex-shrink-0">
          <Trophy size={11} /> LeetCode ↗
        </a>
      </div>

      {error && (
        <div className="text-xs text-amber-400 mb-4 px-3 py-2 rounded-lg bg-amber-400/8 border border-amber-400/20">
          ⚠️ Could not load live stats.{" "}
          <a href={cfg.leetcodeUrl} target="_blank" rel="noreferrer" className="underline">View profile ↗</a>
        </div>
      )}

      {data ? (
        <>
          {/* Donut + breakdown */}
          <div className="flex items-center gap-4 mb-5">
            <div className="relative w-28 h-28 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%" cy="50%"
                    innerRadius={30} outerRadius={50}
                    paddingAngle={3}
                    dataKey="value"
                    startAngle={90} endAngle={-270}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "#0a0a12", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }}
                    itemStyle={{ color: "#9ca3af" }}
                    formatter={(v, n) => [`${v} solved`, n]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="font-black text-2xl text-white leading-none">
                  <AnimatedNumber value={data.totalSolved} />
                </div>
                <div className="text-xs text-gray-500 mt-0.5">Solved</div>
              </div>
            </div>

            {/* Difficulty progress */}
            <div className="flex-1 space-y-2.5">
              {difficulties.map(({ name, value, total, color }) => {
                const pct = total > 0 ? Math.min(Math.round((value / total) * 100), 100) : 0;
                return (
                  <div key={name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium" style={{ color }}>{name}</span>
                      <span className="text-white font-semibold">{value}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                        style={{ background: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3 mt-auto">
            <div className="p-3 rounded-xl bg-white/3 border border-white/5 text-center">
              <div className="font-black text-lg text-amber-400 leading-tight">
                {data.ranking > 0 ? `#${data.ranking.toLocaleString()}` : "—"}
              </div>
              <div className="text-xs text-gray-500 mt-0.5 flex items-center justify-center gap-1">
                <Target size={10} /> Global Rank
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/3 border border-white/5 text-center">
              <div className="font-black text-lg text-emerald-400 leading-tight">
                {data.acceptanceRate > 0 ? `${Number(data.acceptanceRate).toFixed(1)}%` : "—"}
              </div>
              <div className="text-xs text-gray-500 mt-0.5 flex items-center justify-center gap-1">
                <Zap size={10} /> Acceptance
              </div>
            </div>
          </div>

          {/* Total questions context */}
          <div className="mt-3 text-center text-xs text-gray-600">
            {data.totalSolved} / {data.totalQuestions > 0 ? data.totalQuestions.toLocaleString() : "~3500"} total problems
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-6">
          <div className="text-5xl">🏆</div>
          <p className="text-gray-500 text-sm text-center">Visit profile for live stats</p>
          <a href={cfg.leetcodeUrl} target="_blank" rel="noreferrer" className="btn-primary text-sm py-2 px-4">
            View LeetCode Profile ↗
          </a>
        </div>
      )}
    </div>
  );
}

// ─── Developer Radar ──────────────────────────────────────────────────────────

function ScorecardRadar() {
  const radarData = [
    { subject: "Problem Solving", A: 80 },
    { subject: "Full-Stack", A: 85 },
    { subject: "Backend", A: 88 },
    { subject: "Machine Learning", A: 78 },
    { subject: "Open Source", A: 72 },
    { subject: "DevOps", A: 65 },
  ];

  return (
    <div className="bento-card h-full flex flex-col">
      <div className="text-xs text-gray-500 mb-1 font-mono font-medium">Developer Radar</div>
      <p className="text-xs text-gray-700 mb-4">Self-assessed skill radar</p>
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="rgba(255,255,255,0.06)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#6b7280", fontSize: 10 }}
          />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Skills"
            dataKey="A"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.25}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Skill breakdown */}
      <div className="mt-4 space-y-1.5">
        {radarData.map(({ subject, A }) => (
          <div key={subject} className="flex items-center gap-2 text-xs">
            <span className="text-gray-500 w-28 truncate">{subject}</span>
            <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${A}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
              />
            </div>
            <span className="text-gray-600 w-8 text-right">{A}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function StatsSection() {
  const { ref, visible } = useScrollAnimation();

  return (
    <section id="stats" className="py-24 relative">
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
              <span className="text-violet-400 text-sm font-mono font-medium">analytics</span>
            </div>
            <h2 className="section-title text-white">
              GitHub & LeetCode <span className="gradient-text">Analytics</span>
            </h2>
            <p className="section-subtitle mt-2">Live coding activity & competitive programming stats</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1"><GitHubCard /></div>
            <div className="lg:col-span-1"><LeetCodeCard /></div>
            <div className="lg:col-span-1"><ScorecardRadar /></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
