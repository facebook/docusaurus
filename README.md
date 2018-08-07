# Munseo
📝⚡️ Transform your document (문서) to a website

# Disclaimer:
This is still a *WORK IN PROGRESS* (prototype static site generator). Expect lot of bugs :)

# Introduction
- Each page generated is own pre-rendered static HTML. 
- Once the page is loaded, ReactDOM takes over the static content and turns it into a full Single-Page Application (SPA). 

# Current 
- Generate page for `.md` files on `docs`
- Generate page for `.js` React files on `website/pages`

# Quick Start

Install with `yarn`. Check all available commands with:

```
yarn munseo --help
```

## Development Server

```bash
yarn start # open http://localhost:3000/ 
```

## Production Build

```bash
yarn build # check website/build
```

