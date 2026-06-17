# Development/build image for open-aviation-briefings.
#
# Provides Node.js (matching CI) plus the Chromium that Marp needs to export the
# in-flight-notes PDFs and the Vale prose linter, so `make dev`/`build`/`check`
# all work without installing any toolchain on the host. Used by the Makefile
# via docker or podman.
FROM node:22-bookworm-slim

# - chromium: required by Marp/Puppeteer for PDF export (scripts/build-pdfs.mjs).
# - fonts-liberation: a sane default font set for Chromium rendering.
# - hunspell-en-au: the en_AU dictionary Vale's spell check reads from
#   /usr/share/hunspell (see .vale/styles/OpenAviation/Spelling.yml). Vale parses
#   the .dic/.aff files directly, so libhunspell itself is not needed.
# - curl: only used below to fetch the Vale binary.
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      chromium \
      ca-certificates \
      fonts-liberation \
      hunspell-en-au \
      curl \
 && rm -rf /var/lib/apt/lists/*

# Vale: a single static binary. Keep VALE_VERSION in sync with .github/workflows/ci.yml.
ARG VALE_VERSION=3.14.2
RUN arch="$(dpkg --print-architecture)" \
 && case "$arch" in \
      amd64) valearch="64-bit" ;; \
      arm64) valearch="arm64" ;; \
      *) echo "unsupported architecture: $arch" >&2; exit 1 ;; \
    esac \
 && curl -sSfL "https://github.com/vale-cli/vale/releases/download/v${VALE_VERSION}/vale_${VALE_VERSION}_Linux_${valearch}.tar.gz" \
      | tar -xz -C /usr/local/bin vale

# Use the distro Chromium rather than letting Puppeteer download its own.
# /usr/bin/chromium is one of the paths build-pdfs.mjs already searches.
ENV PUPPETEER_SKIP_DOWNLOAD=1 \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app
