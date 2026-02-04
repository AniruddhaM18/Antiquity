"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLiveQuizStore } from "@/src/store/LiveQuestionStore";
import NewLivePage from "@/src/components/live/LivePage";
import Leaderboard from "@/src/components/live/Leaderboard";
import { getCurrentQuestion, submitLiveAnswer, fetchContest, fetchMyResponses } from "@/lib/contestApi";
import type { Contest } from "@/src/components/types";

type LiveContestViewProps = {
  contestId: string;
  liveContestId: string;
  contest: Contest;
};

export default function LiveContestView({ contestId, liveContestId, contest }: LiveContestViewProps) {
  const router = useRouter();
  const setContest = useLiveQuizStore((s) => s.setContest);
  const setLiveIds = useLiveQuizStore((s) => s.setLiveIds);
  const setServerCurrentIndex = useLiveQuizStore((s) => s.setServerCurrentIndex);
  const setCurrentIndex = useLiveQuizStore((s) => s.setCurrentIndex);
  const selectAnswer = useLiveQuizStore((s) => s.selectAnswer);

  const [ready, setReady] = useState(false);
  const [finished, setFinished] = useState(false);
  const [contestEnded, setContestEnded] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
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

  // Restore previous answers on re-entry
  useEffect(() => {
    if (!ready || !liveContestId) return;

    async function restoreResponses() {
      try {
        const data = await fetchMyResponses(liveContestId);
        const responses = data.responses || [];
        const questions = contest.questions || [];

        if (responses.length > 0) {
          // Mark submitted questions and restore answers in store
          responses.forEach((r: any) => {
            if (typeof r.questionIndex === "number" && r.questionIndex < questions.length) {
              const questionId = questions[r.questionIndex]?.id;
              if (questionId) {
                submittedQuestions.current.add(questionId);
                selectAnswer(questionId, r.selected);
              }
            }
          });

          // Find the first unanswered question
          const answeredIndices = new Set(responses.map((r: any) => r.questionIndex));
          let nextIndex = 0;
          for (let i = 0; i < questions.length; i++) {
            if (!answeredIndices.has(i)) {
              nextIndex = i;
              break;
            }
            nextIndex = i + 1; // All answered, go to last + 1 (triggers finished)
          }

          // If all questions answered, mark as finished
          if (nextIndex >= questions.length) {
            setFinished(true);
          } else {
            setCurrentIndex(nextIndex);
          }
        }
      } catch {
        // Ignore errors - user hasn't answered anything yet
      }
    }

    restoreResponses();
  }, [ready, liveContestId, contest.questions, selectAnswer, setCurrentIndex]);

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

  // Poll to check if contest has ended
  useEffect(() => {
    if (!ready || !contestId) return;

    async function checkEnded() {
      try {
        const data = await fetchContest(contestId);
        if (data.contest?.live?.endedAt) {
          setContestEnded(true);
          // Clear all polling
          if (pollRef.current) clearInterval(pollRef.current);
          if (endPollRef.current) clearInterval(endPollRef.current);
        }
      } catch {
        // Ignore errors
      }
    }

    checkEnded();
    endPollRef.current = setInterval(checkEnded, 3000);
    return () => {
      if (endPollRef.current) clearInterval(endPollRef.current);
    };
  }, [contestId, ready]);

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

  // Show leaderboard when host ends the contest
  if (contestEnded) {
    return (
      <div className="h-full bg-neutral-950 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            Contest Ended
          </h1>
          <p className="text-neutral-400 text-center mb-6">
            {contest.title}
          </p>
          <div className="h-[400px] mb-6">
            <Leaderboard />
          </div>
          <button
            onClick={() => router.push("/home")}
            className="w-full px-4 py-3 rounded bg-orange-600 hover:bg-orange-500 text-white font-medium transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Show completion screen when finished (user submitted last question)
  if (finished) {
    return (
      <div className="h-full bg-neutral-950 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <h1 className="text-3xl font-bold text-white text-center mb-4">Quiz Completed!</h1>
          <p className="text-neutral-400 text-center mb-6">
            Thank you for participating. Waiting for host to end the contest...
          </p>
          <div className="h-[400px] mb-6">
            <Leaderboard />
          </div>
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