import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const GITHUB_USERNAME = 'OxDurgeshxO';
const README_PATH = path.join(ROOT_DIR, 'README.md');
const PROJECTS_PATH = path.join(ROOT_DIR, 'data', 'projects.json');

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
    const link = `[**${p.name}**](https://github.com/${p.repo})`;
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
