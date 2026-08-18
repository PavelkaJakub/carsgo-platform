import {prisma} from "@/lib/prisma";
import bcrypt from "bcryptjs";
export async function POST(request:Request){
  const f=await request.formData(),token=String(f.get("token")||""),password=String(f.get("password")||"");
  if(password.length<8) return new Response("Heslo je příliš krátké",{status:400});
  const row=await prisma.passwordResetToken.findUnique({where:{token}});
  if(!row||row.expiresAt<new Date()) return new Response("Token není platný",{status:400});
  await prisma.user.update({where:{id:row.userId},data:{passwordHash:await bcrypt.hash(password,10)}});
  await prisma.passwordResetToken.delete({where:{id:row.id}});
  return Response.redirect(new URL("/login",request.url),303);
}
