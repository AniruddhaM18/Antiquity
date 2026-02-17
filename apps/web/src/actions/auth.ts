import { api } from "@/lib/api";

export async function signup(data: {
    name: string,
    email:string,
    password: string,
}){
    const res = await api.post("/auth/signup", data);
    return res.data;
}

export async function signin(data: {
    email:string,
    password:string
}){
    const res = await api.post("/auth/signin", data);
    return res.data;
}

export async function getMe(){
    const res = await api.get("/auth/me");
    return res.data;
}