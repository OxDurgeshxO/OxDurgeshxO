import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const GITHUB_USERNAME = 'OxDurgeshxO';
const README_PATH = path.join(ROOT_DIR, 'README.md');
const PROJECTS_PATH = path.join(ROOT_DIR, 'data', 'projects.json');
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
    .title { font: 700 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Ubuntu, sans-serif; fill: #70a5fd; }
    .label { font: 400 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Ubuntu, sans-serif; fill: #a9b1d6; }
    .stat { font: 700 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Ubuntu, sans-serif; fill: #38bdf8; }
    .icon { fill: #bb9af7; }
  </style>
  <rect x="0.5" y="0.5" rx="10" height="99%" width="494" fill="#1a1b27" stroke="#24283b" stroke-width="1"/>
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
    .title { font: 700 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Ubuntu, sans-serif; fill: #70a5fd; }
    .label { font: 400 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Ubuntu, sans-serif; fill: #a9b1d6; }
    .stat { font: 700 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Ubuntu, sans-serif; fill: #38bdf8; }
  </style>
  <rect x="0.5" y="0.5" rx="10" height="99%" width="494" fill="#1a1b27" stroke="#24283b" stroke-width="1"/>
  <g transform="translate(25, 35)">
    <text x="0" y="0" class="title">Most Used Languages</text>
  </g>
  <g transform="translate(25, 55)">
    <rect x="0" y="0" width="440" height="10" rx="5" fill="#24283b"/>
    <g>${progressBars}</g>
  </g>
  <g transform="translate(25, 85)">
    ${langListLeft}
    ${langListRight}
  </g>
</svg>`;
}

async function updateGeneratedStats() {
  if (!fs.existsSync(STATS_DIR)) {
    fs.mkdirSync(STATS_DIR, { recursive: true });
  }

  try {
    const query = `
      query {
        user(login: "${GITHUB_USERNAME}") {
          contributionsCollection {
            totalCommitContributions
            restrictedContributionsCount
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

    fs.writeFileSync(path.join(STATS_DIR, 'github-stats.svg'), statsSvg, 'utf8');
    fs.writeFileSync(path.join(STATS_DIR, 'top-langs.svg'), langsSvg, 'utf8');
    console.log('Native SVG stats cards generated successfully in stats/');
  } catch (err) {
    console.warn('Could not generate native SVGs via GraphQL:', err.message);
  }

  // Also fetch live streak stats backup
  try {
    const streakRes = await fetch(`https://streak-stats.demolab.com/?user=${GITHUB_USERNAME}&theme=tokyonight&hide_border=true`);
    if (streakRes.ok) {
      const streakSvg = await streakRes.text();
      fs.writeFileSync(path.join(STATS_DIR, 'streak-stats.svg'), streakSvg, 'utf8');
      console.log('Streak stats SVG mirrored successfully.');
    }
  } catch (err) {
    console.warn('Could not mirror streak stats:', err.message);
  }
}

async function getRecentActivity() {
  try {
    const headers = { 'User-Agent': 'Profile-Sync-Agent' };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=25`, { headers });
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

      if (e.type === 'PushEvent') {
        const msg = e.payload?.commits?.[0]?.message?.split('\n')[0] || 'Code improvements';
        const commitKey = `${key}:${msg}`;
        if (seen.has(commitKey)) continue;
        seen.add(commitKey);
        formatted.push(`- 🚀 **${date}** &mdash; Pushed to [\`${repoName}\`](https://github.com/${repoName}): *${msg}*`);
      } else if (e.type === 'ReleaseEvent') {
        const tag = e.payload?.release?.tag_name || 'new release';
        if (seen.has(key)) continue;
        seen.add(key);
        formatted.push(`- 📦 **${date}** &mdash; Released [\`${tag}\`](https://github.com/${repoName}/releases) on [\`${repoName}\`](https://github.com/${repoName})`);
      } else if (e.type === 'CreateEvent' && e.payload?.ref_type === 'repository') {
        if (seen.has(key)) continue;
        seen.add(key);
        formatted.push(`- ✨ **${date}** &mdash; Created repository [\`${repoName}\`](https://github.com/${repoName})`);
      } else if (e.type === 'WatchEvent' && e.payload?.action === 'started') {
        if (seen.has(key)) continue;
        seen.add(key);
        formatted.push(`- ⭐ **${date}** &mdash; Starred [\`${repoName}\`](https://github.com/${repoName})`);
      }
    }

    return formatted.length > 0 ? formatted.join('\n') : '_No recent commits found._';
  } catch (err) {
    console.error('Error fetching activity:', err.message);
    return '_Activity stream temporarily unavailable._';
  }
}

async function renderProjectsTable() {
  if (!fs.existsSync(PROJECTS_PATH)) {
    throw new Error(`Projects file not found at ${PROJECTS_PATH}`);
  }

  const projects = JSON.parse(fs.readFileSync(PROJECTS_PATH, 'utf8'));
  let table = '| Project | Domain | Stack | Highlights & Architecture | Version & CI |\n';
  table += '| :--- | :--- | :--- | :--- | :--- |\n';

  for (const p of projects) {
    let link = `[**${p.name}**](https://github.com/${p.repo})`;
    if (p.demo) {
      link += `<br/>[🔗 *Live Demo*](${p.demo})`;
    }
    if (p.npm) {
      link += `<br/>[📦 *npm*](https://www.npmjs.com/package/${p.npm})`;
    }
    const ciBadge = p.ciWorkflow
      ? `[![CI](https://github.com/${p.repo}/actions/workflows/${p.ciWorkflow}/badge.svg)](https://github.com/${p.repo}/actions)`
      : `[![Repo](https://img.shields.io/badge/Status-Active-brightgreen)](https://github.com/${p.repo})`;

    table += `| ${link} | ${p.domain} | ${p.stack} | ${p.highlights} | ${ciBadge} |\n`;
  }

  return table.trim();
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

  let content = fs.readFileSync(README_PATH, 'utf8');

  console.log('Generating Native SVG Stats Cards...');
  await updateGeneratedStats();

  console.log('Rendering Crown Jewel Projects Table from data/projects.json...');
  const tableContent = await renderProjectsTable();
  content = replaceSlot(content, 'PROJECTS_TABLE', tableContent);

  console.log('Fetching live public activity for', GITHUB_USERNAME);
  const activityContent = await getRecentActivity();
  content = replaceSlot(content, 'ACTIVITY', activityContent);

  fs.writeFileSync(README_PATH, content, 'utf8');
  console.log('Successfully synchronized README.md.');
}

main().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
