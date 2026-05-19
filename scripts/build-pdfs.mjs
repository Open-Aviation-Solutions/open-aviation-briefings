import { execSync } from 'child_process'
import { existsSync, mkdirSync, readdirSync, statSync } from 'fs'
import { join, dirname } from 'path'

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

const env = { ...process.env, PUPPETEER_EXECUTABLE_PATH: browserPath }
const files = findFiles('brief-slides', /-in-flight-notes\.md$/)

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
