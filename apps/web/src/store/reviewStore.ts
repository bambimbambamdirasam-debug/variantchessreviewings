import { create } from "zustand";
import type { MoveClass } from "../lib/analysis/classifyMove";

export interface MoveReview {
  ply: number;
  san: string;
  fen: string;
  evalCp?: number;
  bestMove?: string;
  classification?: MoveClass;
  comment?: string;
}

interface ReviewState {
  variant: string;
  moves: MoveReview[];
  setVariant: (variant: string) => void;
  upsertMove: (move: MoveReview) => void;
  setComment: (ply: number, comment: string) => void;
}

export const useReviewStore = create<ReviewState>((set) => ({
  variant: "chess",
  moves: [],
  setVariant: (variant) => set({ variant }),
  upsertMove: (move) =>
    set((state) => {
      const idx = state.moves.findIndex((m) => m.ply === move.ply);
      if (idx === -1) return { moves: [...state.moves, move] };

      const next = [...state.moves];
      next[idx] = { ...next[idx], ...move };
      return { moves: next };
    }),
  setComment: (ply, comment) =>
    set((state) => ({
      moves: state.moves.map((m) => (m.ply === ply ? { ...m, comment } : m)),
    })),
}));
