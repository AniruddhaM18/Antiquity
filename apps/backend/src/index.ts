import dotenv from "dotenv";
dotenv.config(); 
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import contestRouter from "./routes/contestRoutes";
import authRouter from "./routes/authRoutes";
import participantRouter from "./routes/participantRouter";
const app = express();
const PORT = process.env.PORT!;
//cors before routes

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, //allow cookies,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}))


app.use(express.json());
app.use(cookieParser());     

//check route
app.post("/health", (req, res)=> {
    res.json({
        message: "Antiquity, ageing like a fine wine"
    })
})

//auth routes
app.use("/api/auth", authRouter);
//contest rouetes bitch
app.use("/api/", contestRouter);
//participant routes
app.use("/api", participantRouter);


app.listen(PORT, ()=> {
    console.log(`app listeing on port : ${PORT}`);
})