import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import fs from 'node:fs'
import path from 'node:path'

const BASE = '/open-aviation-briefings'

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

export default defineConfig({
  site: 'https://open-aviation-solutions.github.io',
  base: BASE,
  vite: {
    plugins: [devPublicUnderBase],
  },
  integrations: [
    starlight({
      title: 'Open Aviation Briefings',
      customCss: ['./src/styles/global.css'],
      sidebar: [
        {
          label: 'Recreational Pilot License',
          autogenerate: { directory: 'recreational-pilot-license' },
        },
      ],
    }),
  ],
})
