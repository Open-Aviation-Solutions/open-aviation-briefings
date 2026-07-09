import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import sitemap from '@astrojs/sitemap'
import fs from 'node:fs'
import path from 'node:path'
import { visit } from 'unist-util-visit'
import { pdfDownloadName } from './src/lib/pdf-download-name.mjs'

// When building on Cloudflare Pages (PR previews), CF_PAGES_URL is set automatically
// to the preview deployment URL. Use it as-is with no base path so asset paths resolve
// correctly under that URL. GitHub Pages production builds use the fixed constants.
const SITE = process.env.CF_PAGES_URL ?? 'https://open-aviation-solutions.github.io'
const BASE = process.env.CF_PAGES_URL ? '' : '/open-aviation-briefings'

// Open Aviation Solutions brand social card, served from this site's base path.
// Source of truth for the image is the website repo (public/og-image.png); the
// copy here keeps each GitHub Pages deploy self-contained.
const ogImageUrl = `${SITE}${BASE}/og-image.png`

const MIME = {
  '.css': 'text/css',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

// Vite serves public/ at root in dev, but prod serves it under the base path.
// This plugin makes dev consistent with prod.
const devPublicUnderBase = {
  name: 'dev-public-under-base',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use(BASE, (req, res, next) => {
      const file = path.join(process.cwd(), 'public', req.url ?? '/')
      fs.stat(file, (err, stat) => {
        if (err || !stat.isFile()) return next()
        res.setHeader('Content-Type', MIME[path.extname(file)] ?? 'application/octet-stream')
        fs.createReadStream(file).pipe(res)
      })
    })
  },
}

// Give every in-page link to a local brief-slides PDF a lesson-specific
// download name, so the SlideEmbed "Download PDF" button and the inline
// "download the PDF" markdown links all save differentiated filenames rather
// than colliding as identical "02-pre-flight-briefing-notes.pdf". External
// links (NZ CAA / CASA / FAA whiteboards) are left untouched — the download
// attribute is ignored cross-origin anyway.
function rehypePdfDownloadName() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a') return
      const href = node.properties?.href
      if (typeof href !== 'string') return
      if (/^[a-z]+:/i.test(href)) return // skip absolute/external URLs
      if (!href.includes('/brief-slides/') || !href.endsWith('.pdf')) return
      node.properties.download = pdfDownloadName(href)
    })
  }
}

export default defineConfig({
  site: SITE,
  base: BASE,
  markdown: {
    rehypePlugins: [rehypePdfDownloadName],
  },
  // When running inside the dev container (see Makefile/Dockerfile) the server
  // must listen on all interfaces so the forwarded host port can reach it.
  server: process.env.ASTRO_HOST ? { host: true } : {},
  vite: {
    plugins: [devPublicUnderBase],
  },
  integrations: [
    starlight({
      title: 'Open Aviation Briefings',
      customCss: ['./src/styles/global.css'],
      head: [
        { tag: 'meta', attrs: { property: 'og:image', content: ogImageUrl } },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
        { tag: 'meta', attrs: { name: 'twitter:image', content: ogImageUrl } },
        {
          tag: 'script',
          attrs: {
            defer: true,
            src: 'https://static.cloudflareinsights.com/beacon.min.js',
            'data-cf-beacon': '{"token": "c996028d44e34f17a30b5bc693372d9e"}',
          },
        },
      ],
      sidebar: [
        {
          label: 'Recreational Pilot License',
          autogenerate: { directory: 'recreational-pilot-license' },
        },
      ],
    }),
    sitemap(),
  ],
})
