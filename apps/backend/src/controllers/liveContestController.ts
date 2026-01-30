import { prisma } from "@repo/database";
import { Request, Response } from "express";
import { liveContestStore } from "../redis/liveContestStore.js";

//start live contest - HOST ONLY
export async function startLiveContest(req: Request, res: Response) {
    try {
        const { id: contestId } = req.params;
        const userId = req.user!.id;

        // Check if already live in Redis
        if (await liveContestStore.isLive(contestId)) {
            return res.status(400).json({
                success: false,
                message: "Contest is already live"
            });
        }

        // ONE DB query to load everything needed
        const contest = await prisma.contest.findUnique({
            where: { id: contestId },
            include: {
                questions: {
                    orderBy: { id: "asc" }
                },
                members: {
                    select: { userId: true }
                }
            }
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
                message: "Only contest creator can start contest"
            });
        }

        if (contest.questions.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot start contest without questions"
            });
        }

        // Generate liveContestId
        const liveContestId = `live_${contestId}_${Date.now()}`;

        // Create state (convert Set to Array for Redis)
        const state = {
            liveContestId,
            contestId,
            currentIndex: 0,
            startedAt: new Date().toISOString(), // ISO string for Redis
            questions: contest.questions,
            createdBy: userId,
            memberIds: contest.members.map(m => m.userId), // Array instead of Set
            title: contest.title
        };

        // Store in Redis
        await liveContestStore.start(contestId, liveContestId, state);

        return res.status(201).json({
            success: true,
            message: "Contest successfully started",
            liveContest: {
                id: liveContestId,
                contestId,
                currentIndex: 0,
                startedAt: state.startedAt
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

//move to nextQuestion - HOST ONLY
export async function moveToNextQuestion(req: Request, res: Response) {
    try {
        const { liveContestId } = req.params;
        const userId = req.user!.id;

        // Get from Redis (no DB query!)
        const state = await liveContestStore.getByLiveId(liveContestId);

        if (!state) {
            return res.status(404).json({
                success: false,
                message: "Live contest not found"
            });
        }

        if (state.createdBy !== userId) {
            return res.status(403).json({
                success: false,
                message: "Only contest creator can control contest"
            });
        }

        if (state.endedAt) {
            return res.status(400).json({
                success: false,
                message: "Contest already ended"
            });
        }

        // Move to next question (atomic in Redis)
        const nextIndex = await liveContestStore.nextQuestion(state.contestId);

        if (nextIndex === null) {
            return res.status(400).json({
                success: false,
                message: "No more questions, end the contest"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Moved to next question",
            currentIndex: nextIndex
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

//end live contest - HOST ONLY
export async function endLiveContest(req: Request, res: Response) {
    try {
        const { liveContestId } = req.params;
        const userId = req.user!.id;

        // Get from Redis
        const state = await liveContestStore.getByLiveId(liveContestId);

        if (!state) {
            return res.status(404).json({
                success: false,
                message: "Live contest not found"
            });
        }

        if (state.createdBy !== userId) {
            return res.status(403).json({
                success: false,
                message: "Only contest creator can end contest"
            });
        }

        if (state.endedAt) {
            return res.status(400).json({
                success: false,
                message: "Contest already ended"
            });
        }

        // End in Redis
        const endedAt = await liveContestStore.end(state.contestId);

        if (!endedAt) {
            return res.status(500).json({
                success: false,
                message: "Failed to end contest"
            });
        }

        // Optional: Save final results to PostgreSQL for history
        // await saveContestResultsToDB(state, liveContestId);

        return res.status(200).json({
            success: true,
            message: "Contest successfully ended",
            endedAt
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

////////////////M340i ::::: BEST BMW EVERRRRR :::::
/////////////////////////FOR PARTICIPANTS ::::::::::::::

//get current question participant
//get current question participant
export async function getCurrentQuestion(req: Request, res: Response) {
      console.log("getCurrentQuestion called");
    console.log("User:", req.user);
    console.log("LiveContestId:", req.params.liveContestId);
    try {
        const { liveContestId } = req.params;
        const userId = req.user!.id;

        const state = await liveContestStore.getByLiveId(liveContestId);

        if (!state) {
            return res.status(404).json({
                success: false,
                message: "Live contest not found"
            });
        }

        // Prevent creator from participating
        if (state.createdBy === userId) {
            return res.status(403).json({
                success: false,
                message: "Contest creator cannot participate"
            });
        }

        // Check membership: Redis first, then DB (for users who joined after start)
        let isMember = state.memberIds.includes(userId);
        if (!isMember) {
            const member = await prisma.contestMember.findUnique({
                where: {
                    userId_contestId: { userId, contestId: state.contestId }
                }
            });
            isMember = !!member && member.role === "participant";
        }

        if (!isMember) {
            return res.status(403).json({
                success: false,
                message: "You are not a member of this contest"
            });
        }

        if (state.endedAt) {
            return res.status(400).json({
                success: false,
                message: "Contest has ended"
            });
        }

        const currentQuestion = state.questions[state.currentIndex];

        if (!currentQuestion) {
            return res.status(400).json({
                success: false,
                message: "No current question available"
            });
        }

        const existingResponse = await liveContestStore.getUserResponse(
            liveContestId,
            userId,
            state.currentIndex
        );

        const { correct, ...questionWithoutAnswer } = currentQuestion;

        return res.status(200).json({
            success: true,
            question: questionWithoutAnswer,
            questionIndex: state.currentIndex,
            totalQuestions: state.questions.length,
            alreadyAnswered: !!existingResponse
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

//get live contest status

export async function getLiveStatus(req: Request, res: Response) {
  try {
    const { liveContestId } = req.params;
    const state = await liveContestStore.getByLiveId(liveContestId);

    if (!state) {
      return res.status(404).json({
        success: false,
        message: "Contest not found",
      });
    }

    return res.status(200).json({
      success: true,
      liveContest: {
        id: state.liveContestId,
        contestId: state.contestId,
        currentIndex: state.currentIndex,
        totalQuestions: state.questions.length,
        startedAt: state.startedAt,
        endedAt: state.endedAt ?? null,
        isActive: !state.endedAt,
        totalParticipants: state.memberIds.length,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}