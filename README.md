# VariantChessReview

VariantChessReview is a modern, variant-first game analysis platform inspired by WintrChess and powered by Fairy-Stockfish.

## Quick start (run locally)

### Prerequisites

- Node.js 20+
- npm 10+

### Install

```bash
npm install
```

### Run both web + api

```bash
npm run dev
```

- Web UI: `http://localhost:5173`
- API: `http://localhost:4000`

### Run individually

```bash
npm run dev:web
npm run dev:api
```

## How to use the website

1. Open `http://localhost:5173`.
2. Pick a variant from the selector (`chess`, `atomic`, `crazyhouse`, `xiangqi`).
3. Paste PGN/notation into the textarea.
4. Click **Run sample analysis**.
5. Review move output in the right panel:
   - engine eval (placeholder until real engine wiring)
   - best move (placeholder)
   - move classification (`good/inaccuracy/mistake/blunder`)

> Current build is an MVP scaffold. The WASM engine wrapper and API contract are in place, and real Fairy-Stockfish worker wiring is the next step.

## 1) Full architecture overview

### High-level system

- **Frontend (React + Vite + Zustand)**
  - Imports PGN / variant notation / Fairyground session payloads.
  - Renders variant-capable board and move list.
  - Uses a review store for comment/rating workflows.
- **Backend (Node + Express)**
  - Receives analysis requests and returns batched evaluation payloads.
  - Will host longer-running UCI worker orchestration.
- **Engine layer**
  - Unified `AnalysisEngine` interface supports:
    - `wasm` mode (client)
    - `uci` mode (server)
  - Variant-aware initialization via UCI options and config strings.
- **Data layer (PostgreSQL + Prisma)**
  - Normalized tables for users, games, moves, evaluations, comments, variants.
  - Variant definitions stored as config payloads to support custom fairy rules.

### Request flow

1. User imports a game.
2. Parser resolves variant metadata (auto-detect + manual override).
3. Frontend board adapter loads proper dimensions/pieces/rules.
4. Analysis orchestrator sends positions to Fairy-Stockfish.
5. Per-move evals are persisted; move classification runs from eval delta.
6. Timeline graph and review annotations update live.
7. User shares review via public/private slug.

### Scalability notes

- Queue long analyses via background workers (BullMQ/Celery).
- Cache identical `(variant, fen, depth)` requests in Redis.
- Use object storage for uploaded files and snapshots.
- Partition evaluations by `game_id` for large datasets.

## 2) Folder structure

```txt
apps/
  web/
    src/
      components/
        VariantBoard.tsx
      lib/
        analysis/
          classifyMove.ts
        engine/
          fairyWorker.ts
      store/
        reviewStore.ts
      App.tsx
      main.tsx
      styles.css
  api/
    src/
      routes/
        analyze.ts
      server.ts
prisma/
  schema.prisma
docs/
  implementation-plan.md
```

## 3) Key code snippets

- Engine integration: `apps/web/src/lib/engine/fairyWorker.ts`
- Board rendering: `apps/web/src/components/VariantBoard.tsx`
- Move evaluation + classification: `apps/web/src/lib/analysis/classifyMove.ts`
- Backend analysis endpoint: `apps/api/src/routes/analyze.ts`
- User workflow page: `apps/web/src/App.tsx`

## 4) Step-by-step implementation plan

See `docs/implementation-plan.md` for phased delivery from MVP to advanced social/training features.
