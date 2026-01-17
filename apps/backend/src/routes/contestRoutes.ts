import { Router } from "express";
import { addQuestion, createContest, deleteContest, getAllContests, getContest } from "../controllers/contestController.js";
import { authMiddleware, requireRole } from "../middleware/authMiddleware.js";

const contestRouter : Router = Router();

//public but authenticated - participants/users
contestRouter.get("/contests", authMiddleware, getAllContests); //view contests
contestRouter.get("/contests/:id", authMiddleware, getContest); // view single cotnest 

//Admin/ Host only routes
contestRouter.post("/contests", authMiddleware, requireRole, createContest); //admmin create contest
contestRouter.post("/contests/:id/questions", authMiddleware, addQuestion); //host adds questions
contestRouter.delete("/contests/:id", authMiddleware, deleteContest); ///host delets contest

export default contestRouter;
