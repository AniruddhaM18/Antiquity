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
  const setCurrentIndex = useLiveQuizStore((s) => s.setCurrentIndex);
  const lock = useLiveQuizStore((s) => s.lock);
  const answers = useLiveQuizStore((s) => s.answers);
  const locked = useLiveQuizStore((s) => s.locked);
  const contestFromStore = useLiveQuizStore((s) => s.contest);
  const currentIndex = useLiveQuizStore((s) => s.currentIndex);
  const setServerCurrentIndex = useLiveQuizStore((s) => s.setServerCurrentIndex);


  const [ready, setReady] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // Poll current question index (host moves questions)
  useEffect(() => {
    if (!ready || !liveContestId) return;

    function poll() {
      getCurrentQuestion(liveContestId)
        .then((data) => {
          if (typeof data.questionIndex === "number") {
            setCurrentIndex(data.questionIndex);
          }
          if (data.alreadyAnswered) {
            lock();
          }
        })
        .catch(() => {});
    }

    poll();
    pollRef.current = setInterval(poll, 2000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [liveContestId, ready, setCurrentIndex, lock]);

  // Wire Submit Answer to API: send current answer then lock
  const handleSubmitAnswer = useCallback(() => {
    if (!liveContestId) return;
    const q = useLiveQuizStore.getState().contest?.questions?.[useLiveQuizStore.getState().currentIndex];
    if (!q) return;
    const selected = useLiveQuizStore.getState().answers[q.id];
    if (selected === undefined) return;
    submitLiveAnswer(liveContestId, selected).catch(() => {}).finally(() => {
      useLiveQuizStore.getState().lock();
    });
  }, [liveContestId]);

  if (!ready) return null;

  return <NewLivePage onSubmitAnswer={handleSubmitAnswer} />;
}