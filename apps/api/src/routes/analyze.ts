import type { Request, Response } from "express";

/**
 * POST /api/analyze
 * Body: { variant, positions: [{ ply, fen }], depth }
 */
export async function analyzeRoute(req: Request, res: Response) {
  const { variant, positions, depth = 16 } = req.body ?? {};

  if (!variant || !Array.isArray(positions)) {
    return res.status(400).json({ error: "variant and positions are required" });
  }

  // Placeholder: send to worker queue / uci microservice.
  // A production implementation should batch and stream partial progress.
  const evaluations = positions.map((p: { ply: number; fen: string }) => ({
    ply: p.ply,
    fen: p.fen,
    evalCp: 0,
    bestMove: "0000",
    depth,
    variant,
  }));

  return res.json({ variant, depth, evaluations });
}
