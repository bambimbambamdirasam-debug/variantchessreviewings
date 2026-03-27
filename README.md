# VariantChessReview

VariantChessReview is a modern, variant-first game analysis platform inspired by WintrChess and powered by Fairy-Stockfish.

## 1) Full architecture overview

### High-level system

- **Frontend (Next.js + React + Tailwind + Zustand)**
  - Imports PGN / variant notation / Fairyground session payloads.
  - Renders variant-capable board and move list.
  - Runs in-browser Fairy-Stockfish WASM for low-latency analysis.
  - Streams evals to graph and review UI.
- **Backend (FastAPI or Node API route equivalent)**
  - Stores users, games, move comments, evaluations, variant definitions.
  - Provides sharable review links with privacy controls.
  - Optional server-side UCI engine workers for heavier analysis.
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
      app/
      components/
        VariantBoard.tsx
      lib/
        analysis/
          classifyMove.ts
        engine/
          fairyWorker.ts
      store/
        reviewStore.ts
  api/
    src/
      routes/
        analyze.ts
prisma/
  schema.prisma
docs/
  implementation-plan.md
```

## 3) Key code snippets

- Engine integration: `apps/web/src/lib/engine/fairyWorker.ts`
- Board rendering: `apps/web/src/components/VariantBoard.tsx`
- Move evaluation + classification: `apps/web/src/lib/analysis/classifyMove.ts`
- Backend analysis endpoint skeleton: `apps/api/src/routes/analyze.ts`

## 4) Step-by-step implementation plan

See `docs/implementation-plan.md` for phased delivery from MVP to advanced social/training features.
