import { prisma } from "@repo/database";
import { Request, Response } from "express";


//submit answer 
export async function submitAnswer(req:Request, res:Response){
    try{
        const { liveContestId } = req.params;
        const { selected } = req.body;
        const userId = req.user!.id;

        if(typeof selected !== "number" || selected < 0){
            return res.status(400).json({
                success: false,
                message: "invalid answer selection"
            })
        }

        const liveContest = await prisma.liveContest.findUnique({
            where: { id: liveContestId },
            include: {
                contest: {
                    include: {
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
                message: "live contest not found"
            })
        }

        //check if user is a member
        if(liveContest.contest.members.length === 0){
            return res.status(403).json({
                success: false,
                message: "forbidden, you aren't a member"
            })
        }

        //prevent contest creator from submitting answers
        if(liveContest.contest.createdBy === userId){
            return res.status(403).json({
                success: false,
                message: "forbidden, contest creator cannot participate in their own contest"
            })
        }

        if(liveContest.endedAt){
            return res.status(400).json({
                success: false,
                message: "contest already ended"
            })
        }

        const currentQuestion = liveContest.contest.questions[liveContest.currentIndex];

if(!currentQuestion){
    return res.status(400).json({
        success: false,
        message: "no current question"
    })
}

const options = currentQuestion.options;

if (!Array.isArray(options)) {
    return res.status(500).json({
        success: false,
        message: "Invalid question options format"
    });
}

// validate selected option
if (selected >= options.length) {
    return res.status(400).json({
        success: false,
        message: "Invalid option selected"
    })
}


        const isCorrect = selected === currentQuestion.correct;

        // Create or update response (using upsert to handle re-submissions)
        const response = await prisma.liveResponse.upsert({
            where: { 
                liveContestId_userId_questionIndex: {
                    liveContestId,
                    userId,
                    questionIndex: liveContest.currentIndex
                }
            },
            create: {
                liveContestId,
                userId,
                questionIndex: liveContest.currentIndex,
                selected,
                isCorrect
            },
            update: {
                selected,
                isCorrect,
                answeredAt: new Date()
            }
        });

        return res.status(201).json({
            success: true,
            message: "answer successfully submitted",
            isCorrect,
            response
        });
    }catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}

//get response for contest
export async function getMyResponse(req:Request, res:Response){
    try{
        const { liveContestId } = req.params;
        const userId = req.user!.id;

        const responses = await prisma.liveResponse.findMany({
            where:{ 
                liveContestId,
                userId
            },
            orderBy: {
                questionIndex: "asc"
            }
        });

        return res.status(200).json({
            success:true,
            responses
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}