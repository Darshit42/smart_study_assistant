import express from "express";
import cors from "cors";
import { PORT } from "./config.js";
import { setupHealthRoute } from "./routes/health.js";
import { setupStudyRoute } from "./routes/study.js";

export const app = express();
app.use(cors());
app.use(express.json());

setupHealthRoute(app);
setupStudyRoute(app);

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.path} not found.` });
});


app.listen(PORT, () => {
  console.log(`Smart Study Assistant backend listening on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
})
