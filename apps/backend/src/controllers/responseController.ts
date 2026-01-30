import { prisma } from "@repo/database";
import { Request, Response } from "express";
import { liveContestStore } from "../redis/liveContestStore.js";

//submit answer 
export async function submitAnswer(req: Request, res: Response) {
    try {
        const { liveContestId } = req.params;
        const { selected } = req.body;
        const userId = req.user!.id;

        if (typeof selected !== "number" || selected < 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid answer selection"
            });
        }

        // Get from Redis (no DB query!)
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
                message: "Contest already ended"
            });
        }

        const currentQuestion = state.questions[state.currentIndex];

        if (!currentQuestion) {
            return res.status(400).json({
                success: false,
                message: "No current question"
            });
        }

        const options = currentQuestion.options as string[];

        if (!Array.isArray(options) || selected >= options.length) {
            return res.status(400).json({
                success: false,
                message: "Invalid option selected"
            });
        }

        // Calculate correctness
        const isCorrect = selected === currentQuestion.correct;

        // Store in Redis (no DB query!)
        await liveContestStore.submitAnswer(
            liveContestId,
            userId,
            state.currentIndex,
            selected,
            isCorrect
        );

        return res.status(201).json({
            success: true,
            message: "Answer successfully submitted",
            isCorrect
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
//get response for contest
export async function getMyResponse(req: Request, res: Response) {
    try {
        const { liveContestId } = req.params;
        const userId = req.user!.id;

        // Get from Redis (no DB query!)
        const responses = await liveContestStore.getUserResponses(liveContestId, userId);

        return res.status(200).json({
            success: true,
            responses: responses.map(r => ({
                questionIndex: r.questionIndex,
                selected: r.selected,
                isCorrect: r.isCorrect,
                answeredAt: r.answeredAt
            }))
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}