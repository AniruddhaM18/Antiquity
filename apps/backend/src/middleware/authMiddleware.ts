import { prisma } from "@repo/database";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { liveContestStore } from "../redis/liveContestStore.js";

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
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    // Support both regular contest routes (:id) and live contest routes (:liveContestId)
    let contestId = req.params.id || req.body?.contestId;

    // If we have a liveContestId instead, look up the contestId from Redis
    if (!contestId && req.params.liveContestId) {
      const state = await liveContestStore.getByLiveId(req.params.liveContestId);
      if (!state) {
        return res.status(404).json({
          success: false,
          message: "Live contest not found",
        });
      }
      contestId = state.contestId;
    }

    if (!contestId) {
      return res.status(400).json({
        success: false,
        message: "Contest ID missing",
      });
    }

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
    console.error("requireContestHost error:", error);
    return res.status(500).json({
      success: false,
      message: "Error checking permissions",
    });
  }
}

// Check if user can participate (not the host of the contest)
// Check if user can participate (not the host & must be a member)


// Replace requireContestParticipant with:
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
      message: "Unauthorized",
    });
  }

  try {
    const state = await liveContestStore.getByLiveId(liveContestId);

    if (!state) {
      return res.status(404).json({
        success: false,
        message: "Live contest not found",
      });
    }

    console.log("🔍 Checking membership for:", userId);
    console.log("   ContestId:", state.contestId);

    if (state.createdBy === userId) {
      return res.status(403).json({
        success: false,
        message: "Contest creator cannot participate",
      });
    }

    // Check Redis first
    let isMember = state.memberIds.includes(userId);
    console.log("   In Redis?", isMember);

    if (!isMember) {
      // Check database
      console.log("   Checking database...");
      const member = await prisma.contestMember.findUnique({
        where: {
          userId_contestId: {
            userId,
            contestId: state.contestId
          }
        }
      });
      console.log("DB result:", member);
      isMember = !!member && member.role === "participant";
      console.log("   Is valid participant?", isMember);
    }

    if (!isMember) {
      console.log("BLOCKED: Not a member");
      return res.status(403).json({
        success: false,
        message: "You are not a participant in this contest",
      });
    }

    console.log("ALLOWED");
    next();
  } catch (error) {
    console.error("requireContestParticipant error:", error);
    return res.status(500).json({
      success: false,
      message: "Error checking permissions",
    });
  }
}