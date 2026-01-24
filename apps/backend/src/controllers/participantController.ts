import { prisma } from "@repo/database";
import { Request, Response } from "express";
import { liveContestStore } from "../redis/liveContestStore.js";

export async function joinContest(req: Request, res: Response) {
    try {
        const { joinCode } = req.body;
        const userId = req.user!.id;

        if (!joinCode || typeof joinCode !== 'string') {
            return res.status(400).json({
                success: false,
                message: "Join code is required"
            });
        }

        //check if contest exists
        const contest = await prisma.contest.findUnique({
            where: {
                joinCode: joinCode.toUpperCase()
            },
            include: {
                live: true,
                members: {
                    where: { userId }
                }
            }
        });

        if (!contest) {
            return res.status(404).json({
                success: false,
                message: "Contest not found with this join code"
            })
        }

        // Prevent contest creator from joining as participant
        if (contest.createdBy === userId) {
            return res.status(403).json({
                success: false,
                message: "Contest creator cannot participate in their own contest"
            })
        }

        //check if already a member
        if (contest.members.length > 0) {
            return res.status(400).json({
                success: false,
                message: "You are already a member of this contest"
            })
        }

        //check if contest has ended
        if (contest.live?.endedAt) {
            return res.status(400).json({
                success: false,
                message: "Contest already ended"
            })
        }

        //Adding a user as a participant
        const member = await prisma.contestMember.create({
            data: {
                userId,
                contestId: contest.id,
                role: "participant"
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        console.log("ADDING CONTEST MEMBER", {
            userId,
            contestId: contest.id
        });


        return res.status(201).json({
            success: true,
            message: "successfully joined the contest",
            member,
            contest: {
                id: contest.id,
                title: contest.title,
                description: contest.description
            }
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

//participant leaving, (not when contest started or live)
export async function leaveContest(req: Request, res: Response) {
    try {
        const { id: contestId } = req.params;
        const userId = req.user!.id;

        const contest = await prisma.contest.findUnique({
            where: { id: contestId },
            include: {
                live: true,
                members: {
                    where: { userId }
                }
            }
        });

        if (!contest) {
            return res.status(404).json({
                success: false,
                message: "contest not found"
            })
        }

        if (contest.members.length === 0) {
            return res.status(400).json({
                success: false,
                message: "you are not a member of this contest"
            })
        }

        //check if user is the contest creator
        if (contest.createdBy === userId) {
            return res.status(400).json({
                success: false,
                message: "Contest creator cannot leave their own contest"
            })
        }

        //checking - contest live (not ended)
        if (contest.live && !contest.live.endedAt) {
            return res.status(400).json({
                success: false,
                message: "cannot leave from an ongoing contest"
            })
        }

        await prisma.contestMember.delete({
            where: {
                userId_contestId: { //@@unique in schema
                    userId,
                    contestId
                }
            }
        });

        return res.status(200).json({
            success: true,
            message: "darpok ho bhai aap, you left contest"
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

//get users contest participations

export async function getMyContest(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const { role, status } = req.query;

    const where: any = {
      OR: [{ createdBy: userId }, { members: { some: { userId } } }],
    };

    // filter by role if specified
    if (role && (role === "host" || role === "participant")) {
      if (role === "host") {
        where.AND = [{ createdBy: userId }];
        delete where.OR;
      } else {
        where.AND = [{ createdBy: { not: userId } }, { members: { some: { userId } } }];
        delete where.OR;
      }
    }

    // IMPORTANT:
    // If you move "live" to Redis, DB can't reliably filter by live status anymore.
    // So we will NOT apply your old DB-based status filters here.
    // We'll filter by Redis state after fetching.

    const contests = await prisma.contest.findMany({
      where,
      include: {
        _count: {
          select: { questions: true, members: true },
        },
        members: {
          where: { userId },
          select: { role: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const enriched = await Promise.all(
      contests.map(async (contest) => {
        const liveState = await liveContestStore.getByContestId(contest.id);

        const live = liveState
          ? {
              id: liveState.liveContestId,
              currentIndex: liveState.currentIndex,
              startedAt: liveState.startedAt,
              endedAt: liveState.endedAt ?? null,
              isActive: !liveState.endedAt,
            }
          : null;

        return {
          ...contest,
          isCreator: contest.createdBy === userId,
          userRole: contest.createdBy === userId ? "host" : contest.members[0]?.role || null,
          live,
        };
      })
    );

    // Apply status filter using Redis live state
    const filtered =
      status === "live"
        ? enriched.filter((c) => c.live?.isActive)
        : status === "ended"
          ? enriched.filter((c) => c.live && !c.live.isActive)
          : status === "upcoming"
            ? enriched.filter((c) => !c.live)
            : enriched;

    return res.status(200).json({
      success: true,
      contests: filtered,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
//get leaderboard for contest
export async function getLeaderboardController(req: Request, res: Response) {
    try {
        const { id: contestId } = req.params;

        // Check if contest exists (DB - source of truth)
        const contest = await prisma.contest.findUnique({
            where: { id: contestId },
            select: { id: true }
        });

        if (!contest) {
            return res.status(404).json({
                success: false,
                message: "Contest not found"
            });
        }

        // Get state from Redis
        const state = await liveContestStore.getByContestId(contestId);

        if (!state) {
            return res.status(404).json({
                success: false,
                message: "Contest is not live"
            });
        }

        // Get leaderboard from Redis (no DB queries!)
        const leaderboardData = await liveContestStore.getLeaderboard(state.liveContestId);

        // Fetch user details from DB (source of truth)
        const userIds = leaderboardData.map(entry => entry.userId);
        
        if (userIds.length === 0) {
            return res.status(200).json({
                success: true,
                leaderboard: []
            });
        }

        // Single DB query to get all users
        const users = await prisma.user.findMany({
            where: { id: { in: userIds } },
            select: {
                id: true,
                name: true,
                email: true
            }
        });

        const userMap = new Map(users.map(u => [u.id, u]));

        // Combine leaderboard with user data
        const leaderboard = leaderboardData.map(entry => ({
            user: userMap.get(entry.userId) || null,
            score: entry.score,
            correctAnswers: entry.correctAnswers
        }));

        return res.status(200).json({
            success: true,
            leaderboard
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}