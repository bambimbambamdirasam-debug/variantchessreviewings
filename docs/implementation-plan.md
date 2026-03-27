# VariantChessReview Implementation Plan

## Phase 1 — Foundations (Week 1-2)

1. Bootstrap monorepo with `apps/web`, `apps/api`, `packages/shared`.
2. Implement Prisma schema + migrations.
3. Implement auth (magic link/OAuth).
4. Build game import parser for PGN + variant tags.

## Phase 2 — Analysis MVP (Week 3-4)

1. Integrate Fairy-Stockfish WASM worker in web client.
2. Add variant selector and auto-detection fallback.
3. Build move list + board playback + eval badges.
4. Persist moves/evals/comments.

## Phase 3 — Variant Engine Depth (Week 5-6)

1. Add custom variant definitions UI (config string + board dims).
2. Validate configs against engine startup.
3. Add backend UCI analysis workers for long jobs.
4. Add cache for repeated positions.

## Phase 4 — Review UX & Timeline (Week 7-8)

1. Add eval graph and mistake spikes.
2. Auto-tag inaccuracies/mistakes/blunders from eval delta.
3. Add manual annotations and colored move ratings.
4. Generate AI textual game summaries.

## Phase 5 — Sharing & Collaboration (Week 9)

1. Public/private review pages.
2. Shareable links and iframe embed support.
3. Optional collaborative comments.

## Phase 6 — Advanced Features (Week 10+)

1. Guess-the-move training mode.
2. Variant popularity leaderboard.
3. AI-vs-AI comparison reports.
4. Lichess/Pychess import connectors where legal and available.
