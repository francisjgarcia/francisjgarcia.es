# francisjgarcia.es

Personal landing page — built with Node.js + Express, containerised with Docker.

## Stack

- **Backend**: Node.js, Express 5, compression
- **Frontend**: Vanilla JS, CSS custom properties, JetBrains Mono + Inter
- **Infrastructure**: Docker multi-stage build, Docker Compose (dev mode with read-only bind mounts and hot reload via `--watch`)
- **Deployment**: Express serves static files from `public/`, SPA-style catch-all route

## Project Structure

```
├── docker/
│   ├── Dockerfile          # Multi-stage: production + development targets
│   └── compose.yml         # Dev Compose config (port 3000, read-only volumes)
├── public/
│   ├── css/style.css       # All styles (minified)
│   ├── js/main.js          # All JS — i18n, terminal emulator, typewriter, scroll
│   ├── images/             # Avatar in webp + jpg, 3 responsive sizes
│   ├── index.html          # Single-page HTML
│   └── robots.txt
├── src/
│   └── server.js           # Express server
├── .editorconfig
├── .gitignore
├── .dockerignore
├── LICENSE
├── package.json
└── package-lock.json
```

## Development

```bash
docker compose -f docker/compose.yml up -d
# → http://localhost:3000
```

Changes to `src/` or `public/` are reflected immediately (bind mounts + Node `--watch`).

## Production

```bash
docker build -f docker/Dockerfile --target production -t francisjgarcia .
docker run -p 3000:3000 francisjgarcia
```

## License

MIT
