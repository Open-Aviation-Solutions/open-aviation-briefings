.PHONY: help dev build install local-components-symlink lint-prose check clean-unused-images

# --- Toolchain selection ----------------------------------------------------
#
# npm runs directly when it is installed. Otherwise the build falls back to a
# container (podman or docker) so the project works without installing Node on
# the host. Override with `make dev USE_CONTAINER=1` to force the container, or
# `CONTAINER_RUNTIME=docker` to pick a runtime.
NPM_BIN := $(shell command -v npm 2>/dev/null)
# Prefer the real `podman` binary over a `docker` shim that wraps it.
CONTAINER_RUNTIME ?= $(shell command -v podman 2>/dev/null || command -v docker 2>/dev/null)
IMAGE := open-aviation-briefings-dev

ifndef USE_CONTAINER
ifeq ($(NPM_BIN),)
USE_CONTAINER := 1
endif
endif

ifdef USE_CONTAINER
ifeq ($(CONTAINER_RUNTIME),)
$(error npm is not installed and no container runtime (podman/docker) was found — install one of them)
endif

# Rootless podman maps the container's root to the host user, so bind-mounted
# files keep the right ownership. Rootful docker does not, so run as the host
# user there to avoid root-owned files in the working tree.
ifeq ($(findstring podman,$(CONTAINER_RUNTIME)),)
CONTAINER_USER := --user $(shell id -u):$(shell id -g) -e HOME=/tmp -e npm_config_cache=/tmp/.npm
endif

# Attach a TTY only when one is present (keeps `make build` working in CI).
TTY := $(shell [ -t 0 ] && echo -it)
CONTAINER_RUN := $(CONTAINER_RUNTIME) run --rm $(TTY) -v $(CURDIR):/app $(CONTAINER_USER) -e ASTRO_HOST=1
NPM := $(CONTAINER_RUN) $(IMAGE) npm
VALE := $(CONTAINER_RUN) $(IMAGE) vale
# Stamp file marking the last successful image build, so plain `make` runs only
# rebuild the image when the Dockerfile is newer (no runtime call otherwise).
IMAGE_STAMP := .image.stamp
else
NPM := npm
VALE := vale
endif

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "%-12s %s\n", $$1, $$2}'

ifdef USE_CONTAINER
# Rebuild the image whenever the Dockerfile changes; `make` skips it otherwise
# because the stamp is newer. `touch Dockerfile` (or delete the stamp) forces a
# rebuild. A bind-mount image has no COPY steps, so the Dockerfile is its only input.
$(IMAGE_STAMP): Dockerfile
	$(CONTAINER_RUNTIME) build -t $(IMAGE) .
	@touch $@
endif

node_modules: $(IMAGE_STAMP) package.json package-lock.json
	$(NPM) install
	@touch node_modules

local-components-symlink: ## Symlink ../open-aviation-components into node_modules for local development
	rm -rf node_modules/@open-aviation-solutions/components
	ln -s $(abspath ../open-aviation-components) node_modules/@open-aviation-solutions/components

install: node_modules ## Install dependencies

dev: node_modules ## Build slides and start dev server at localhost:4324
ifdef USE_CONTAINER
	$(CONTAINER_RUN) -p 4324:4324 $(IMAGE) npm run dev
else
	npm run dev
endif

build: node_modules ## Build slides and site to ./dist/
	$(NPM) run build

lint-prose: $(IMAGE_STAMP) ## Spell- and style-check slides and instructor notes with Vale
	$(VALE) brief-slides/ src/content/docs/

check: lint-prose ## Run all checks

clean-unused-images: ## List brief-assets/ files no slide deck references (DELETE=1 to remove)
	@scripts/clean-unused-images.sh
