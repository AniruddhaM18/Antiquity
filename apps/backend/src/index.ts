import dotenv from "dotenv";
dotenv.config(); 

import { prisma } from "@repo/database";
import express from "express";
const app = express();

app.use(express.json());

app.post("/signup", async(req , res)=>{
    const {name, email} = req.body;
    if(!name && !email){
        return res.status(401).json({
            message: "invalid inputs"
        })
    }

    const user = await prisma.user.create({
        data: {
            name,
            email
        }
    })

    if(!user){
        return res.status(401).json({
            message: "unable to create"
        })
    }

    return res.status(201).json({
        message: "user created successfully",
        user
    })
})



app.listen(3000, ()=> {
    console.log("app listeing on port : 3000");
})