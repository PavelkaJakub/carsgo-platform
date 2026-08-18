import {rateLimit,requestKey} from "@/lib/rateLimit";
import {prisma} from "@/lib/prisma";import {createSession} from "@/lib/auth";import {audit} from "@/lib/audit";import bcrypt from "bcryptjs";
export async function POST(request:Request){
  const rl=rateLimit(requestKey(request,"login"),Number(process.env.RATE_LIMIT_MAX||30),Number(process.env.RATE_LIMIT_WINDOW_MS||60000)); if(!rl.ok)return new Response("Too many requests",{status:429});
  const f=await request.formData(),email=String(f.get("email")||""),password=String(f.get("password")||"");
  const u=await prisma.user.findUnique({where:{email},include:{companyLinks:true}});if(!u?.passwordHash||!(await bcrypt.compare(password,u.passwordHash)))return new Response("Neplatné přihlášení",{status:401});
  await createSession({userId:u.id,email:u.email,role:u.role,companyId:u.companyLinks[0]?.companyId});await audit(u.id,"LOGIN","User",u.id);
  return Response.redirect(new URL(u.role==="ADMIN"?"/admin":"/partner",request.url),303);
}
