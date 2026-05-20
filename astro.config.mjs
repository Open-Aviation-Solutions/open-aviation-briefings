import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

export default defineConfig({
  site: 'https://open-aviation-solutions.github.io',
  base: '/open-aviation-briefings',
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
