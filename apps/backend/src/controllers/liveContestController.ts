import { prisma } from "@repo/database";
import { Request, Response } from "express";



//start live contest - HOST OONLY
export async function startLiveContest(req: Request, res: Response) {
    try {
        const { id: contestId } = req.params;
        const userId = req.user!.id;

        //check if user is host
        const contest = await prisma.contest.findUnique({
            where: { id: contestId },
            include: {
                members: {
                    where: {
                        userId,
                        role: "host"
                    }
                },
                questions: true,
                live: true
            }
        });

        if (!contest) {
            return res.status(404).json({
                success: false,
                message: "contest not found"
            })
        }

        if (contest.members.length === 0) {
            return res.status(403).json({
                success: false,
                message: "only host can start contest"
            })
        }

        if (contest.questions.length === 0) {
            return res.status(400).json({
                success: false,
                message: "cannot start contest without questions"
            })
        }

        if (contest.live) {
            return res.status(400).json({
                success: false,
                message: "contest is already live"
            })
        }

        const liveContest = await prisma.liveContest.create({
            data: {
                contestId,
                currentIndex: 0
            }
        })

        return res.status(201).json({
            success: true,
            message: "contest already started",
            liveContest
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "contest coulden't go live/ Iternal server error"
        })
    }
}

//move to nextQuestion - HOSTONLY
export async function moveToNextQuestion(req: Request, res: Response) {

    try {
        const { liveContestId } = req.params;
        const userId = req.user!.id;

        const liveContest = await prisma.liveContest.findUnique({
            where: {
                id: liveContestId
            },
            include: {
                contest: {
                    include: {
                        questions: true,
                        members: {
                            where: {
                                userId,
                                role: "host"
                            }
                        }
                    }
                }
            }
        });

        if (!liveContest) {
            return res.status(404).json({
                success: false,
                message: "contest not found"
            })
        }

        if (liveContest.contest.members.length === 0) {
            return res.status(403).json({
                success: false,
                message: "only host can control contest"
            })
        }

        if (liveContest.endedAt) {
            return res.status(400).json({
                success: false,
                message: "contest alreday ended"
            })
        }

        const nextIndex = liveContest.currentIndex + 1;

        if (nextIndex >= liveContest.contest.questions.length) {
            return res.status(400).json({
                success: false,
                message: "questions finished, End the contest"
            })
        }

        //update index move to next question
        const updated = await prisma.liveContest.update({
            where: { id: liveContestId },
            data: {
                currentIndex: nextIndex
            }
        });

        return res.status(200).json({
            success: true,
            message: "moved to next question",
            currentIndex: updated.currentIndex
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal server error, coulde'nt update"
        })
    }
}

//end live contest - HOST onlu
export async function endLiveContest(req: Request, res: Response) {
    try {
        const { liveContestId } = req.params;
        const userId = req.user!.id;

        const liveContest = await prisma.liveContest.findUnique({
            where: { id: liveContestId },
            include: {
                contest: {
                    include: {
                        members: {
                            where: {
                                userId,
                                role: "host"
                            }
                        }
                    }
                }
            }
        });

        if (!liveContest) {
            return res.status(404).json({
                success: false,
                message: "Live contest not found"
            })
        }

        if (liveContest.contest.members.length === 0) {
            return res.status(403).json({
                success: false,
                message: "Fobidden/ only host can end contest"
            })
        }

        if (liveContest.endedAt) {
            return res.status(400).json({
                success: false,
                message: "Contest already ended"
            })
        }

        //lets fuckin end the contest now 00000HHHHHHHHHHHYEAHHHHHHHHHHHHHHH
        const ended = await prisma.liveContest.update({
            where: {
                id: liveContestId
            },
            data: {
                endedAt: new Date()
            }
        });

        res.status(200).json({
            success: true,
            message: "contest successfully ended",
            endedAt: ended.endedAt
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal server error unable to end contest"
        })
    }
}

////////////////M340i ::::: BEST BMW EVERRRRR :::::
/////////////////////////FOR PARTICIPANTS ::::::::::::::

//get current question participant
export async function getCurrentQuestion(req:Request, res:Response){
    try{
        const { liveContestId } = req.params;
        const userId = req.user!.id;

        const liveContest = await prisma.liveContest.findUnique({
            where: { id: liveContestId },
            include: {
                contest: {
                    include:{
                        questions: {
                            orderBy: { id: "asc" }
                        },
                        members: {
                            where: { userId }
                        }
                    }
                }
            }
        });

        if(!liveContest){
            return res.status(404).json({
                success: false,
                message: "contest not found"
            })
        }

        if(liveContest.contest.members.length === 0) {
            return res.status(403).json({
                success: false,
                message: "forbiddden/ you are not a member to this contest"
            })
        }

        if(liveContest.endedAt){
            return res.status(400).json({
                success: false,
                message: "contest has ended"
            })
        }

        const currentQuestion = liveContest.contest.questions[liveContest.currentIndex];
        
        if(!currentQuestion){
            return res.status(400).json({
                success: false,
                message: "no current queston available"
            })
        }

        //check if user answered this already
        const existingResponse = await prisma.liveResponse.findUnique({
            where: {
                liveContestId_userId_questionIndex: {
                    liveContestId,
                    userId,
                    questionIndex: liveContest.currentIndex
                }
            }
        })

        //do not send correct answers to users
        const {correct, ...questionWithoutAnswer } = currentQuestion;
        return res.status(200).json({
            success: true,
            question: questionWithoutAnswer,
            questionIndex: liveContest.currentIndex,
            totalQuestions: liveContest.contest.questions.length,
            alreadyAnswered: !!existingResponse
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internel server error"
        })
    }
}

//get live contest statussssssss
export async function getLiveStatus(req:Request, res:Response){
    try{
        const { id: liveContestId } = req.params;
        const userId = req.user!.id;

        const liveContest = await prisma.liveContest.findUnique({
            where: { id: liveContestId }, 
            include: {
                contest: {
                    include: {
                        questions: true,
                        _count: {
                            select: { members: true }
                        }
                    }
                },
                _count:{
                    select: {
                        responses: true
                    }
                }
            }
        });
        if(!liveContest){
            return res.status(404).json({
                success: false,
                message: "contest not found"
            })
        }

        return res.status(201).json({
            success: true,
            liveContest: {
                id: liveContest.id,
                contestId: liveContest.contestId,
                currentIndex: liveContest.currentIndex,
                totalQuestions: liveContest.contest.questions.length,
                startedAt: liveContest.startedAt,
                endedAt: liveContest.endedAt,
                isActive: !liveContest.endedAt,
                totalParticipants: liveContest.contest._count.members,
                totatResponse: liveContest._count.responses
            }
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "internal Server error"
        })
    }
}