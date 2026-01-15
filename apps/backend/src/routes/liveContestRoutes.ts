import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { endLiveContest, getCurrentQuestion, getLiveStatus, moveToNextQuestion, startLiveContest } from "../controllers/liveContestController";

const liveContestRouter: Router = Router();

//host controls
liveContestRouter.post("/contest/:id/live/start", authMiddleware, startLiveContest);
liveContestRouter.put("/live/:liveContestId/next", authMiddleware, moveToNextQuestion);
liveContestRouter.post("/live/:liveContestId/end", authMiddleware, endLiveContest);

//participant 
liveContestRouter.get("/live/:liveContestId/current", authMiddleware, getCurrentQuestion);
liveContestRouter.get("/live/:liveContestId/status", authMiddleware, getLiveStatus);


export default liveContestRouter;