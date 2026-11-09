import { useState, useEffect } from "react";

const CACHE_KEY = "github_stats_cache";
const CACHE_TTL = 1000 * 60 * 30; // 30 min

export function useGitHub(username) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;

    // Check cache first
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { ts, value } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL) {
          setData(value);
          setLoading(false);
          return;
        }
      }
    } catch {}

    async function fetchGitHub() {
      try {
        setLoading(true);
        const headers = { "Accept": "application/vnd.github.v3+json" };
        const token = import.meta.env.VITE_GITHUB_TOKEN;
        if (token) headers["Authorization"] = `token ${token}`;

        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`, { headers }),
          fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers }),
        ]);

        if (!userRes.ok) throw new Error(`GitHub API: ${userRes.status}`);

        const user = await userRes.json();
        const repos = reposRes.ok ? await reposRes.json() : [];

        // Count languages across repos
        const langMap = {};
        repos.forEach((r) => {
          if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1;
        });

        const stats = {
          ...user,
          repos: repos.slice(0, 6),
          languages: langMap,
        };

        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), value: stats }));
        } catch {}

        setData(stats);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch GitHub data");
      } finally {
        setLoading(false);
      }
    }

    fetchGitHub();
  }, [username]);

  return { data, loading, error };
}
