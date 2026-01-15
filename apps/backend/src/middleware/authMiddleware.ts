import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET!;

//common auth middleware
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeaders = req.headers.authorization;

  if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    })
  }

  const token = authHeaders.split(" ")[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string,
      email: string,
      role: "admin" | "user"
    }

    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role
    }
    next()
  } catch {
    return res.status(401).json({
      message: "Invalid token"
    })
  }
};


export async function requireRole(role: "admin" | "user") {
  return(req:Request, res:Response, next: NextFunction) => {
    if(req.user?.role !== role) {
      return res.status(401).json({
        message: "forbidden"
      })
    }
    next()
  }
}