// liveContestRouter.ts
import { Router } from "express";
import { authMiddleware, requireContestHost, requireContestParticipant } from "../middleware/authMiddleware.js";
import { endLiveContest, getCurrentQuestion, getLiveStatus, moveToNextQuestion, startLiveContest } from "../controllers/liveContestController.js";
import { getMyResponse, submitAnswer } from "../controllers/responseController.js";

const liveContestRouter: Router = Router();

//host controls - only contest creator
liveContestRouter.post("/contest/:id/live/start", authMiddleware, requireContestHost, startLiveContest);
liveContestRouter.put("/live/:liveContestId/next", authMiddleware, requireContestHost, moveToNextQuestion);
liveContestRouter.post("/live/:liveContestId/end", authMiddleware, requireContestHost, endLiveContest);

//participant - members only, not creator
liveContestRouter.get("/live/:liveContestId/current", authMiddleware, requireContestParticipant, getCurrentQuestion);
liveContestRouter.get("/live/:liveContestId/status", authMiddleware, getLiveStatus); // anyone can view status

//responses - participants only (not creator)
liveContestRouter.post("/live/:liveContestId/respond", authMiddleware, requireContestParticipant, submitAnswer);
liveContestRouter.get("/live/:liveContestId/my-responses", authMiddleware, getMyResponse);

export default liveContestRouter;