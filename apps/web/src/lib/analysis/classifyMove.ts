export type MoveClass =
  | "brilliant"
  | "good"
  | "inaccuracy"
  | "mistake"
  | "blunder";

export interface MoveEvaluationInput {
  playedEvalCp: number;
  bestEvalCp: number;
  sideToMove: "white" | "black";
}

/**
 * Variant-tolerant move classification.
 *
 * Uses eval loss from the mover perspective.
 * Thresholds should be variant-tuned (Atomic swings differ from classical).
 */
export function classifyMove(input: MoveEvaluationInput): MoveClass {
  const perspective = input.sideToMove === "white" ? 1 : -1;
  const loss = (input.bestEvalCp - input.playedEvalCp) * perspective;

  if (loss <= 20) return "good";
  if (loss <= 80) return "inaccuracy";
  if (loss <= 180) return "mistake";
  return "blunder";
}

export function detectBrilliant(args: {
  moveClass: MoveClass;
  depth: number;
  onlyMoveFound: boolean;
  tacticalSwingCp: number;
}) {
  if (
    args.moveClass === "good" &&
    args.depth >= 20 &&
    args.onlyMoveFound &&
    args.tacticalSwingCp >= 250
  ) {
    return true;
  }

  return false;
}
