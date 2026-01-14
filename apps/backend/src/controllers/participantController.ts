import { prisma } from "@repo/database";
import { Request, Response } from "express";
import { success } from "zod";
import { ContestRole } from "../../../../packages/database/generated/client";
import { ca, da, fa, tr } from "zod/locales";
import { warnOnce } from "@prisma/client/runtime/client";

export async function joinContest(req: Request, res: Response) {
    try {
        const { id: contestId } = req.params;
        const userId = req.user!.id

        //check if user exists
        const contest = await prisma.contest.findUnique({
            where: {
                id: contestId
            },
            include: {
                live: true,
                members: {
                    where: { userId }
                }
            }
        });
        if(!contest){
            return res.status(404).json({
                message: "contest not found"
            })
        }
        //check of already a member
        if(contest.members.length > 0) {
            return res.status(400).json({
                success: false,
                message: "You are already a member of this contest"
            })
        }

        //check if contest has ended
        if(contest.live?.endedAt){
            return res.status(400).json({
                success: false,
                message: "Contest already ended"
            })
        }

        //Adding a user as a participant
        const member = await prisma.contestMember.create({
            data: {
                userId,
                contestId,
                role: ContestRole.PARTICIPANT
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
        return res.status(201).json({
            success: true,
            message: "successfully joined the contest"
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            messaage: "Internal server error"
        })
    }
}

//participant leaving, (not when contest started or live)
export async function leaveContest(req:Request, res:Response){
    try{
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

        if(!contest){
            return res.status(404).json({
                success: false,
                message: "contest not found"
            })
        }

        if(contest.members.length === 0) {
            return res.status(400).json({
                success: false,
                message: "you are not a member of this contest"
            })
        }

        //check if user is host
        if(contest.members[0].role === "HOST"){
            return res.status(400).json({
                success: false,
                message: "HOST cannot leave the contest"
            })
        }

        //checking - conyest live (not ended)
        if(contest.live && !contest.live.endedAt){
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
    }catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            mesage: "Internal server error"
        })
    }
}

//get users contest participations
export async function getMyContest(req: Request, res:Response){
    try{
        const userId  = req.user!.id;
        const { role, status } = req.query;
        const where: any = {
            members: {
                some: { userId }
            }
        }

        //filter by role if specified
        if(role && (role === "HOST" || role === "PARTICIPANT")) {
            where.members.some.role = role;
        }

        //filter by status
        if(status === "live") {
            where.live = {
                isNot: null,
                endedAt: null
            }
        } else if (status === "ended") {
            where.live = {
                isNot: null,
                endedAt : { not: null }
            }
        } else if (status === "upcoming") {
            where.live = null
        }

        const contests = await prisma.contest.findMany({
            where,
            include:{
                _count:{
                    select: {
                        questions: true,
                        members: true
                    }
                },
                live: {
                    select: {
                        id: true,
                        currentIndex: true,
                        startedAt: true,
                        endedAt: true
                    }
                },
                members: {
                    where: { userId },
                    select: {
                        role: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return res.status(200).json({
            success: true,
            contests
        });
    }catch(err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

//get leaderboard for contest
export async function getLeaderboardController(req:Request, res:Response) {
    try{
        const {id: contestId } = req.params;

        const contest = await prisma.contest.findUnique({
            where: { id: contestId },
            include: {
                live: true
            }
        });

        if(!contest) {
            return res.status(404).json({
                success: false,
                message: "contest not found"
            })
        }

        if(!contest.live){
            return res.status(404).json({
                success: false,
                message: "contest not live yet"
            })
        }

        //calculate score from responses 
        const responses = await prisma.liveResponse.findMany({
            where: { liveContestId: contest.live.id },
            include: {
                liveContest: {
                    include: {
                        contest: {
                            include: {
                                questions: true
                            }
                        }
                    }
                }
            }
        });
        
        //group by user and calculate scoree
        const scoreMap = new Map<string, {userId: string, score: number, correctCount:number }>();
        
        for (const response of responses) {
            const question  = response.liveContest.contest.questions[response.questionIndex];
            const currentScore = scoreMap.get(response.userId) || {userId: response.userId, score: 0, correctCount: 0 };

            if(response.isCorrect){
                currentScore.score += question.points;
                currentScore.correctCount += 1;
            }

            scoreMap.set(response.userId, currentScore);
        }

        //get user details and create leaderboard
        const leaderboardData = await Promise.all(
            Array.from(scoreMap.entries()).map(async ([userId, data]) => {
                const user = await prisma.user.findUnique({
                    where: { id: userId },
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                });
                return {
                    user,
                    score: data.score,
                    correctAnswers: data.correctCount
                }
            }) 
        );
        //sort by score
        leaderboardData.sort((a, b) => b.score - a.score);
        return res.status(200).json({
            success: true,
            leaderboard: leaderboardData
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}
