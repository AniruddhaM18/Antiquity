// contestRouter.ts
import { Router } from "express";
import { addQuestion, createContest, createContestWithQuestion, deleteContest, getAllContests, getContest } from "../controllers/contestController.js";
import { authMiddleware, requireContestHost } from "../middleware/authMiddleware.js";

const contestRouter : Router = Router();

//public but authenticated - all users
contestRouter.get("/getAll", authMiddleware, getAllContests); //view contests
contestRouter.get("/get/:id", authMiddleware, getContest); // view single contest 

//Contest creator/host only routes
// contestRouter.post("/create", authMiddleware, createContest); //any user can create contest
contestRouter.post("/create/:id", authMiddleware, createContestWithQuestion)


contestRouter.post("/add/:id/questions", authMiddleware, requireContestHost, addQuestion); //host adds questions
contestRouter.delete("/delete/:id", authMiddleware, requireContestHost, deleteContest); //host deletes contest


export default contestRouter;