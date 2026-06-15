import { readFileSync } from 'fs'
import { Marp } from '@marp-team/marp-core'

const BASE = process.env.SITE_BASE ?? ''
const COMPONENT_SCRIPT = `${BASE}/open-aviation-components/define.es.js`

// Treat custom elements (hyphenated tag names) as block-level HTML.
// Without this, markdown-it wraps them in <p> because they're not
// in its list of known block elements. A small set of non-hyphenated media
// tags (video, audio) is included for the same reason — markdown-it doesn't
// treat them as block-level either, so an inline <video> would otherwise be
// wrapped in <p> and lose its layout utility behaviour.
function customElementBlock(md) {
  md.block.ruler.before('html_block', 'custom_element_block', (state, startLine, endLine, silent) => {
    let pos = state.bMarks[startLine] + state.tShift[startLine]
    const lineMax = state.eMarks[startLine]

    if (state.src.charCodeAt(pos) !== 0x3C /* < */) return false
    pos++

    // Custom elements must contain a hyphen (e.g. four-forces, briefing-overview);
    // video/audio are matched explicitly as block-level media tags.
    const tagMatch = state.src.slice(pos, lineMax).match(/^([a-z][a-z0-9]*(?:-[a-z0-9]+)+|video|audio)/)
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
  'youtube-video': `${BASE}/components/youtube-video.js`,
  'secondary-effect-climb-car': `${BASE}/components/secondary-effect-climb-car.js`,
  'secondary-effect-elevator': `${BASE}/components/secondary-effect-elevator.js`,
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

// A deck opts in to a "DRAFT" watermark with `draft: true` in its frontmatter,
// to flag an unfinished brief. The faint diagonal text overlays every slide
// while leaving the content readable.
//
// The theme already uses some section pseudo-elements: `section::after` is the
// page number and `section.lead::before` is the title-slide brand logo. So the
// watermark uses the free slots — `section::before` on standard slides and
// `section.lead::after` on the title slide (which carries no pagination).
//
// The standard-slide rule must exclude `.lead` (`:not(.lead)`): a bare
// `section::before` matches the lead slide's logo pseudo-element too, and
// although the theme's more specific `section.lead::before` keeps the logo's
// own properties, undeclared ones here (notably `transform`) would cascade
// onto the logo and rotate it.
const DRAFT_WATERMARK_CSS = `
section:not(.lead)::before,
section.lead::after {
  content: 'DRAFT';
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-30deg);
  font-size: 220px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(200, 0, 0, 0.12);
  pointer-events: none;
  z-index: 9999;
}
`

export default {
  html: true,
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

      // When building for deployment (SITE_BASE set), prefix all absolute asset
      // paths so they resolve correctly under the base path on GitHub Pages.
      // This covers: CSS url() for fonts and SVG logos (in result.css, which
      // Marp CLI embeds into the HTML after render() returns), and img src
      // attributes in result.html for slide images.
      //
      // Must run before the script-injection block below, because those script
      // srcs are already constructed with BASE and would be double-prefixed if
      // the src="/" replacement ran over them.
      //
      // SITE_BASE is intentionally absent for `marp:serve` so that the
      // standalone presenter view works without a base path.
      if (BASE) {
        const prefixUrls = s => s
          .replace(/url\('\/(?!\/)/g, `url('${BASE}/`)
          .replace(/url\("\/(?!\/)/g, `url("${BASE}/`)
        result.css = prefixUrls(result.css)
        result.html = prefixUrls(result.html)
          .replace(/ src="\/(?!\/)/g, ` src="${BASE}/`)
      }

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

      // Opt-in DRAFT watermark, detected from the deck's frontmatter (the
      // frontmatter block is retained in `markdown` here; Marpit strips it
      // during tokenisation, not from this string).
      const frontmatter = markdown.match(/^---\n([\s\S]*?)\n---/)
      if (frontmatter && /^draft:\s*true\s*$/m.test(frontmatter[1])) {
        result.css += DRAFT_WATERMARK_CSS
      }

      if (scripts.length > 0) {
        result.html = scripts.join('\n') + '\n' + result.html
      }

      return result
    }
  },
}
