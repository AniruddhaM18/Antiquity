// participantRouter.ts
import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getLeaderboardController, getMyContest, joinContest, leaveContest } from "../controllers/participantController.js";

const participantRouter: Router = Router();

// Join contest using join code (from request body)
participantRouter.post("/contest/join", authMiddleware, joinContest);

// Leave contest (still uses contest ID from URL)
participantRouter.delete("/contest/:id/leave", authMiddleware, leaveContest);

// Get user's contests
participantRouter.get("/my-contest", authMiddleware, getMyContest);

// Get leaderboard for a contest (still uses contest ID from URL)
participantRouter.get("/contests/:id/leaderboard", authMiddleware, getLeaderboardController);


export default participantRouter;