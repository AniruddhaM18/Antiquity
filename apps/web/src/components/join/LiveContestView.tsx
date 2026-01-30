"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useLiveQuizStore } from "@/src/store/LiveQuestionStore";
import NewLivePage from "@/src/components/live/LivePage";
import { getCurrentQuestion, submitLiveAnswer } from "@/lib/contestApi";
import type { Contest } from "@/src/components/types";

type LiveContestViewProps = {
  contestId: string;
  liveContestId: string;
  contest: Contest;
};

export default function LiveContestView({ contestId, liveContestId, contest }: LiveContestViewProps) {
  const setContest = useLiveQuizStore((s) => s.setContest);
  const setLiveIds = useLiveQuizStore((s) => s.setLiveIds);
  const setServerCurrentIndex = useLiveQuizStore((s) => s.setServerCurrentIndex);

  const [ready, setReady] = useState(false);
  const [finished, setFinished] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const submittedQuestions = useRef<Set<string>>(new Set());

  // One-time: set store from contest
  useEffect(() => {
    const questions = (contest.questions || []).map((q: any) => ({
      id: q.id,
      question: q.question,
      options: Array.isArray(q.options) ? q.options : [],
    }));
    setContest({
      id: contest.id,
      title: contest.title,
      questions,
    });
    setLiveIds(liveContestId, contestId);
    setReady(true);
  }, [contest.id, contest.title, contest.questions, contestId, liveContestId, setContest, setLiveIds]);

  // Poll to check server state (optional - for sync purposes)
  useEffect(() => {
    if (!ready || !liveContestId) return;

    function poll() {
      getCurrentQuestion(liveContestId)
        .then((data) => {
          if (typeof data.questionIndex === "number") {
            setServerCurrentIndex(data.questionIndex);
          }
        })
        .catch(() => { });
    }

    poll();
    pollRef.current = setInterval(poll, 5000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [liveContestId, ready, setServerCurrentIndex]);

  // Submit individual question answer (called when user clicks Next)
  const handleSubmitAnswer = useCallback((questionId: string, optionIndex: number) => {
    if (!liveContestId) return;
    // Avoid submitting the same question twice
    if (submittedQuestions.current.has(questionId)) return;

    submittedQuestions.current.add(questionId);

    submitLiveAnswer(liveContestId, optionIndex)
      .then(() => {
        // Trigger leaderboard refresh after successful submission
        useLiveQuizStore.getState().triggerLeaderboardRefresh();
      })
      .catch(() => {
        // Remove from submitted set if failed, so user can retry
        submittedQuestions.current.delete(questionId);
      });
  }, [liveContestId]);

  // Finish quiz (called when user clicks Submit Quiz on last question)
  const handleFinishQuiz = useCallback(() => {
    setFinished(true);
  }, []);

  if (!ready) return null;

  // Show completion screen when finished
  if (finished) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Quiz Completed!</h1>
          <p className="text-neutral-400 mb-6">Thank you for participating. Check the leaderboard for your results.</p>
        </div>
      </div>
    );
  }

  return (
    <NewLivePage
      onSubmitAnswer={handleSubmitAnswer}
      onFinishQuiz={handleFinishQuiz}
    />
  );
}