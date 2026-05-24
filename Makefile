.PHONY: help dev build install local-components-symlink lint-prose check clean-unused-images

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "%-12s %s\n", $$1, $$2}'

node_modules: package.json package-lock.json
	npm install
	@touch node_modules

local-components-symlink: ## Symlink ../open-aviation-components into node_modules for local development
	rm -rf node_modules/@open-aviation-solutions/components
	ln -s $(abspath ../open-aviation-components) node_modules/@open-aviation-solutions/components

install: node_modules ## Install dependencies

dev: node_modules ## Build slides and start dev server at localhost:4321
	npm run dev

build: node_modules ## Build slides and site to ./dist/
	npm run build

lint-prose: ## Spell- and style-check slides and instructor notes with Vale
	vale brief-slides/ src/content/docs/

check: lint-prose ## Run all checks

clean-unused-images: ## List brief-assets/ files no slide deck references (DELETE=1 to remove)
	@scripts/clean-unused-images.sh
