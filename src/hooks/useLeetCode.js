import { useState, useEffect } from "react";

const CACHE_KEY = "leetcode_stats_cache_v2";
const CACHE_TTL = 1000 * 60 * 60; // 1hr

// Multiple API sources, tried in order
const APIS = [
  // alfa-leetcode-api - most reliable
  async (username) => {
    const res = await fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${username}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`alfa API: ${res.status}`);
    const d = await res.json();
    return {
      username,
      totalSolved: d.totalSolved ?? 0,
      easySolved: d.easySolved ?? 0,
      mediumSolved: d.mediumSolved ?? 0,
      hardSolved: d.hardSolved ?? 0,
      totalQuestions: d.totalQuestions ?? 3500,
      ranking: d.ranking ?? 0,
      acceptanceRate: d.acceptanceRate ?? 0,
      contributionPoints: d.contributionPoints ?? 0,
      reputation: d.reputation ?? 0,
    };
  },
  // leetcode-stats-api (herokuapp)
  async (username) => {
    const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`heroku API: ${res.status}`);
    const d = await res.json();
    if (d.status === "error") throw new Error(d.message || "User not found");
    return {
      username,
      totalSolved: d.totalSolved ?? 0,
      easySolved: d.easySolved ?? 0,
      mediumSolved: d.mediumSolved ?? 0,
      hardSolved: d.hardSolved ?? 0,
      totalQuestions: d.totalQuestions ?? 3500,
      ranking: d.ranking ?? 0,
      acceptanceRate: d.acceptanceRate ?? 0,
      contributionPoints: 0,
      reputation: 0,
    };
  },
  // leetcode.com public GraphQL (may be blocked by CORS but worth trying)
  async (username) => {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `{ matchedUser(username: "${username}") { submitStats { acSubmissionNum { difficulty count } } profile { ranking } } }`,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error("LeetCode GraphQL failed");
    const { data } = await res.json();
    const user = data?.matchedUser;
    if (!user) throw new Error("User not found");
    const counts = user.submitStats?.acSubmissionNum || [];
    const get = (d) => counts.find((c) => c.difficulty === d)?.count ?? 0;
    return {
      username,
      totalSolved: get("All"),
      easySolved: get("Easy"),
      mediumSolved: get("Medium"),
      hardSolved: get("Hard"),
      totalQuestions: 3500,
      ranking: user.profile?.ranking ?? 0,
      acceptanceRate: 0,
      contributionPoints: 0,
      reputation: 0,
    };
  },
];

export function useLeetCode(username) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;

    // Check session cache
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { ts, value } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL && value.username === username) {
          setData(value);
          setLoading(false);
          return;
        }
      }
    } catch {}

    async function load() {
      setLoading(true);
      setError(null);

      for (const apiFn of APIS) {
        try {
          const stats = await apiFn(username);
          try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), value: stats }));
          } catch {}
          setData(stats);
          setLoading(false);
          return; // success — stop trying more APIs
        } catch (e) {
          console.warn(`LeetCode API attempt failed: ${e.message}`);
          // Try next API
        }
      }

      // All APIs failed
      setError("All LeetCode APIs unavailable. Check network or try again later.");
      setLoading(false);
    }

    load();
  }, [username]);

  return { data, loading, error };
}
