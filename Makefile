.PHONY: help dev build install

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "%-12s %s\n", $$1, $$2}'

node_modules: package-lock.json
	npm install
	@touch node_modules

install: node_modules ## Install dependencies

dev: node_modules ## Build slides and start dev server at localhost:4321
	npm run dev

build: node_modules ## Build slides and site to ./dist/
	npm run build
