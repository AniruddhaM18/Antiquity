import { Request, Response, text } from "express";
import { addQuestionSSchema, createContestSchema } from "../schema/contestSchema.js";
import { prisma } from "@repo/database";

//create contest
export async function createContest(req: Request, res: Response) {
    try {
        const validaton = createContestSchema.safeParse(req.body);

        if (!validaton.success) {
            return res.status(400).json({})
        }
        const { title, description } = validaton.data;

        //create contest
        const contest = await prisma.contest.create({
            data: {
                title,
                description,
                createdBy: req.user!.id, //Admins userID
                members: {
                    create: {
                        userId: req.user!.id,
                        role: "host"
                    }
                }
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        return res.status(201).json({
            success: true,
            contest
        });
    } catch (err) {
        console.log("Error creating contest", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

// add questions to contest (Admin/Host only)
export async function addQuestion(req: Request, res: Response) {
    try {
        const { id: contestId } = req.params;

        const validaton = addQuestionSSchema.safeParse(req.body);

        if (!validaton.success) {
            return res.status(400).json({
                error: "Validation failed"
            })
        }

        const { questions } = validaton.data;

        //check if contest exists and admin user is the host

        const contest = await prisma.contest.findUnique({
            where: {
                id: contestId
            },
            include: {
                members: {
                    where: {
                        userId: req.user!.id,
                        role: "host"
                    }
                },
                live: true //check if already live
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
                message: "Only the contest host can add questions"
            })
        }

        if (contest.live) {
            return res.status(400).json({
                success: false,
                message: "cannot add questions to live contest"
            })
        }

        //validate correct answer indices
        for (const q of questions) {
            if (q.correct >= q.options.length) {
                return res.status(400).json({
                    success: false,
                    messgae: `Invalid correct answer index for question: ${q.text}`
                });
            }
        }

        //create questions in bulk
        const createdQuestions = await prisma.question.createMany({
            data: questions.map((q:any) => ({
                contestId,
                question: q.text,
                options: q.options,
                correct: q.correct,
                points: q.points || 10,
            }))
        });

        //fetch the created questions to return
        const allQuestions = await prisma.question.findMany({
            where: {
                contestId
            },
            orderBy: {
                id: "asc"
            }
        });

        return res.status(201).json({
            success: true,
            message: `${createdQuestions.count} questions added`,
            questions: addQuestion
        });
    } catch (err) {
        console.log("Error adding questions", err);
        return res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
};

//get contest details with questions contest/:id
export async function getContest(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const contest = await prisma.contest.findUnique({
            where: { id },
            include: {
                questions: {
                    orderBy: { id: "asc" },
                    // Don't expose correct answers to non-hosts
                    select: {
                        id: true,
                        question: true,
                        options: true,
                        points: true,
                        correct: false, // Hide by default
                    },
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                live: true,
            },
        });

        if (!contest) {
            return res.status(404).json({
                success: false,
                message: "Contest not found"
            })
        }

        //checking if user is host, if host - include answers
        const isHost = contest.members.some(
            (m) => m.userId === req.user?.id && m.role === "host"
        );

        if (isHost) {
            //fetch questions with correct answers for host
            const questionsNAnswers = await prisma.question.findMany({
                where: { contestId: id },
                orderBy: {
                    id: "asc"
                }
            });
            contest.questions = questionsNAnswers as any
        }

        return res.status(201).json({
            success: true,
            contest,
            isHost
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

//get all contest (with filters)
export async function getAllContests(req: Request, res: Response) {
    try {
        const { my, limit = "20", offset = "0" } = req.query;
        const where: any = {};

        //filter by user's contest
        if (my === "true" && req.user) {
            where.members = {
                some: {
                    userId: req.user!.id
                }
            }
        }

        const contests = await prisma.contest.findMany({
            where,
            take: parseInt(limit as string),
            skip: parseInt(offset as string),
            include: {
                _count: {
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
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        return res.status(201).json({
            success: true,
            contests,
        });
    } catch (err) {
        console.log("Error fetching contests", err);
        res.status(500).json({
            message: "internal server error"
        });
    }
}

//delete contest /contest/:id  -Admin/Host only route
export async function deleteContest(req: Request, res: Response) {
    try {
        const { id } = req.params;

        //check if user is host or admin
        const contest = await prisma.contest.findUnique({
            where: {
                id
            },
            include: {
                members: {
                    where: {
                        userId: req.user!.id,
                        role: "host"
                    }
                },
                live: true,
            }
        });

        if (!contest) {
            return res.status(404).json({
                success: false,
                message: "contest not found"
            })
        };

        if (contest.members.length === 0) {
            return res.status(400).json({
                success: false,
                message: "only host can delete contest"
            })
        }

        if (contest.live && !contest.live.endedAt) {
            return res.status(400).json({
                success: false,
                message: "cannot delete an ongoing contest"
            })
        }

        //deleting contest cascade will handle records
        await prisma.contest.delete({
            where: {
                id
            }
        });

        return res.status(201).json({
            success: true,
            message: "contest successfully deleted"
        })
    } catch (err) {
        console.log("Error deleting contest", err);
        res.status(500).json({
            message: "internal server error"
        });
    }
}