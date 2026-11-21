import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const PROJECTS_PATH = path.join(ROOT_DIR, 'data', 'projects.json');
const ARTICLES_PATH = path.join(ROOT_DIR, 'data', 'articles.json');
const STATUS_PATH = path.join(ROOT_DIR, 'data', 'status.json');
const STATS_DIR = path.join(ROOT_DIR, 'stats');
const README_PATH = path.join(ROOT_DIR, 'README.md');

let failures = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`  ❌ FAILED: ${message}`);
    failures++;
  } else {
    console.log(`  ✓ PASSED: ${message}`);
  }
}

console.log('Running Profile Quality Gate & Schema Tests...');

// 1. Validate projects.json
try {
  const projects = JSON.parse(fs.readFileSync(PROJECTS_PATH, 'utf8'));
  assert(Array.isArray(projects) && projects.length >= 10, `projects.json contains ${projects.length} entries (min 10)`);
  const required = ['name', 'repo', 'domain', 'stack', 'highlights'];
  for (const p of projects) {
    for (const field of required) {
      assert(!!p[field], `${p.name || 'unnamed'} has field '${field}'`);
    }
  }
} catch (e) {
  assert(false, `projects.json parsing failed: ${e.message}`);
}

// 2. Validate articles.json
try {
  const articles = JSON.parse(fs.readFileSync(ARTICLES_PATH, 'utf8'));
  assert(Array.isArray(articles) && articles.length > 0, `articles.json has ${articles.length} entries`);
  for (const a of articles) {
    assert(!!a.title && !!a.url && !!a.topic, `Article '${a.title}' has title, url, topic`);
  }
} catch (e) {
  assert(false, `articles.json parsing failed: ${e.message}`);
}

// 3. Validate status.json
try {
  const status = JSON.parse(fs.readFileSync(STATUS_PATH, 'utf8'));
  assert(!!status.project && !!status.focus && !!status.url, `status.json has project, focus, url`);
} catch (e) {
  assert(false, `status.json parsing failed: ${e.message}`);
}

// 4. Validate SVG files
const svgs = ['github-stats.svg', 'top-langs.svg', 'streak-stats.svg'];
for (const svg of svgs) {
  const p = path.join(STATS_DIR, svg);
  assert(fs.existsSync(p), `SVG ${svg} exists on disk`);
  if (fs.existsSync(p)) {
    const content = fs.readFileSync(p, 'utf8');
    assert(content.includes('<svg') && content.includes('</svg>'), `SVG ${svg} contains valid <svg> markup`);
    assert(content.length > 300, `SVG ${svg} size (${content.length}b) is non-empty`);
  }
}

// 5. Validate README slot markers
try {
  const readme = fs.readFileSync(README_PATH, 'utf8');
  const requiredSlots = ['FOCUS', 'PROJECTS_TABLE', 'ARTICLES', 'ACTIVITY', 'LAST_UPDATED'];
  for (const slot of requiredSlots) {
    assert(readme.includes(`<!-- ${slot}:START -->`) && readme.includes(`<!-- ${slot}:END -->`), `README.md contains slot '${slot}'`);
  }
} catch (e) {
  assert(false, `README.md reading failed: ${e.message}`);
}

if (failures > 0) {
  console.error(`\n❌ Quality gate failed with ${failures} assertion failure(s).`);
  process.exit(1);
} else {
  console.log('\n✨ All quality gate assertions passed (exit 0).');
}
