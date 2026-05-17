import { readFileSync } from 'fs'
import { Marp } from '@marp-team/marp-core'

const COMPONENT_SCRIPT = '/open-aviation-components/define.es.js'

// Treat custom elements (hyphenated tag names) as block-level HTML.
// Without this, markdown-it wraps them in <p> because they're not
// in its list of known block elements.
function customElementBlock(md) {
  md.block.ruler.before('html_block', 'custom_element_block', (state, startLine, endLine, silent) => {
    let pos = state.bMarks[startLine] + state.tShift[startLine]
    const lineMax = state.eMarks[startLine]

    if (state.src.charCodeAt(pos) !== 0x3C /* < */) return false
    pos++

    // Custom elements must contain a hyphen: e.g. four-forces, flight-path-overview
    const tagMatch = state.src.slice(pos, lineMax).match(/^([a-z][a-z0-9]*(?:-[a-z0-9]+)+)/)
    if (!tagMatch) return false

    if (silent) return true

    const tagName = tagMatch[1]
    let nextLine = startLine + 1

    while (nextLine < endLine) {
      const lPos = state.bMarks[nextLine] + state.tShift[nextLine]
      const lMax = state.eMarks[nextLine]
      const line = state.src.slice(lPos, lMax)
      if (!line.trim()) break
      nextLine++
      if (line.trimEnd().endsWith(`</${tagName}>`)) break
    }

    state.line = nextLine
    const token = state.push('html_block', '', 0)
    token.map = [startLine, state.line]
    token.content = state.getLines(startLine, state.line, state.blkIndent, true)
    return true
  })
}

// Adds CSS classes to inline images from leading directive words in the alt text.
// e.g. ![right medium A diagram of forces](diagram.png) → <img class="right medium" alt="A diagram of forces">
// Runs as a core rule after Marp's parse phase so Marp's own directives (drop-shadow,
// w:, h:, etc.) are consumed first and applied by Marp's renderer as normal.
function imageDirectives(md) {
  const LAYOUT_DIRECTIVES = new Set(['right', 'left', 'small', 'medium', 'large'])

  md.core.ruler.push('image_layout_classes', state => {
    for (const blockToken of state.tokens) {
      if (blockToken.type !== 'inline') continue
      for (const token of (blockToken.children || [])) {
        if (token.type !== 'image') continue

        const firstText = (token.children || [])[0]
        if (!firstText || firstText.type !== 'text') continue

        const words = firstText.content.trim().split(/\s+/).filter(Boolean)
        const classes = []
        let i = 0
        for (; i < words.length; i++) {
          if (LAYOUT_DIRECTIVES.has(words[i])) classes.push(words[i])
          else break
        }

        if (classes.length === 0) continue

        firstText.content = words.slice(i).join(' ')
        token.attrJoin('class', classes.join(' '))
      }
    }
  })
}

const PUBLISHED_COMPONENTS = ['aerofoil-dynamics', 'four-forces', 'briefing-overview', 'climb-performance', 'pitch-roll-yaw']
const LOCAL_COMPONENTS = {
  'youtube-video': '/components/youtube-video.js',
  'secondary-effect-climb-car': '/components/secondary-effect-climb-car.js',
  'secondary-effect-elevator': '/components/secondary-effect-elevator.js',
}

// All custom element tag names known to this config (published + local).
const ALL_INTERACTIVE_TAGS = [...PUBLISHED_COMPONENTS, ...Object.keys(LOCAL_COMPONENTS)]

// In Marp's presenter view all slides get `pointer-events:none` (specificity 0-2-1),
// which ties with the active-slide rule and wins because it comes later — blocking
// shadow-DOM controls inside custom elements from receiving clicks.
// Re-enable pointer events using :has() so only slides that actually contain an
// interactive component are affected. Specificity 0-3-3 beats the presenter rule.
// The selector list is derived from ALL_INTERACTIVE_TAGS so no separate maintenance
// is needed when components are added.
const PRESENTER_INTERACTIVE_CSS = `
body[data-bespoke-view=presenter] svg.bespoke-marp-slide.bespoke-marp-active:has(${ALL_INTERACTIVE_TAGS.join(', ')}) {
  pointer-events: auto;
}
`

export default {
  html: true,
  theme: 'open-aviation',
  themeSet: [
    './themes/open-aviation-solutions/style.css',
    './themes/open-aviation-solutions/portrait.css',
  ],
  engine: class extends Marp {
    constructor(opts) {
      super(opts)
      this.markdown.use(customElementBlock)
      this.markdown.use(imageDirectives)
    }

    render(markdown, env) {
      const result = super.render(markdown, env)

      const scripts = []
      if (PUBLISHED_COMPONENTS.some(tag => markdown.includes(`<${tag}`))) {
        scripts.push(`<script type="module" src="${COMPONENT_SCRIPT}"></script>`)
      }
      for (const [tag, src] of Object.entries(LOCAL_COMPONENTS)) {
        if (markdown.includes(`<${tag}`)) {
          scripts.push(`<script type="module" src="${src}"></script>`)
        }
      }
      if (ALL_INTERACTIVE_TAGS.some(tag => markdown.includes(`<${tag}`))) {
        result.css += PRESENTER_INTERACTIVE_CSS
      }

      if (scripts.length > 0) {
        result.html = scripts.join('\n') + '\n' + result.html
      }

      return result
    }
  },
}
