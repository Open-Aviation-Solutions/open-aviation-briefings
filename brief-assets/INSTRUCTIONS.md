# brief-assets

Static assets (video, images, etc.) used in Marp slide decks.

## Directory structure

Assets are organised to mirror the `brief-slides/` directory tree:

```
brief-assets/<course>/<lesson-directory>/<asset-file>
```

For example, an asset used in `brief-slides/recreational-pilot-license/01-effects-of-controls/02-theory-part-1.md` lives at:

```
brief-assets/recreational-pilot-license/01-effects-of-controls/forces-on-hand-wing.mp4
```

When adding a new asset, create the matching course/lesson subdirectory under `brief-assets/` and place the file there. Reference it in the slide using the absolute path `/brief-assets/<course>/<lesson-directory>/<asset-file>` (Astro serves `brief-assets/` via the `public/brief-assets` symlink).

## Candidate images

`_candidate-images/` holds images extracted from source PDFs (e.g. via the `extract-pdf-images` skill) that have not yet been assigned to a lesson. Each image has a `.yaml` attribution sidecar.

When promoting a candidate image to a lesson, **copy** it (don't move it) — the same image may be useful in multiple lessons. Copy both the image file and its `.yaml` sidecar, then update the sidecar's `figure_ref` and `notes` fields for the specific use. If the image needs cropping or other processing, save the result as a new file alongside the original candidate.
