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
export async function requireContestHost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const contestId = req.params.id || req.body.contestId;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (!contestId) {
    return res.status(400).json({
      success: false,
      message: "Contest ID missing",
    });
  }

  try {
    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
    });

    if (!contest) {
      return res.status(404).json({
        success: false,
        message: "Contest not found",
      });
    }

    if (contest.createdBy !== userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only contest creator can perform this action",
      });
    }

    next();
  } catch (error) {
    console.error("requireContestHost error 👉", error);
    return res.status(500).json({
      success: false,
      message: "Error checking permissions",
    });
  }
}

// Check if user can participate (not the host of the contest)
// Check if user can participate (not the host & must be a member)
export async function requireContestParticipant(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { liveContestId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }

  if (!liveContestId) {
    return res.status(400).json({
      success: false,
      message: "Live contest ID missing"
    });
  }

  try {
    const liveContest = await prisma.liveContest.findUnique({
      where: { id: liveContestId },
      include: {
        contest: {
          include: {
            members: {
              where: { userId }
            }
          }
        }
      }
    });

    if (!liveContest) {
      return res.status(404).json({
        success: false,
        message: "Live contest not found"
      });
    }

    //host cannot participate
    if (liveContest.contest.createdBy === userId) {
      return res.status(403).json({
        success: false,
        message: "Contest creator cannot participate"
      });
    }

    // must be a member
    if (liveContest.contest.members.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You are not a participant in this contest"
      });
    }

    // allowed
    next();
  } catch (error) {
    console.error("requireContestParticipant error:", error);
    return res.status(500).json({
      success: false,
      message: "Error checking permissions"
    });
  }
}
