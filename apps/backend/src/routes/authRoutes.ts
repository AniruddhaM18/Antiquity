import { Router } from "express";
import { getMe, signinController, signout, signupController } from "../controllers/authControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const authRouter: Router = Router();

authRouter.post("/signup", signupController);
authRouter.post("/signin", signinController);
authRouter.get("/me", authMiddleware, getMe);
authRouter.post("/signout", authMiddleware, signout);

export default authRouter;
