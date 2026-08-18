import {getSession} from "@/lib/auth";
import {prisma} from "@/lib/prisma";
export async function POST(request:Request){
  const s=await getSession(); if(!s) return new Response("Unauthorized",{status:401});
  const f=await request.formData();
  await prisma.user.update({
    where:{id:s.userId},
    data:{
      firstName:String(f.get("firstName")||""),
      lastName:String(f.get("lastName")||""),
      phone:String(f.get("phone")||"")
    }
  });
  return Response.redirect(new URL("/account/profile",request.url),303);
}
