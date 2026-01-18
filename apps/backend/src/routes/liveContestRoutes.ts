import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { endLiveContest, getCurrentQuestion, getLiveStatus, moveToNextQuestion, startLiveContest } from "../controllers/liveContestController.js";
import { getMyResponse, submitAnswer } from "../controllers/responseController.js";

const liveContestRouter: Router = Router();

//host controls
liveContestRouter.post("/contest/:id/live/start", authMiddleware, startLiveContest);
liveContestRouter.put("/live/:liveContestId/next", authMiddleware, moveToNextQuestion);
liveContestRouter.post("/live/:liveContestId/end", authMiddleware, endLiveContest);

//participant 
liveContestRouter.get("/live/:liveContestId/current", authMiddleware, getCurrentQuestion);
liveContestRouter.get("/live/:liveContestId/status", authMiddleware, getLiveStatus);

//responses - via responseController
liveContestRouter.post("/live/:liveContestId/respond", authMiddleware, submitAnswer);
liveContestRouter.post("/live/:liveContestId/my-responses", authMiddleware, getMyResponse);


export default liveContestRouter;