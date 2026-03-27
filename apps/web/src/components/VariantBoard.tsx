"use client";

import React from "react";

export type VariantBoardConfig = {
  variant: string;
  width: number;
  height: number;
  pieceSet: string;
  fen: string;
};

type Props = {
  config: VariantBoardConfig;
  onMove?: (move: string) => void;
};

/**
 * Adapter component: connect Fairyground/Chessground style board drivers.
 *
 * For production, wire this to fairyground board logic so non-8x8 boards
 * and custom pieces render correctly.
 */
export function VariantBoard({ config, onMove }: Props) {
  const cells = Array.from({ length: config.width * config.height }, (_, i) => i);

  return (
    <section className="rounded-2xl bg-zinc-900 p-4 text-zinc-100 shadow-xl">
      <header className="mb-3 flex items-center justify-between text-sm">
        <span className="font-medium">{config.variant}</span>
        <span className="text-zinc-400">{config.width}x{config.height}</span>
      </header>

      <div
        className="grid gap-0.5 overflow-hidden rounded-lg border border-zinc-700"
        style={{ gridTemplateColumns: `repeat(${config.width}, minmax(0, 1fr))` }}
      >
        {cells.map((index) => {
          const x = index % config.width;
          const y = Math.floor(index / config.width);
          const dark = (x + y) % 2 === 1;

          return (
            <button
              key={index}
              type="button"
              onClick={() => onMove?.(`cell-${x}-${y}`)}
              className={[
                "aspect-square transition-colors",
                dark ? "bg-zinc-700 hover:bg-zinc-600" : "bg-zinc-300 hover:bg-zinc-200",
              ].join(" ")}
              aria-label={`Square ${x},${y}`}
            />
          );
        })}
      </div>
    </section>
  );
}
