import { api } from "./api";
import { QuestionValue } from "@/src/store/useQuestionStore";

export const getContest = (id: string) => {
  return api.get(`/contests/get/${id}`);
};

export const saveQuestions = (
  contestId: string,
  questions: QuestionValue[]
) => {
  return api.post(`/contests/add/${contestId}/questions`, {
    questions: questions.map((q) => ({
      text: q.question,   // frontend → backend mapping
      options: q.options,
      correct: q.correct,
      points: q.points,
    })),
  });
};
