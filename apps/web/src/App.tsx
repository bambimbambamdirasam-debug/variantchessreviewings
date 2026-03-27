import { useMemo, useState } from "react";
import { VariantBoard } from "./components/VariantBoard";
import { classifyMove, type MoveClass } from "./lib/analysis/classifyMove";
import { useReviewStore } from "./store/reviewStore";

const API_BASE = "http://localhost:4000";

const variantConfig: Record<string, { width: number; height: number }> = {
  chess: { width: 8, height: 8 },
  atomic: { width: 8, height: 8 },
  crazyhouse: { width: 8, height: 8 },
  xiangqi: { width: 9, height: 10 },
};

export function App() {
  const [pgnText, setPgnText] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("chess");
  const [status, setStatus] = useState("Idle");
  const [lastClass, setLastClass] = useState<MoveClass | null>(null);

  const { moves, upsertMove, setVariant } = useReviewStore();

  const board = useMemo(() => {
    const shape = variantConfig[selectedVariant] ?? variantConfig.chess;
    return {
      variant: selectedVariant,
      width: shape.width,
      height: shape.height,
      pieceSet: "alpha",
      fen: "startpos",
    };
  }, [selectedVariant]);

  async function analyzeSample() {
    setStatus("Analyzing...");
    setVariant(selectedVariant);

    const response = await fetch(`${API_BASE}/api/analyze`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        variant: selectedVariant,
        depth: 14,
        positions: [{ ply: 1, fen: board.fen }],
      }),
    });

    const payload = await response.json();
    const evaluation = payload.evaluations?.[0];

    const moveClass = classifyMove({
      sideToMove: "white",
      bestEvalCp: 20,
      playedEvalCp: evaluation?.evalCp ?? 0,
    });

    upsertMove({
      ply: 1,
      san: "e4",
      fen: board.fen,
      evalCp: evaluation?.evalCp,
      bestMove: evaluation?.bestMove,
      classification: moveClass,
      comment: "Imported for quick review",
    });

    setLastClass(moveClass);
    setStatus("Done");
  }

  return (
    <main className="layout">
      <section className="leftPane">
        <h1>VariantChessReview</h1>
        <p className="muted">Analyze Fairy variants with a modern review workflow.</p>

        <div className="card">
          <label>Variant</label>
          <select value={selectedVariant} onChange={(e) => setSelectedVariant(e.target.value)}>
            {Object.keys(variantConfig).map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>

          <label>Paste PGN / notation</label>
          <textarea
            rows={7}
            value={pgnText}
            onChange={(e) => setPgnText(e.target.value)}
            placeholder="Paste PGN, CECP/UCI logs, or variant notation..."
          />

          <button onClick={analyzeSample}>Run sample analysis</button>
          <p className="muted">Status: {status}</p>
          {lastClass && <p className="muted">Move classification: {lastClass}</p>}
        </div>
      </section>

      <section className="rightPane">
        <VariantBoard config={board} />

        <div className="card">
          <h2>Move Review</h2>
          {moves.length === 0 ? (
            <p className="muted">No moves analyzed yet.</p>
          ) : (
            <ul>
              {moves.map((m) => (
                <li key={m.ply}>
                  #{m.ply} {m.san} | eval {m.evalCp ?? "?"} | best {m.bestMove ?? "?"} | {m.classification}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
