# Development/build image for open-aviation-briefings.
#
# Provides Node.js (matching CI) plus the Chromium that Marp needs to export the
# in-flight-notes PDFs, so `make dev`/`make build` work without installing any
# toolchain on the host. Used by the Makefile via docker or podman.
FROM node:22-bookworm-slim

# Chromium is required by Marp/Puppeteer for PDF export (scripts/build-pdfs.mjs).
# fonts-liberation gives Chromium a sane default font set for rendering.
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      chromium \
      ca-certificates \
      fonts-liberation \
 && rm -rf /var/lib/apt/lists/*

# Use the distro Chromium rather than letting Puppeteer download its own.
# /usr/bin/chromium is one of the paths build-pdfs.mjs already searches.
ENV PUPPETEER_SKIP_DOWNLOAD=1 \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app
