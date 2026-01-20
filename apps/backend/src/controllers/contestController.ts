import { Request, Response } from "express"
import {
  addQuestionSSchema,
  createContestSchema,
} from "../schema/contestSchema.js"
import { prisma } from "@repo/database"

// helper to generate join code
function createJoinCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = ""
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// CREATE CONTEST
export async function createContest(req: Request, res: Response) {
  try {
    const validation = createContestSchema.safeParse(req.body)

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid inputs",
      })
    }

    const { title, description } = validation.data

    // generate unique join code
    let joinCode = createJoinCode()
    let attempts = 0

    while (attempts < 10) {
      const existing = await prisma.contest.findUnique({
        where: { joinCode },
      })

      if (!existing) break

      joinCode = createJoinCode()
      attempts++
    }

    if (attempts === 10) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate unique join code",
      })
    }

    const contest = await prisma.contest.create({
      data: {
        title,
        description,
        createdBy: req.user!.id,
        joinCode,
        members: {
          create: {
            userId: req.user!.id,
            role: "host",
          },
        },
      },
      include: {
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
      },
    })

    return res.status(201).json({
      success: true,
      contest,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

// add questions to contest (Save Quiz = Add Questions)
export async function addQuestion(req: Request, res: Response) {
  try {
    const { id: contestId } = req.params

    // validate payload
    const validation = addQuestionSSchema.safeParse(req.body)
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz data",
      })
    }

    const { questions } = validation.data

    // check contest exists
    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
      include: { live: true },
    })

    if (!contest) {
      return res.status(404).json({
        success: false,
        message: "Contest not found",
      })
    }

    // host only
    if (contest.createdBy !== req.user!.id) {
      return res.status(403).json({
        success: false,
        message: "Only the contest creator can save quiz",
      })
    }

    // cannot modify live contest
    if (contest.live) {
      return res.status(400).json({
        success: false,
        message: "Cannot save quiz for a live contest",
      })
    }

    // validate correct answer indices
    for (const q of questions) {
      if (q.correct < 0 || q.correct >= q.options.length) {
        return res.status(400).json({
          success: false,
          message: `Invalid correct answer index for question: ${q.text}`,
        })
      }
    }

    console.log(
  "SAVE QUIZ PAYLOAD 👉",
  JSON.stringify(questions, null, 2)
)


    // SAVE QUIZ = REPLACE QUESTIONS (ATOMIC)
   await prisma.$transaction([
  prisma.question.deleteMany({
    where: { contestId },
  }),
  prisma.question.createMany({
    data: questions.map((q) => ({
      contestId,
      question: q.text,
      options: q.options, // JSON ARRAY
      correct: q.correct,
      points: q.points ?? 10,
    })),
  }),
])


    return res.status(200).json({
      success: true,
      message: "Quiz saved successfully",
    })
  } catch (err) {
    console.error("Error saving quiz", err)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}


// GET SINGLE CONTEST
export async function getContest(req: Request, res: Response) {
  try {
    const { id } = req.params

    const contest = await prisma.contest.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { id: "asc" },
          select: {
            id: true,
            question: true,
            options: true,
            points: true,
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
    })

    if (!contest) {
      return res.status(404).json({
        success: false,
        message: "Contest not found",
      })
    }

    const isHost = contest.createdBy === req.user?.id

    if (isHost) {
      const fullQuestions = await prisma.question.findMany({
        where: { contestId: id },
        orderBy: { id: "asc" },
      })

      contest.questions = fullQuestions as any
    }

    return res.status(200).json({
      success: true,
      contest,
      isHost,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

// GET ALL CONTESTS
export async function getAllContests(req: Request, res: Response) {
  try {
    const { my, limit = "20", offset = "0" } = req.query
    const where: any = {}

    if (my === "true" && req.user) {
      where.members = {
        some: { userId: req.user.id },
      }
    }

    const contests = await prisma.contest.findMany({
      where,
      take: Number(limit),
      skip: Number(offset),
      include: {
        _count: {
          select: {
            questions: true,
            members: true,
          },
        },
        live: {
          select: {
            id: true,
            currentIndex: true,
            startedAt: true,
            endedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return res.status(200).json({
      success: true,
      contests,
    })
  } catch (err) {
    console.error("Error fetching contests", err)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

// DELETE CONTEST
export async function deleteContest(req: Request, res: Response) {
  try {
    const { id } = req.params

    const contest = await prisma.contest.findUnique({
      where: { id },
      include: { live: true },
    })

    if (!contest) {
      return res.status(404).json({
        success: false,
        message: "Contest not found",
      })
    }

    if (contest.createdBy !== req.user!.id) {
      return res.status(403).json({
        success: false,
        message: "Only contest creator can delete contest",
      })
    }

    if (contest.live && !contest.live.endedAt) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete an ongoing contest",
      })
    }

    await prisma.contest.delete({
      where: { id },
    })

    return res.status(200).json({
      success: true,
      message: "Contest successfully deleted",
    })
  } catch (err) {
    console.error("Error deleting contest", err)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}
