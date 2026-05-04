import { Marp } from '@marp-team/marp-core'

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

// Map from custom element tag name to its script source.
// The engine auto-injects only the scripts used in each deck.
const COMPONENT_SCRIPTS = {
  'four-forces':          '/open-aviation-components/assets/fourForces-CKybd77k.js',
  'flight-path-overview': '/open-aviation-components/assets/flightPathOverview-DAWYUpMb.js',
  'climb-performance':    '/open-aviation-components/assets/climbPerformance-CacJkHhC.js',
  'youtube-video':        '/components/youtube-video.js',
}

// Marpit scopes all theme CSS with this high-specificity prefix (id=1, elements=3).
// Our rules must use the same prefix to beat the theme's `display:block` on section.
const S = 'div#\\:\\$p > svg > foreignObject > '

// CSS for the `interactive` slide class: two-column layout with component on the right.
// Direct children of section.interactive are placed by tag type — no wrapper divs needed.
const LAYOUT_CSS = `
${S}section.interactive {
  display: grid;
  grid-template-columns: 1fr 1.8fr;
  grid-template-rows: auto 1fr;
  gap: 0 24px;
  padding: 40px;
  align-content: start;
}
${S}section.interactive > h1 {
  grid-column: 1 / -1;
  margin-bottom: 8px;
}
${S}section.interactive > p {
  grid-column: 1;
  grid-row: 2;
  align-self: start;
  font-size: 0.85em;
}
${S}section.interactive > four-forces,
${S}section.interactive > flight-path-overview,
${S}section.interactive > climb-performance,
${S}section.interactive > youtube-video {
  grid-column: 2;
  grid-row: 2;
}
`

export default {
  html: true,
  themeSet: [],
  engine: class extends Marp {
    constructor(opts) {
      super(opts)
      this.markdown.use(customElementBlock)
    }

    render(markdown, env) {
      const result = super.render(markdown, env)

      // Inject layout CSS (goes into <head> via the CLI template)
      result.css += LAYOUT_CSS

      // Auto-inject only the component scripts actually used in this deck
      const scripts = Object.entries(COMPONENT_SCRIPTS)
        .filter(([tag]) => markdown.includes(`<${tag}`))
        .map(([, src]) => `<script type="module" src="${src}"></script>`)

      if (scripts.length > 0) {
        result.html = scripts.join('\n') + '\n' + result.html
      }

      return result
    }
  },
}
