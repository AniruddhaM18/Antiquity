import { api } from "@/lib/api";


export async function fetchMyContests() {
  const { data } = await api.get("/participants/my-contest");
  return data.contests;
}

export async function fetchUserContests() {
  const res = await api.get("/contests/getAll");
  return res.data.contests;
}