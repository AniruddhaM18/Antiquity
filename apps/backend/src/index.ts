import dotenv from "dotenv";
dotenv.config();
import http from "http";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import contestRouter from "./routes/contestRoutes.js";
import authRouter from "./routes/authRoutes.js";
import participantRouter from "./routes/participantRouter.js";
import liveContestRouter from "./routes/liveContestRoutes.js";
import { liveContestStore } from "./redis/liveContestStore.js";

const app = express();

const PORT = Number(process.env.PORT) || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL;

if (!FRONTEND_URL) {
  console.error("FRONTEND_URL is missing in .env");
  process.exit(1);
}

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());
app.use(cookieParser());

// health check
app.get("/health", (req, res) => {
  res.json({ message: "Antiquity, ageing like a fine wine" });
});

// ROUTES
app.use("/api/auth", authRouter);
app.use("/api/contests", contestRouter);
app.use("/api/participants", participantRouter);
app.use("/api/live", liveContestRouter);

// Optional: periodic cleanup (mostly unnecessary if Redis TTLs are correct)
// Keep it if your Redis store's `cleanup()` does extra safety work.
setInterval(async () => {
  try {
    await liveContestStore.cleanup(60);
  } catch (err) {
    console.error("Live contest cleanup failed:", err);
  }
}, 5 * 60 * 1000);

// Optional: 404 handler
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Backend listening on @:${PORT}`);
});