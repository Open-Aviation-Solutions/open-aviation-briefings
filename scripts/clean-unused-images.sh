#!/usr/bin/env bash
# clean-unused-images.sh — list (or delete) tracked brief-assets/ files that no slide
# deck or content page references.
#
# Default: dry-run (prints unreferenced asset paths to stdout).
# DELETE=1: also removes the unreferenced files (and their .yaml sidecars).
#
# Excludes:
#   - .yaml sidecars (handled alongside their image partner)
#   - INSTRUCTIONS.md and any other *.md (documentation, not assets)
#   - brief-assets/_candidate-images/ (gitignored bulk-extraction cache)
#
# Scans for references in:
#   - brief-slides/**/*.md
#   - src/content/**/*.{md,mdx}
#
# Run from the project root.

set -euo pipefail

[[ -d brief-assets ]] || { echo "clean-unused-images: run from project root (no brief-assets/ here)" >&2; exit 1; }

# Collect all candidate asset files (anything under brief-assets/ that isn't a sidecar,
# docs file, or in the gitignored candidate cache).
mapfile -t assets < <(
  find brief-assets \
    -type d \( -name '_candidate-images' \) -prune -o \
    -type f ! -name '*.yaml' ! -name '*.md' -print \
  | sort
)

# Build a single haystack of all slide / page sources to grep against.
mapfile -t haystack < <(
  { find brief-slides -type f -name '*.md' 2>/dev/null
    find src/content -type f \( -name '*.md' -o -name '*.mdx' \) 2>/dev/null
  } | sort
)

if (( ${#haystack[@]} == 0 )); then
  echo "clean-unused-images: no slide / content files to scan — refusing to flag everything as unused" >&2
  exit 1
fi

unused=()
for asset in "${assets[@]}"; do
  basename="$(basename "$asset")"
  # Match either the basename or the full path (the project uses absolute /brief-assets/
  # URLs in slides). Basename alone is enough for both cases and avoids false-negatives
  # when paths get reformatted.
  if ! grep -q -F -- "$basename" "${haystack[@]}"; then
    unused+=("$asset")
  fi
done

if (( ${#unused[@]} == 0 )); then
  echo "clean-unused-images: no unused tracked assets found" >&2
  exit 0
fi

printf '%s\n' "${unused[@]}"

if [[ "${DELETE:-}" == "1" ]]; then
  for asset in "${unused[@]}"; do
    sidecar="${asset}.yaml"
    # Also try <stem>.yaml for the alternative sidecar naming (foo.png.yaml vs foo.yaml).
    stem_sidecar="${asset%.*}.yaml"
    git rm -f -- "$asset" 2>/dev/null || rm -f -- "$asset"
    [[ -f "$sidecar" ]]      && { git rm -f -- "$sidecar"      2>/dev/null || rm -f -- "$sidecar"; }
    [[ -f "$stem_sidecar" ]] && { git rm -f -- "$stem_sidecar" 2>/dev/null || rm -f -- "$stem_sidecar"; }
  done
  echo "clean-unused-images: removed ${#unused[@]} asset(s) and their sidecars" >&2
else
  echo "clean-unused-images: ${#unused[@]} unused asset(s) listed above. Re-run with DELETE=1 to remove." >&2
fi
