# francisjgarcia.es

Personal landing page — built with vanilla HTML, CSS & JS.  
Served via Node.js (Express) in a lightweight Docker container.

## Quick Start

```bash
docker compose -f docker/compose.yml up -d
```

Open http://localhost:3000

Con hot reload: monta `src/` y `public/` como volúmenes y Node usa `--watch` para recargar al editar.

## Build & Run (manual)

```bash
docker build -t francisjgarcia -f docker/Dockerfile .
docker run -d -p 3000:3000 francisjgarcia
```

## Run without Docker

```bash
npm install
npm start
```

## Images

Place your images in `public/images/`:

| File | Purpose |
|------|---------|
| `logo.jpg` | Profile picture (square, 512×512+) |

## Tech Stack

- Vanilla HTML/CSS/JS (no frameworks)
- Node.js + Express (static serving, compression, security headers)
- Docker + Compose
- Google Fonts (Inter + JetBrains Mono)

## Deploy

```bash
docker compose -f docker/compose.yml up -d --build
```

## Structure

```
.
├── src/
│   └── server.js            # Node.js entry point
├── public/
│   ├── index.html           # Landing page
│   └── images/
│       └── logo.jpg         # Profile picture
├── docker/
│   ├── Dockerfile           # Multi-stage (deps / production / development)
│   └── compose.yml          # Local dev con hot reload
├── package.json             # Dependencies
└── README.md
```
