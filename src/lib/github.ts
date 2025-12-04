/**
 * GitHub API Helper
 * Fetches repository metadata from GitHub API at build time
 */

export interface GitHubRepo {
  name: string;
  owner: string;
  description: string;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
}

/**
 * Fetch repository data from GitHub API
 */
export async function fetchRepoData(owner: string, repo: string): Promise<GitHubRepo | null> {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        // Add GitHub token if available (for higher rate limits)
        ...(process.env.GITHUB_TOKEN && {
          'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
        })
      }
    });

    if (!response.ok) {
      console.warn(`Failed to fetch ${owner}/${repo}: ${response.status}`);
      return null;
    }

    const data = await response.json();

    return {
      name: data.name,
      owner: data.owner.login,
      description: data.description || '',
      url: data.html_url,
      language: data.language,
      stars: data.stargazers_count,
      forks: data.forks_count,
      topics: data.topics || [],
    };
  } catch (error) {
    console.warn(`Error fetching ${owner}/${repo}:`, error);
    return null;
  }
}

/**
 * Load repositories - fetch from GitHub API if only owner/name provided,
 * otherwise use the full data from JSON
 */
export async function loadRepositories(repos: Array<{ owner: string; name: string; [key: string]: any }>): Promise<GitHubRepo[]> {
  const results = await Promise.all(
    repos.map(async (repo) => {
      // If repo has all data already, use it
      if (repo.description && repo.stars !== undefined) {
        return repo as GitHubRepo;
      }

      // Otherwise fetch from GitHub API
      const fetched = await fetchRepoData(repo.owner, repo.name);
      return fetched || {
        name: repo.name,
        owner: repo.owner,
        description: repo.description || '',
        url: `https://github.com/${repo.owner}/${repo.name}`,
        language: null,
        stars: 0,
        forks: 0,
        topics: [],
      };
    })
  );

  // Sort by stars (highest first)
  return results.sort((a, b) => b.stars - a.stars);
}
