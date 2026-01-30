// contestApi.ts - CORRECTED VERSION

import { api } from "@/lib/api";

export async function fetchMyContests() {
  const { data } = await api.get("/participants/my-contest");
  return data.contests;
}

export async function fetchUserContests() {
  const res = await api.get("/contests/getAll");
  return res.data.contests;
}

export async function fetchCreatedContests() {
  const { data } = await api.get("/contests/getAll?created=true");
  if (!data.success) throw new Error(data.message || "Failed to load contests");
  return data.contests;
}

export async function fetchContest(idOrCode: string) {
  const { data } = await api.get(`/contests/get/${encodeURIComponent(idOrCode)}`);
  if (!data.success) throw new Error(data.message || "Contest not found");
  return data;
}

export async function joinContestByCode(joinCode: string) {
  const { data } = await api.post("/participants/contest/join", {
    joinCode: joinCode.toUpperCase().trim()
  });
  if (!data.success) throw new Error(data.message || "failed to join, incorrect/invalid join code");
  return data;
}

export async function startLiveContest(contestId: string) {
  const { data } = await api.post(`/live/contest/${contestId}/live/start`);
  if (!data.success) throw new Error(data.message || "Failed to start");
  return data;
}

export async function getCurrentQuestion(liveContestId: string) {
  const { data } = await api.get(`/live/${liveContestId}/current`);
  if (!data.success) throw new Error(data.message || "Failed to load question");
  return data;
}

// ✅ FIXED
export async function submitLiveAnswer(liveContestId: string, selected: number) {
  const { data } = await api.post(`/live/${liveContestId}/respond`, { selected });
  if (!data.success) throw new Error(data.message || "Failed to submit");
  return data;
}

// ✅ FIXED
export async function fetchLeaderboard(contestId: string) {
  const { data } = await api.get(`/participants/contests/${contestId}/leaderboard`);
  if (!data.success) throw new Error(data.message || "Failed to load leaderboard");
  return data;
}

// ✅ FIXED
export async function moveToNextQuestion(liveContestId: string) {
  const { data } = await api.put(`/live/${liveContestId}/next`);
  if (!data.success) throw new Error(data.message || "Failed to move to next question");
  return data;
}

// ✅ FIXED
export async function endLiveContest(liveContestId: string) {
  const { data } = await api.post(`/live/${liveContestId}/end`);
  if (!data.success) throw new Error(data.message || "Failed to end contest");
  return data;
}