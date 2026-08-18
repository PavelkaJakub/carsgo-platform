import {clearSession,getSession} from "@/lib/auth";import {audit} from "@/lib/audit";
export async function POST(request:Request){const s=await getSession();if(s)await audit(s.userId,"LOGOUT","User",s.userId);clearSession();return Response.redirect(new URL("/",request.url),303)}
