import dotenv from "dotenv";
dotenv.config(); 
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";
import express from "express";
import contestRouter from "./routes/contestRoutes";
const app = express();

app.use(express.json());

//check route
app.post("/health", (req, res)=> {
    res.json({
        message: "Antiquity, ageing like a fine wine"
    })
})

//Auth - this time managed by betterauth
app.all("/api/auth/*", toNodeHandler(auth));
//contest rouetes bitch
app.use("/api/", contestRouter);


app.listen(3000, ()=> {
    console.log("app listeing on port : 3000");
})