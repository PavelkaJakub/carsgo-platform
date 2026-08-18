import {getSession} from "@/lib/auth";
import {prisma} from "@/lib/prisma";
import {createHash} from "crypto";

export async function POST(request:Request){
  const s=await getSession();
  const f=await request.formData();
  const ip=request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()||"";
  const ipHash=ip?createHash("sha256").update(ip).digest("hex"):null;
  await prisma.consentRecord.create({data:{
    userId:s?.userId||null,
    email:String(f.get("email")||"")||s?.email||null,
    type:String(f.get("type")||"TERMS"),
    version:String(f.get("version")||"2026-08"),
    granted:String(f.get("granted")||"true")==="true",
    ipHash,
    userAgent:request.headers.get("user-agent")
  }});
  return new Response(null,{status:204});
}
