export type EngineMode = "wasm" | "uci";

export interface AnalyzeRequest {
  variant: string;
  fen: string;
  multiPv?: number;
  depth?: number;
}

export interface EngineLine {
  pv: string[];
  scoreCp?: number;
  scoreMate?: number;
}

export interface AnalyzeResult {
  bestMove: string;
  lines: EngineLine[];
  raw: string[];
}

/**
 * Fairy-Stockfish wasm wrapper.
 *
 * Assumes a Worker that accepts UCI commands and posts back text lines.
 * Integrate with fairy-stockfish.wasm build artifacts.
 */
export class FairyWasmEngine {
  private worker: Worker;

  constructor(worker: Worker) {
    this.worker = worker;
  }

  private send(cmd: string) {
    this.worker.postMessage({ type: "uci", cmd });
  }

  async init(variant: string) {
    this.send("uci");
    this.send("isready");
    this.send(`setoption name UCI_Variant value ${variant}`);
    this.send("ucinewgame");
    this.send("isready");
  }

  async analyze(req: AnalyzeRequest): Promise<AnalyzeResult> {
    const depth = req.depth ?? 18;
    const multiPv = req.multiPv ?? 3;
    const raw: string[] = [];

    this.send(`setoption name MultiPV value ${multiPv}`);
    this.send(`position fen ${req.fen}`);
    this.send(`go depth ${depth}`);

    const lines = await this.collectUntilBestMove(raw);
    return {
      bestMove: lines.bestMove,
      lines: lines.pvs,
      raw,
    };
  }

  private collectUntilBestMove(raw: string[]): Promise<{ bestMove: string; pvs: EngineLine[] }> {
    return new Promise((resolve) => {
      const pvs: EngineLine[] = [];
      const handler = (event: MessageEvent<{ line?: string }>) => {
        const line = event.data?.line;
        if (!line) return;

        raw.push(line);

        if (line.startsWith("info") && line.includes(" pv ")) {
          const parsed = parseUciInfoLine(line);
          if (parsed) pvs.push(parsed);
        }

        if (line.startsWith("bestmove")) {
          this.worker.removeEventListener("message", handler as EventListener);
          const bestMove = line.split(" ")[1] ?? "";
          resolve({ bestMove, pvs });
        }
      };

      this.worker.addEventListener("message", handler as EventListener);
    });
  }
}

function parseUciInfoLine(line: string): EngineLine | null {
  const cpMatch = line.match(/score cp (-?\d+)/);
  const mateMatch = line.match(/score mate (-?\d+)/);
  const pvIndex = line.indexOf(" pv ");
  if (pvIndex < 0) return null;

  const pvMoves = line.slice(pvIndex + 4).trim().split(/\s+/);
  return {
    pv: pvMoves,
    scoreCp: cpMatch ? Number(cpMatch[1]) : undefined,
    scoreMate: mateMatch ? Number(mateMatch[1]) : undefined,
  };
}
