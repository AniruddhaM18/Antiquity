// participantRouter.ts
import { Router } from "express";
import { authMiddleware, requireContestParticipant } from "../middleware/authMiddleware.js";
import { getLeaderboardController, getMyContest, joinContest, leaveContest } from "../controllers/participantController.js";

const participantRouter: Router = Router();

participantRouter.post("/contest/:id/join", authMiddleware, requireContestParticipant, joinContest);
participantRouter.delete("/contest/:id/leave", authMiddleware, leaveContest);
participantRouter.get("/my-contest", authMiddleware, getMyContest);
participantRouter.get("/contests/:id/leaderboard", authMiddleware, getLeaderboardController);

export default participantRouter;