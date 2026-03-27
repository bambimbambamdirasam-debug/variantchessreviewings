import cors from "cors";
import express from "express";
import { analyzeRoute } from "./routes/analyze";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "variantchessreview-api" });
});

app.post("/api/analyze", analyzeRoute);

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
