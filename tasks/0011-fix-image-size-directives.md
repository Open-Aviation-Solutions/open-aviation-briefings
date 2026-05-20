# Task 0011 — Fix image-size directive CSS placement

## Problem

The `imageDirectives` plugin registered in `marp.config.js` adds CSS classes
(`small`, `medium`, `large`, `left`, `right`) to `<img>` elements at the
engine level.  The CSS rules that give those classes meaning are currently
defined in the *theme* file:

```
themes/open-aviation-solutions/style.css  (lines 160-162)
  .small  { width: 25%; }
  .medium { width: 40%; }
  .large  { width: 55%; }
```

Because the styles live in the theme, they are absent when any other theme is
used (e.g. the portrait theme, or any future theme).  This is wrong: the
directives are a feature of the engine config, not of any particular theme.

## Fix

Marp CLI's config format has no native `style` key for injecting CSS on top of
every theme, so injection must happen in the engine's `render()` method.

1. **Remove** the three rules from `themes/open-aviation-solutions/style.css`.

2. **Create** `marp.config.css` alongside `marp.config.js` — the naming makes
   clear it is engine-level, not theme-specific:

   ```css
   .small  { width: 25%; }
   .medium { width: 40%; }
   .large  { width: 55%; }
   ```

3. **Read and inject** it in `marp.config.js`:

   ```js
   // top of file — readFileSync is already imported
   const ENGINE_CSS = readFileSync(new URL('./marp.config.css', import.meta.url), 'utf8')

   // inside render(), unconditionally:
   result.css += ENGINE_CSS
   ```

## Scope

- `themes/open-aviation-solutions/style.css` — remove three lines
- `themes/open-aviation-solutions/engine-directives.css` — new file
- `marp.config.js` — add constant + append in `render()`
- No slide source changes required; existing `![small …]` alt-text syntax is
  unaffected
