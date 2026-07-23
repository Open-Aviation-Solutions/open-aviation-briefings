import { execSync } from 'child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from 'fs'
import { join, dirname } from 'path'
import { pathToFileURL } from 'url'

const BROWSER_SEARCH_PATHS = [
  '/snap/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
]

function findBrowser() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH
  return BROWSER_SEARCH_PATHS.find(p => existsSync(p)) ?? null
}

function findFiles(dir, pattern) {
  const results = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      results.push(...findFiles(full, pattern))
    } else if (pattern.test(entry)) {
      results.push(full)
    }
  }
  return results
}

const browserPath = findBrowser()
if (!browserPath) {
  console.error('No Chrome/Chromium found. Install chromium or set PUPPETEER_EXECUTABLE_PATH.')
  process.exit(1)
}

// A deck opts in to PDF export with `pdf: true` in its frontmatter.
function wantsPdf(file) {
  const match = readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---/)
  return match !== null && /^pdf:\s*true\s*$/m.test(match[1])
}

// Marp exports PDFs by loading each deck's HTML over file://. The theme's
// root-absolute asset URLs (/fonts/*.woff2, /themes/*brand.svg) can't resolve
// in that context, so the fonts silently fall back to Chromium's defaults and
// the brand logos drop out — even though the on-screen slideshow, served over
// HTTP at the site base path, renders them correctly. Point SITE_BASE at the
// public/ directory as a file:// root so marp.config prefixes those paths to
// real files (public/fonts and public/themes are symlinks into the repo /
// node_modules), which --allow-local-files then lets Chromium read. CF_PAGES_URL
// is cleared so marp.config uses SITE_BASE rather than its empty-base branch.
const env = {
  ...process.env,
  PUPPETEER_EXECUTABLE_PATH: browserPath,
  SITE_BASE: pathToFileURL(join(process.cwd(), 'public')).href,
}
delete env.CF_PAGES_URL
const files = findFiles('brief-slides', /\.md$/).filter(wantsPdf)

for (const file of files) {
  const out = file
    .replace(/^brief-slides\//, 'public/brief-slides/')
    .replace(/\.md$/, '.pdf')
  mkdirSync(dirname(out), { recursive: true })
  console.log(`PDF: ${file} → ${out}`)
  execSync(
    `node_modules/.bin/marp --config marp.config.js --allow-local-files --pdf "${file}" -o "${out}"`,
    { stdio: 'inherit', env },
  )
}
