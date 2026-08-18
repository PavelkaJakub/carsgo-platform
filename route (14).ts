import {getSession} from "@/lib/auth";
import {prisma} from "@/lib/prisma";
export async function POST(request:Request){
  const s=await getSession(); if(!s) return Response.redirect(new URL("/login",request.url),303);
  const f=await request.formData();
  const query=String(f.get("query")||"");
  const filters={q:query};
  await prisma.savedSearch.create({data:{userId:s.userId,name:String(f.get("name")||"Moje hledání"),query,filters}});
  return Response.redirect(new URL("/account",request.url),303);
}
