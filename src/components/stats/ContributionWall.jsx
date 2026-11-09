import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { ExternalLink, GitBranch, Star, GitFork, Clock, GitCommitHorizontal, Loader2 } from "lucide-react";
import { PORTFOLIO_CONFIG } from "../../data/config";
import { useGitHub } from "../../hooks/useGitHub";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Fetch real GitHub contribution data via CORS-friendly public API
async function fetchContributions(username) {
  // jogruber's GitHub contributions API - returns real GitHub contribution counts
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
    { headers: { Accept: "application/json" } }
  );
  if (!res.ok) throw new Error("Contributions API failed");
  const json = await res.json();
  // json.contributions is an array of { date, count } objects for the last year
  return json.contributions || [];
}

function ContribCell({ count, date }) {
  const intensity =
    count === 0
      ? "bg-white/5 border-white/5"
      : count <= 2
      ? "bg-violet-900/70 border-violet-700/40"
      : count <= 5
      ? "bg-violet-700/80 border-violet-600/50"
      : count <= 9
      ? "bg-violet-500/90 border-violet-400/60"
      : "bg-violet-400 border-violet-300/70";

  return (
    <div
      className={`w-3 h-3 rounded-sm border ${intensity} transition-all duration-150 hover:scale-150 hover:z-10 relative cursor-pointer group`}
      title={`${date}: ${count} contribution${count !== 1 ? "s" : ""}`}
    >
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-20 bg-gray-900 border border-white/10 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap shadow-xl pointer-events-none">
        <span className="font-semibold">{count}</span> contributions on {date}
      </div>
    </div>
  );
}

// Build grid: 52 weeks × 7 days from flat [{date,count}] array
function buildGrid(contributions) {
  if (!contributions || contributions.length === 0) return null;

  // Sort by date
  const sorted = [...contributions].sort((a, b) => a.date.localeCompare(b.date));

  // Group into weeks of 7 days (Sun–Sat)
  const weeks = [];
  let week = [];
  sorted.forEach((day, i) => {
    week.push(day);
    if (week.length === 7 || i === sorted.length - 1) {
      weeks.push(week);
      week = [];
    }
  });
  return weeks;
}

// Build month label positions
function buildMonthLabels(weeks) {
  if (!weeks) return [];
  const labels = [];
  let lastMonth = null;
  weeks.forEach((week, wi) => {
    const d = new Date(week[0].date);
    const month = d.getMonth();
    if (month !== lastMonth) {
      labels.push({ col: wi, label: MONTHS[month] });
      lastMonth = month;
    }
  });
  return labels;
}

export default function ContributionWall() {
  const { ref, visible } = useScrollAnimation();
  const { data: ghData, loading: ghLoading } = useGitHub(PORTFOLIO_CONFIG.github);
  const cfg = PORTFOLIO_CONFIG;

  const [contributions, setContributions] = useState(null);
  const [contribLoading, setContribLoading] = useState(true);
  const [contribError, setContribError] = useState(false);
  const [totalContribs, setTotalContribs] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setContribLoading(true);
      setContribError(false);
      try {
        const data = await fetchContributions(cfg.github);
        if (cancelled) return;
        setContributions(data);
        setTotalContribs(data.reduce((a, d) => a + d.count, 0));
      } catch (e) {
        if (!cancelled) setContribError(true);
      } finally {
        if (!cancelled) setContribLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [cfg.github]);

  const grid = buildGrid(contributions);
  const monthLabels = buildMonthLabels(grid);

  return (
    <section id="contributions" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
              <span className="text-violet-400 text-sm font-mono font-medium">activity</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="section-title text-white">
                  GitHub <span className="gradient-text">Contribution Wall</span>
                </h2>
                <p className="section-subtitle mt-1">
                  Real contribution activity for{" "}
                  <a
                    href={cfg.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-violet-400 hover:text-violet-300 transition-colors font-medium"
                  >
                    @{cfg.github}
                  </a>
                </p>
              </div>
              <a
                href={cfg.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary flex items-center gap-2 self-start sm:self-center text-sm"
              >
                <ExternalLink size={14} /> View on GitHub ↗
              </a>
            </div>
          </div>

          {/* Heatmap card */}
          <div className="bento-card overflow-hidden">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <GitCommitHorizontal size={14} className="text-violet-400" />
                {contribLoading ? (
                  <span className="text-sm text-gray-500 flex items-center gap-2">
                    <Loader2 size={12} className="animate-spin" /> Loading contributions…
                  </span>
                ) : contribError ? (
                  <span className="text-sm text-amber-400">
                    ⚠️ Could not load live data —{" "}
                    <a href={cfg.githubUrl} target="_blank" rel="noreferrer" className="underline">
                      view on GitHub
                    </a>
                  </span>
                ) : (
                  <span className="text-sm text-gray-400">
                    <span className="font-semibold text-white">{totalContribs.toLocaleString()}</span>{" "}
                    contributions in the last year
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <span>Less</span>
                {[
                  "bg-white/5",
                  "bg-violet-900/70",
                  "bg-violet-700/80",
                  "bg-violet-500/90",
                  "bg-violet-400",
                ].map((c, i) => (
                  <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
                ))}
                <span>More</span>
              </div>
            </div>

            {/* Grid */}
            {contribLoading ? (
              <div className="h-36 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 size={24} className="animate-spin text-violet-400" />
                  <span className="text-xs text-gray-600">Fetching real contribution data…</span>
                </div>
              </div>
            ) : contribError || !grid ? (
              <div className="h-36 flex items-center justify-center flex-col gap-3">
                <span className="text-gray-500 text-sm">Unable to load contribution graph</span>
                <a
                  href={`https://github.com/${cfg.github}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary text-xs py-1.5 px-4"
                >
                  View on GitHub ↗
                </a>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div style={{ minWidth: "660px" }}>
                  {/* Month labels */}
                  <div className="flex mb-1 ml-8 gap-[2px]">
                    {grid.map((_, wi) => {
                      const ml = monthLabels.find((m) => m.col === wi);
                      return (
                        <div key={wi} className="w-3 flex-shrink-0 text-gray-600" style={{ fontSize: "9px" }}>
                          {ml ? ml.label : ""}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-[3px]">
                    {/* Day labels */}
                    <div className="flex flex-col gap-[3px] mr-1">
                      {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
                        <div
                          key={i}
                          className="h-3 text-gray-700 flex items-center"
                          style={{ fontSize: "8px", width: "28px" }}
                        >
                          {d}
                        </div>
                      ))}
                    </div>

                    {/* Contribution cells */}
                    {grid.map((week, wi) => (
                      <div key={wi} className="flex flex-col gap-[3px]">
                        {week.map((day, di) => (
                          <ContribCell key={di} count={day.count} date={day.date} />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Real Repos from GitHub API */}
          {ghData?.repos && ghData.repos.length > 0 && (
            <>
              <h3 className="text-sm font-mono text-gray-500 mt-8 mb-4">Recent Repositories</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ghData.repos.slice(0, 6).map((repo) => (
                  <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="bento-card flex flex-col gap-2 no-underline hover:border-violet-500/30 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <GitBranch size={14} className="text-violet-400 flex-shrink-0" />
                      <span className="font-semibold text-white text-sm truncate hover:text-violet-400 transition-colors">
                        {repo.name}
                      </span>
                    </div>
                    {repo.description && (
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{repo.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-gray-600 mt-auto pt-2 border-t border-white/5">
                      {repo.language && (
                        <span className="text-violet-400 font-medium">{repo.language}</span>
                      )}
                      <span className="flex items-center gap-1"><Star size={10} /> {repo.stargazers_count}</span>
                      <span className="flex items-center gap-1"><GitFork size={10} /> {repo.forks_count}</span>
                      <span className="flex items-center gap-1 ml-auto">
                        <Clock size={10} />{" "}
                        {new Date(repo.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}

          {ghLoading && (
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bento-card animate-pulse h-24" />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
