import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const GITHUB_USERNAME = 'OxDurgeshxO';
const README_PATH = path.join(ROOT_DIR, 'README.md');
const PROJECTS_PATH = path.join(ROOT_DIR, 'data', 'projects.json');
const ARTICLES_PATH = path.join(ROOT_DIR, 'data', 'articles.json');
const STATUS_PATH = path.join(ROOT_DIR, 'data', 'status.json');
const STATS_DIR = path.join(ROOT_DIR, 'stats');

async function fetchGraphQL(query) {
  const token = process.env.GITHUB_TOKEN;
  const headers = {
    'User-Agent': 'Profile-Sync-Agent',
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers,
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    throw new Error(`GraphQL request failed: HTTP ${res.status}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(`GraphQL Error: ${JSON.stringify(json.errors)}`);
  }
  return json.data;
}

function generateStatsSvg({ totalStars, totalCommits, totalPRs, totalIssues, contributedTo }) {
  return `<svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    :root {
      --bg: #1a1b27;
      --border: #24283b;
      --title: #70a5fd;
      --label: #a9b1d6;
      --stat: #38bdf8;
    }
    @media (prefers-color-scheme: light) {
      :root {
        --bg: #f8fafc;
        --border: #e2e8f0;
        --title: #0284c7;
        --label: #475569;
        --stat: #0f172a;
      }
    }
    .card-bg { fill: var(--bg); stroke: var(--border); }
    .title { font: 700 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Ubuntu, sans-serif; fill: var(--title); }
    .label { font: 400 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Ubuntu, sans-serif; fill: var(--label); }
    .stat { font: 700 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Ubuntu, sans-serif; fill: var(--stat); }
  </style>
  <rect x="0.5" y="0.5" rx="10" height="99%" width="494" class="card-bg" stroke-width="1"/>
  <g transform="translate(25, 35)">
    <text x="0" y="0" class="title">OxDurgeshxO's GitHub Stats</text>
  </g>
  <g transform="translate(25, 70)">
    <!-- Stars -->
    <g transform="translate(0, 0)">
      <circle cx="6" cy="6" r="5" fill="#e0af68"/>
      <text x="25" y="10" class="label">Total Stars Earned:</text>
      <text x="320" y="10" class="stat">${totalStars}</text>
    </g>
    <!-- Commits -->
    <g transform="translate(0, 25)">
      <circle cx="6" cy="6" r="5" fill="#7aa2f7"/>
      <text x="25" y="10" class="label">Total Commits (Active):</text>
      <text x="320" y="10" class="stat">${totalCommits}</text>
    </g>
    <!-- PRs -->
    <g transform="translate(0, 50)">
      <circle cx="6" cy="6" r="5" fill="#bb9af7"/>
      <text x="25" y="10" class="label">Total PRs:</text>
      <text x="320" y="10" class="stat">${totalPRs}</text>
    </g>
    <!-- Issues -->
    <g transform="translate(0, 75)">
      <circle cx="6" cy="6" r="5" fill="#7dcfff"/>
      <text x="25" y="10" class="label">Total Issues:</text>
      <text x="320" y="10" class="stat">${totalIssues}</text>
    </g>
    <!-- Contributed to -->
    <g transform="translate(0, 100)">
      <circle cx="6" cy="6" r="5" fill="#9ece6a"/>
      <text x="25" y="10" class="label">Contributed to (Repos):</text>
      <text x="320" y="10" class="stat">${contributedTo}</text>
    </g>
  </g>
</svg>`;
}

function generateTopLangsSvg(languages) {
  const totalSize = languages.reduce((acc, l) => acc + l.size, 0) || 1;
  const topLangs = languages.slice(0, 5).map(l => ({
    ...l,
    percentage: ((l.size / totalSize) * 100).toFixed(1),
  }));

  let barX = 0;
  const progressBars = topLangs.map(l => {
    const width = ((l.size / totalSize) * 440).toFixed(1);
    const rect = `<rect x="${barX}" y="0" width="${width}" height="10" fill="${l.color || '#858585'}" rx="2"/>`;
    barX += parseFloat(width);
    return rect;
  }).join('');

  const langListLeft = topLangs.slice(0, 3).map((l, i) => `
    <g transform="translate(0, ${i * 24})">
      <circle cx="6" cy="6" r="5" fill="${l.color || '#858585'}"/>
      <text x="22" y="10" class="label">${l.name}</text>
      <text x="160" y="10" class="stat">${l.percentage}%</text>
    </g>
  `).join('');

  const langListRight = topLangs.slice(3, 5).map((l, i) => `
    <g transform="translate(220, ${i * 24})">
      <circle cx="6" cy="6" r="5" fill="${l.color || '#858585'}"/>
      <text x="22" y="10" class="label">${l.name}</text>
      <text x="160" y="10" class="stat">${l.percentage}%</text>
    </g>
  `).join('');

  return `<svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    :root {
      --bg: #1a1b27;
      --border: #24283b;
      --track: #24283b;
      --title: #70a5fd;
      --label: #a9b1d6;
      --stat: #38bdf8;
    }
    @media (prefers-color-scheme: light) {
      :root {
        --bg: #f8fafc;
        --border: #e2e8f0;
        --track: #e2e8f0;
        --title: #0284c7;
        --label: #475569;
        --stat: #0f172a;
      }
    }
    .card-bg { fill: var(--bg); stroke: var(--border); }
    .bar-track { fill: var(--track); }
    .title { font: 700 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Ubuntu, sans-serif; fill: var(--title); }
    .label { font: 400 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Ubuntu, sans-serif; fill: var(--label); }
    .stat { font: 700 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Ubuntu, sans-serif; fill: var(--stat); }
  </style>
  <rect x="0.5" y="0.5" rx="10" height="99%" width="494" class="card-bg" stroke-width="1"/>
  <g transform="translate(25, 35)">
    <text x="0" y="0" class="title">Most Used Languages</text>
  </g>
  <g transform="translate(25, 55)">
    <rect x="0" y="0" width="440" height="10" rx="5" class="bar-track"/>
    <g>${progressBars}</g>
  </g>
  <g transform="translate(25, 85)">
    ${langListLeft}
    ${langListRight}
  </g>
</svg>`;
}

function calculateStreaks(days) {
  let total = 0;
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let currentStreakStart = null;
  let currentStreakEnd = null;

  const today = new Date().toISOString().split('T')[0];
  const sortedDays = [...days].sort((a, b) => a.date.localeCompare(b.date));

  for (const day of sortedDays) {
    total += day.contributionCount;
    if (day.contributionCount > 0) {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }

  let idx = sortedDays.length - 1;
  if (idx >= 0 && sortedDays[idx].contributionCount === 0 && sortedDays[idx].date === today) {
    idx--;
  }

  const streakDays = [];
  while (idx >= 0 && sortedDays[idx].contributionCount > 0) {
    streakDays.unshift(sortedDays[idx]);
    idx--;
  }

  currentStreak = streakDays.length;
  if (currentStreak > 0) {
    currentStreakStart = streakDays[0].date;
    currentStreakEnd = streakDays[streakDays.length - 1].date;
  }

  return { total, currentStreak, longestStreak, currentStreakStart, currentStreakEnd };
}

function generateNativeStreakSvg({ total, currentStreak, longestStreak, currentStreakStart, currentStreakEnd }) {
  const formatDate = d => {
    if (!d) return 'Present';
    const parts = d.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[parseInt(parts[1], 10) - 1]} ${parseInt(parts[2], 10)}`;
  };

  const streakRange = currentStreak > 0 ? `${formatDate(currentStreakStart)} - ${formatDate(currentStreakEnd)}` : 'Inactive';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 495 195" width="495px" height="195px">
  <style>
    :root {
      --bg: #1a1b27;
      --border: #24283b;
      --line: #24283b;
      --title: #70A5FD;
      --label: #38BDAE;
      --num: #70A5FD;
      --curr: #BF91F3;
      --ring: #70A5FD;
    }
    @media (prefers-color-scheme: light) {
      :root {
        --bg: #f8fafc;
        --border: #e2e8f0;
        --line: #e2e8f0;
        --title: #0369a1;
        --label: #0d9488;
        --num: #0284c7;
        --curr: #7c3aed;
        --ring: #0284c7;
      }
    }
    .card-bg { fill: var(--bg); stroke: var(--border); }
    .div-line { stroke: var(--line); }
    .ring-line { stroke: var(--ring); }
    .title { font: 700 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Ubuntu, sans-serif; fill: var(--title); }
    .label { font: 400 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Ubuntu, sans-serif; fill: var(--label); }
    .num { font: 700 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', Ubuntu, sans-serif; fill: var(--num); }
    .curr { font: 700 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', Ubuntu, sans-serif; fill: var(--curr); }
    .curr-label { font: 700 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Ubuntu, sans-serif; fill: var(--curr); }
  </style>
  <rect x="0.5" y="0.5" rx="8" height="194" width="494" class="card-bg" stroke-width="1"/>
  <line x1="165" y1="28" x2="165" y2="170" class="div-line" stroke-width="1"/>
  <line x1="330" y1="28" x2="330" y2="170" class="div-line" stroke-width="1"/>

  <!-- Total Contributions -->
  <g transform="translate(82.5, 48)">
    <text x="0" y="32" text-anchor="middle" class="num">${total}</text>
    <text x="0" y="65" text-anchor="middle" class="title">Total Contributions</text>
    <text x="0" y="90" text-anchor="middle" class="label">Past Year</text>
  </g>

  <!-- Current Streak -->
  <g transform="translate(247.5, 48)">
    <circle cx="0" cy="22" r="38" fill="none" class="ring-line" stroke-width="4"/>
    <text x="0" y="32" text-anchor="middle" class="curr">${currentStreak}</text>
    <text x="0" y="80" text-anchor="middle" class="curr-label">Current Streak</text>
    <text x="0" y="102" text-anchor="middle" class="label">${streakRange}</text>
  </g>

  <!-- Longest Streak -->
  <g transform="translate(412.5, 48)">
    <text x="0" y="32" text-anchor="middle" class="num">${longestStreak}</text>
    <text x="0" y="65" text-anchor="middle" class="title">Longest Streak</text>
    <text x="0" y="90" text-anchor="middle" class="label">${longestStreak} Days Max</text>
  </g>
</svg>`;
}

async function updateGeneratedStats() {
  if (!fs.existsSync(STATS_DIR)) {
    fs.mkdirSync(STATS_DIR, { recursive: true });
  }

  const ghStatsPath = path.join(STATS_DIR, 'github-stats.svg');
  const topLangsPath = path.join(STATS_DIR, 'top-langs.svg');
  const streakPath = path.join(STATS_DIR, 'streak-stats.svg');

  if (!process.env.GITHUB_TOKEN) {
    console.warn('Notice: GITHUB_TOKEN not provided in environment. Skipping GraphQL SVG generation; existing SVGs preserved.');
  } else {
    try {
      const query = `
        query {
          user(login: "${GITHUB_USERNAME}") {
            contributionsCollection {
              totalCommitContributions
              restrictedContributionsCount
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    contributionCount
                    date
                  }
                }
              }
            }
            repositoriesContributedTo(first: 1) {
              totalCount
            }
            pullRequests {
              totalCount
            }
            issues {
              totalCount
            }
            repositories(first: 100, ownerAffiliations: OWNER) {
              nodes {
                stargazerCount
                languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
                  edges {
                    size
                    node {
                      name
                      color
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const data = await fetchGraphQL(query);
      const user = data.user;

      let totalStars = 0;
      const langMap = new Map();

      for (const repo of user.repositories.nodes) {
        totalStars += repo.stargazerCount || 0;
        if (repo.languages?.edges) {
          for (const edge of repo.languages.edges) {
            const name = edge.node.name;
            const color = edge.node.color;
            const size = edge.size;
            if (langMap.has(name)) {
              langMap.get(name).size += size;
            } else {
              langMap.set(name, { name, color, size });
            }
          }
        }
      }

      const sortedLanguages = Array.from(langMap.values()).sort((a, b) => b.size - a.size);

      const statsData = {
        totalStars,
        totalCommits: user.contributionsCollection.totalCommitContributions,
        totalPRs: user.pullRequests.totalCount,
        totalIssues: user.issues.totalCount,
        contributedTo: user.repositoriesContributedTo.totalCount,
      };

      const statsSvg = generateStatsSvg(statsData);
      const langsSvg = generateTopLangsSvg(sortedLanguages);

      fs.writeFileSync(ghStatsPath, statsSvg, 'utf8');
      fs.writeFileSync(topLangsPath, langsSvg, 'utf8');
      console.log('Native SVG stats cards generated successfully in stats/');

      const calendar = user.contributionsCollection?.contributionCalendar;
      if (calendar?.weeks) {
        const days = [];
        for (const week of calendar.weeks) {
          if (week.contributionDays) {
            days.push(...week.contributionDays);
          }
        }
        const streakMetrics = calculateStreaks(days);
        const streakSvg = generateNativeStreakSvg(streakMetrics);
        fs.writeFileSync(streakPath, streakSvg, 'utf8');
        console.log('Native streak stats SVG generated successfully in stats/');
      }
    } catch (err) {
      console.warn('Could not generate native SVGs via GraphQL:', err.message);
    }
  }

  if (!fs.existsSync(streakPath)) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const streakRes = await fetch(`https://streak-stats.demolab.com/?user=${GITHUB_USERNAME}&theme=tokyonight&hide_border=true`, {
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (streakRes.ok) {
        const streakSvg = await streakRes.text();
        fs.writeFileSync(streakPath, streakSvg, 'utf8');
        console.log('Streak stats SVG mirrored successfully from backup.');
      }
    } catch (err) {
      console.warn('Could not mirror streak stats fallback:', err.message);
    }
  }
}

async function pingLiveDemos(projects) {
  console.log('Checking live demos to prevent free cloud sleep...');
  for (const p of projects) {
    if (!p.demo) continue;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(p.demo, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) DemoKeepalive/1.0' },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      console.log(`  ✓ [HTTP ${res.status}] ${p.name}`);
    } catch (err) {
      console.warn(`  ⚠ [PING WARN] ${p.name}: ${err.message}`);
    }
  }
}

function renderFocusStatus() {
  // Support GitHub Actions 1-Click Dispatch inputs
  if (process.env.INPUT_FOCUS_PROJECT) {
    try {
      const updated = {
        project: process.env.INPUT_FOCUS_PROJECT,
        focus: process.env.INPUT_FOCUS_TEXT || 'Active engineering milestone',
        url: process.env.INPUT_FOCUS_URL || `https://github.com/${GITHUB_USERNAME}/${process.env.INPUT_FOCUS_PROJECT}`,
      };
      fs.writeFileSync(STATUS_PATH, JSON.stringify(updated, null, 2) + '\n');
      console.log(`Updated status.json from dispatch inputs: ${updated.project}`);
    } catch (e) {
      console.warn('Failed to update status.json from dispatch inputs:', e.message);
    }
  }

  if (!fs.existsSync(STATUS_PATH)) {
    return '> 🔭 **Currently Building:** [**durgesh-flagship-portfolio**](https://github.com/OxDurgeshxO/durgesh-flagship-portfolio) &mdash; *Architecting Next.js 3D WebGPU particle physics compute engine*';
  }

  try {
    const raw = fs.readFileSync(STATUS_PATH, 'utf8');
    const status = JSON.parse(raw);
    return `> 🔭 **Currently Building:** [**${status.project}**](${status.url}) &mdash; *${status.focus}*`;
  } catch (err) {
    console.warn('Could not parse status.json:', err.message);
    return '> 🔭 **Currently Building:** [**durgesh-flagship-portfolio**](https://github.com/OxDurgeshxO/durgesh-flagship-portfolio) &mdash; *Architecting Next.js 3D WebGPU particle physics compute engine*';
  }
}

async function getRecentActivity() {
  try {
    const headers = {
      'User-Agent': 'Profile-Sync-Agent',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=30`, {
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`GitHub events API responded with HTTP ${res.status}`);
      return '_Live activity stream updating via cron._';
    }

    const events = await res.json();
    const seen = new Set();
    const formatted = [];

    for (const e of events) {
      if (formatted.length >= 5) break;

      const repoName = e.repo.name;
      const date = new Date(e.created_at).toISOString().split('T')[0];
      const key = `${e.type}:${repoName}`;

      // Skip profile README self-commits to highlight substantive project work
      if (e.type === 'PushEvent' && repoName.toLowerCase() === `${GITHUB_USERNAME}/${GITHUB_USERNAME}`.toLowerCase()) {
        continue;
      }

      if (e.type === 'PushEvent') {
        const msg = e.payload?.commits?.[0]?.message?.split('\n')[0] || 'Code improvements';
        const commitKey = `${key}:${msg}`;
        if (seen.has(commitKey)) continue;
        seen.add(commitKey);
        formatted.push(`- 🚀 **${date}** &mdash; Pushed to [\`${repoName}\`](https://github.com/${repoName}): *${msg}*`);
      } else if (e.type === 'PullRequestEvent') {
        const action = e.payload?.action || 'interacted with';
        const prNumber = e.payload?.pull_request?.number ? `#${e.payload.pull_request.number}` : 'PR';
        const prTitle = e.payload?.pull_request?.title || '';
        const prKey = `${key}:${prNumber}:${action}`;
        if (seen.has(prKey)) continue;
        seen.add(prKey);
        formatted.push(`- 🔀 **${date}** &mdash; ${action.charAt(0).toUpperCase() + action.slice(1)} PR [\`${prNumber} ${prTitle}\`](https://github.com/${repoName}/pulls) on [\`${repoName}\`](https://github.com/${repoName})`);
      } else if (e.type === 'ReleaseEvent') {
        const tag = e.payload?.release?.tag_name || 'new release';
        if (seen.has(key)) continue;
        seen.add(key);
        formatted.push(`- 📦 **${date}** &mdash; Released [\`${tag}\`](https://github.com/${repoName}/releases) on [\`${repoName}\`](https://github.com/${repoName})`);
      } else if (e.type === 'CreateEvent' && e.payload?.ref_type === 'repository') {
        if (seen.has(key)) continue;
        seen.add(key);
        formatted.push(`- ✨ **${date}** &mdash; Created repository [\`${repoName}\`](https://github.com/${repoName})`);
      } else if (e.type === 'ForkEvent') {
        const forkee = e.payload?.forkee?.full_name || repoName;
        if (seen.has(key)) continue;
        seen.add(key);
        formatted.push(`- 🍴 **${date}** &mdash; Forked [\`${repoName}\`](https://github.com/${repoName}) to [\`${forkee}\`](https://github.com/${forkee})`);
      } else if (e.type === 'WatchEvent' && e.payload?.action === 'started') {
        if (seen.has(key)) continue;
        seen.add(key);
        formatted.push(`- ⭐ **${date}** &mdash; Starred [\`${repoName}\`](https://github.com/${repoName})`);
      }
    }

    return formatted.length > 0 ? formatted.join('\n') : '_No recent activity found._';
  } catch (err) {
    console.error('Error fetching activity:', err.message);
    return '_Activity stream temporarily unavailable._';
  }
}

async function renderProjectsTable(projects) {
  const formatRow = p => {
    let link = `[**${p.name}**](https://github.com/${p.repo})`;
    if (p.demo) {
      link += `<br/>[🔗 *Live Demo*](${p.demo})`;
    } else if (p.package) {
      link += `<br/>[📦 *${p.package}*](https://github.com/${p.repo})`;
    }

    const badge = p.ciWorkflow
      ? `[![CI](https://github.com/${p.repo}/actions/workflows/${p.ciWorkflow}/badge.svg)](https://github.com/${p.repo}/actions)`
      : `[![Repo](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square)](https://github.com/${p.repo})`;

    return `| ${link} | ${p.domain} | ${p.stack} | ${p.highlights} | ${badge} |`;
  };

  const header = '| Project | Domain | Stack | Highlights & Architecture | CI Status | \n| :--- | :--- | :--- | :--- | :--- |';

  const featured = projects.filter(p => p.featured);
  const others = projects.filter(p => !p.featured);

  let output = `${header}\n${featured.map(formatRow).join('\n')}\n\n`;

  if (others.length > 0) {
    output += `<details>\n<summary><b>📂 View ${others.length} More Engineering Projects (Compilers, ML & 3D Tools)</b></summary>\n<br/>\n\n`;
    output += `${header}\n${others.map(formatRow).join('\n')}\n\n`;
    output += `</details>`;
  }

  return output.trim();
}

function renderArticles() {
  if (!fs.existsSync(ARTICLES_PATH)) {
    return '_Technical deep-dives updating soon._';
  }

  try {
    const raw = fs.readFileSync(ARTICLES_PATH, 'utf8');
    const articles = JSON.parse(raw);

    if (!Array.isArray(articles) || articles.length === 0) {
      return '_Technical deep-dives updating soon._';
    }

    return articles.map(a => `- 📝 **[${a.title}](${a.url})** &mdash; \`${a.topic}\``).join('\n');
  } catch (err) {
    console.warn('Could not parse articles.json:', err.message);
    return '_Technical deep-dives updating soon._';
  }
}

function renderLastUpdated() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  const timestamp = `${year}-${month}-${day} ${hours}:${minutes} UTC`;
  return `<p align="center">\n  <sub>⚡ Last synchronized: <b>${timestamp}</b></sub>\n</p>`;
}

function replaceSlot(content, slotName, newContent) {
  const regex = new RegExp(`<!-- ${slotName}:START -->[\\s\\S]*?<!-- ${slotName}:END -->`);
  if (!regex.test(content)) {
    console.warn(`Slot marker <!-- ${slotName}:START --> not found in README.md`);
    return content;
  }
  return content.replace(
    regex,
    `<!-- ${slotName}:START -->\n${newContent}\n<!-- ${slotName}:END -->`
  );
}

async function main() {
  if (!fs.existsSync(README_PATH)) {
    throw new Error(`README file not found at ${README_PATH}`);
  }
  if (!fs.existsSync(PROJECTS_PATH)) {
    throw new Error(`Projects file not found at ${PROJECTS_PATH}`);
  }

  const raw = fs.readFileSync(PROJECTS_PATH, 'utf8');
  const projects = JSON.parse(raw);

  if (!Array.isArray(projects)) {
    throw new Error('data/projects.json must contain a JSON array of projects.');
  }

  const requiredFields = ['name', 'repo', 'domain', 'stack', 'highlights'];
  for (const [index, p] of projects.entries()) {
    for (const field of requiredFields) {
      if (!p[field]) {
        throw new Error(`Project at index ${index} (${p.name || 'unnamed'}) is missing required field: '${field}'`);
      }
    }
  }

  let content = fs.readFileSync(README_PATH, 'utf8');

  console.log('Generating Native SVG Stats Cards...');
  await updateGeneratedStats();

  console.log('Pinging live demos to keep free instances awake...');
  await pingLiveDemos(projects);

  console.log('Rendering Active Engineering Focus...');
  const focusContent = renderFocusStatus();
  content = replaceSlot(content, 'FOCUS', focusContent);

  console.log('Rendering Crown Jewel Projects Table from data/projects.json...');
  const tableContent = await renderProjectsTable(projects);
  content = replaceSlot(content, 'PROJECTS_TABLE', tableContent);

  console.log('Rendering Technical Architecture & Deep-Dives...');
  const articlesContent = renderArticles();
  content = replaceSlot(content, 'ARTICLES', articlesContent);

  console.log('Fetching live public activity for', GITHUB_USERNAME);
  const activityContent = await getRecentActivity();
  content = replaceSlot(content, 'ACTIVITY', activityContent);

  console.log('Rendering last synchronized timestamp...');
  const lastUpdatedContent = renderLastUpdated();
  content = replaceSlot(content, 'LAST_UPDATED', lastUpdatedContent);

  fs.writeFileSync(README_PATH, content, 'utf8');
  console.log('Successfully synchronized README.md.');
}

main().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
