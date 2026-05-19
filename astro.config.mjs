import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

export default defineConfig({
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
