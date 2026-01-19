import { prisma } from "@repo/database";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

// Common auth middleware - simplified without role
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeaders = req.headers.authorization;

  if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    })
  }

  const token = authHeaders.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string,
      email: string
    }
    console.log("decoded is", decoded);

    req.user = {
      id: decoded.userId,
      email: decoded.email
    }
    next();
  } catch {
    return res.status(401).json({
      message: "Invalid token"
    })
  }
}

// Resource-based authorization - check if user is contest host
export async function requireContestHost(req: Request, res: Response, next: NextFunction) {
  const contestId = req.params.contestId || req.body.contestId;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }

  try {
    const contest = await prisma.contest.findUnique({
      where: { id: contestId }
    });

    if (!contest) {
      return res.status(404).json({
        success: false,
        message: "Contest not found"
      });
    }

    if (contest.createdBy !== userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only contest creator can perform this action"
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error checking permissions"
    });
  }
}

// Check if user can participate (not the host of the contest)
export async function requireContestParticipant(req: Request, res: Response, next: NextFunction) {
  const contestId = req.params.contestId || req.body.contestId;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }

  try {
    const contest = await prisma.contest.findUnique({
      where: { id: contestId }
    });

    if (!contest) {
      return res.status(404).json({
        success: false,
        message: "Contest not found"
      });
    }

    if (contest.createdBy === userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Contest creator cannot participate in their own contest"
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error checking permissions"
    });
  }
}