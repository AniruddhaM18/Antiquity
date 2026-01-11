import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/authMiddleware";
import { addQuestion, createContest, deleteContest, getAllContests, getContest } from "../controllers/contestController";

const contestRouter : Router = Router();

//public but authenticated - participants/users
contestRouter.get("/contests", requireAuth, getAllContests); //view contests
contestRouter.get("/contests/:id", requireAuth, getContest); // view single cotnest 

//Admin/ Host only routes
contestRouter.post("/contests", requireAuth, requireAdmin, createContest); //admmin create contest
contestRouter.post("/contests/:id/questions", requireAuth, addQuestion); //host adds questions
contestRouter.delete("/contests/:id", requireAuth, deleteContest); ///host delets contest

export default contestRouter;
