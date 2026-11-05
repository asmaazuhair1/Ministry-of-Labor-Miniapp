# Deployment

**Live URL:** https://ministry-of-labor-miniapp.uiux-asmaa-a.workers.dev/

_Last updated: 2026-11-05_

The app is built as a static client bundle and served from Cloudflare Workers.

## Build

```bash
npm run build:mol
```

This outputs the production bundle to `dist/`, which is deployed to the Worker.
