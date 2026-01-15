import { Request, Response } from "express";
import { signinSchema, signupSchema } from "../schema/authSchema";
import { prisma } from "@repo/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { success } from "zod";

const JWT_SECRET = process.env.JWT_SECRET!

export async function signupController(req:Request, res:Response){
    try{
          const signupData = signupSchema.safeParse(req.body);

    if(!signupData.success){
        return res.status(401).json({
            success: false,
            message: "Invalid inputs"
        })
    }

    const { name, email, password, role } = signupData.data

    const existing = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if(existing){
        return res.status(400).json({
            success: false,
            message: "User with this email already exists"
        })
    }


    const hashedPassword = await bcrypt.hash(password, 10); 

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: role
        }
    });

    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, {
        expiresIn: "7d"
    })

    res.status(201).json({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    })

    }catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}

//login
export async function signinController(req:Request, res:Response){
    try{
        const signinData = signinSchema.safeParse(req.body);
        if(!signinData.success){
            return res.status(401).json({
                success: false,
                message: "invalid inputs"
            })
        }

        const { email, password }  = signinData.data;

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User doesnt exist"
            })
        }

        const valid = await bcrypt.compare(password, user.password)
        if(!valid){
            return res.status(401).json({
                success: false,
                message: "Incorrect Password"
            })
        }

        const token = jwt.sign({userId: user.id, email: user.email, role: user.role}, JWT_SECRET, {
            expiresIn: "7d"
        })

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,

            }
        });
    }catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

// /me endpoint

export async function getMe(req:Request, res:Response){

    if(!req.user){
        return res.status(401).json({
            success: false,
            message: "unauthrized"
        })
    }

    const user = await prisma.user.findUnique({
        where: { id: req.user.id},
        select: {
            id: true,
            name: true,
            role: true,
        }
    })

    if(!user){
        return res.status(404).json({
            success: false,
            message: "user not found/ doesnt exists"
        })
    }

    res.status(201).json(user);
}

// logout endpoint - only because its considereed good practice
export async function signout(_req: Request, res:Response){
    //as jwt is stateless we dont really need this

    res.status(200).json({
        message: "Signed out successfully"
    })
}