import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const SEMVER_REGEX = /^\d+\.\d+\.\d+(?:\-[a-zA-Z0-9\.\-]+)?(?:\+[a-zA-Z0-9\.\-]+)?$/;

const isWin = process.platform === 'win32';

function exists(filePath) {
  // ponytail: fs.accessSync avoids false negatives when files are locked under Windows concurrency
  try {
    fs.accessSync(filePath);
    return true;
  } catch (err) {
    return err.code !== 'ENOENT';
  }
}

function findInPath(cmd) {
  const pathEnv = process.env.PATH || process.env.Path || '';
  const dirs = pathEnv.split(path.delimiter);
  const exts = isWin ? ['.exe', '.cmd', '.bat'] : [''];
  
  for (const dir of dirs) {
    for (const ext of exts) {
      try {
        const fullPath = path.join(dir, cmd + ext);
        if (exists(fullPath)) {
          return fullPath;
        }
      } catch {}
    }
  }
  return cmd;
}

function run(cmd, args) {
  const resolvedCmd = findInPath(cmd);
  if (isWin) {
    if (resolvedCmd.toLowerCase().endsWith('.cmd') || resolvedCmd.toLowerCase().endsWith('.bat')) {
      return spawnSync(resolvedCmd, args, {
        encoding: 'utf8',
        shell: true
      });
    }
  }
  return spawnSync(resolvedCmd, args, { encoding: 'utf8' });
}

// 1. Parse CLI arguments
const isDryRun = process.argv.includes('--dry-run');
for (const arg of process.argv.slice(2)) {
  if (arg !== '--dry-run') {
    console.error(`Error: Unknown CLI argument "${arg}". Only --dry-run is supported.`);
    process.exit(1);
  }
}

// 2. Verify environment
const gitVer = run('git', ['--version']);
if (gitVer.status !== 0) {
  console.error('Git is not installed or returned an error.');
  process.exit(1);
}

const insideWorkTree = run('git', ['rev-parse', '--is-inside-work-tree']);
if (insideWorkTree.status !== 0 || insideWorkTree.stdout.trim() !== 'true') {
  console.error('Not inside a git repository.');
  process.exit(1);
}

let canUseGh = true;
const ghVer = run('gh', ['--version']);
if (ghVer.status !== 0) {
  console.warn('Warning: GitHub CLI (gh) is not installed or returned an error. Draft release step will be skipped.');
  canUseGh = false;
}

if (canUseGh) {
  const ghAuth = run('gh', ['auth', 'status']);
  if (ghAuth.status !== 0) {
    console.warn('Warning: GitHub CLI is not authenticated. Draft release step will be skipped.');
    canUseGh = false;
  }
}

// 3. Extract version from package.json
const pkgPath = path.resolve('package.json');
if (!fs.existsSync(pkgPath)) {
  console.error('package.json not found.');
  process.exit(1);
}

let pkg;
try {
  pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
} catch (err) {
  console.error('package.json contains invalid JSON syntax.');
  process.exit(1);
}

if (!pkg || typeof pkg !== 'object') {
  console.error('package.json is invalid.');
  process.exit(1);
}

if (!('version' in pkg)) {
  console.error('package.json is missing the version field.');
  process.exit(1);
}

const version = pkg.version;
if (typeof version !== 'string') {
  console.error('package.json version field must be a string.');
  process.exit(1);
}

if (!SEMVER_REGEX.test(version)) {
  console.error(`package.json version "${version}" is not a valid Semantic Version.`);
  process.exit(1);
}

// 4. Git Tag Check
const tagName = `v${version}`;
const tagCheck = run('git', ['tag', '-l', tagName]);
if (tagCheck.status !== 0) {
  console.error('Error checking if git tag exists.');
  if (tagCheck.stderr) console.error(tagCheck.stderr);
  process.exit(1);
}

const tagExists = tagCheck.stdout.trim() === tagName;
if (tagExists) {
  console.error(`Tag ${tagName} already exists.`);
  process.exit(1);
}

// 5. Commits Aggregation
const describeResult = run('git', ['describe', '--tags', '--abbrev=0']);
let logResult;

if (describeResult.status === 0) {
  const prevTag = describeResult.stdout.trim();
  logResult = run('git', ['log', `${prevTag}..HEAD`, '--oneline']);
} else {
  logResult = run('git', ['log', '--oneline']);
}

if (logResult.status !== 0) {
  console.error('Error gathering commit history.');
  if (logResult.stderr) console.error(logResult.stderr);
  process.exit(1);
}

const commits = logResult.stdout.trim().split('\n').map(line => line.replace(/\r$/, '')).filter(Boolean);
if (commits.length === 0) {
  console.error('No commits found in history.');
  process.exit(1);
}

const feats = [];
const fixes = [];
const others = [];

for (const commit of commits) {
  const match = commit.match(/^([a-f0-9]{7,40})\s+(.*)$/);
  if (!match) continue;
  const hash = match[1];
  const subject = match[2];
  
  if (subject.startsWith('feat:') || subject.startsWith('feat(')) {
    feats.push(`- ${subject} (${hash})`);
  } else if (subject.startsWith('fix:') || subject.startsWith('fix(')) {
    fixes.push(`- ${subject} (${hash})`);
  } else {
    others.push(`- ${subject} (${hash})`);
  }
}
if (feats.length === 0 && fixes.length === 0 && others.length === 0) {
  console.error('No commits found in history.');
  process.exit(1);
}

let releaseNotes = '## Changelog\n\n';
if (feats.length > 0) {
  releaseNotes += '### Features\n' + feats.join('\n') + '\n\n';
}
if (fixes.length > 0) {
  releaseNotes += '### Bug Fixes\n' + fixes.join('\n') + '\n\n';
}
if (others.length > 0) {
  releaseNotes += '### Other Changes\n' + others.join('\n') + '\n\n';
}
releaseNotes = releaseNotes.trim();

// 6. Push Tag / Draft Release
if (isDryRun) {
  console.log(`[dry-run] Would create local tag ${tagName}`);
  console.log(`[dry-run] Would push tag ${tagName} to origin`);
  console.log('--- Proposed Release Notes ---');
  console.log(releaseNotes);
  process.exit(0);
}

// 7. Actual Execution
console.log(`Creating local tag ${tagName}...`);
const tagCreate = run('git', ['tag', '-a', tagName, '-m', `Release ${tagName}`]);
if (tagCreate.status !== 0) {
  console.error('Error creating local git tag.');
  if (tagCreate.stderr) console.error(tagCreate.stderr);
  process.exit(1);
}

console.log(`Pushing tag ${tagName} to origin...`);
const tagPush = run('git', ['push', 'origin', tagName]);
if (tagPush.status !== 0) {
  console.error('Error pushing tag to origin.');
  if (tagPush.stderr) console.error(tagPush.stderr);
  process.exit(1);
}

if (canUseGh) {
  console.log('Creating draft release on GitHub...');
  const ghRelease = run('gh', ['release', 'create', tagName, '--draft', '--title', `Release ${tagName}`, '--notes', releaseNotes]);
  if (ghRelease.status !== 0) {
    console.error('Error creating GitHub Release.');
    if (ghRelease.stderr) console.error(ghRelease.stderr);
    process.exit(1);
  }
  console.log(`Successfully tagged ${tagName} and created GitHub Release draft!`);
} else {
  console.log(`Successfully tagged ${tagName} and pushed to origin!`);
  console.log('You can now draft the release on GitHub manually under the Releases/Tags page.');
}
process.exit(0);
