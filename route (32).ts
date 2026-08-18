import {getSession} from "@/lib/auth";
import {prisma} from "@/lib/prisma";
import {randomToken} from "@/lib/tokens";
import {sendEmail} from "@/lib/email";

export async function POST(request:Request){
  const s=await getSession(); if(!s) return new Response("Unauthorized",{status:401});
  const token=randomToken();
  await prisma.emailVerificationToken.deleteMany({where:{userId:s.userId}});
  await prisma.emailVerificationToken.create({
    data:{userId:s.userId,token,expiresAt:new Date(Date.now()+1000*60*60*24)}
  });
  const url=new URL(`/verify-email?token=${token}`,request.url);
  await sendEmail({to:s.email,subject:"Ověřte svůj Carsgo účet",html:`<h1>Carsgo</h1><p>Pro ověření e-mailu klikněte na odkaz:</p><p><a href="${url.toString()}">Ověřit e-mail</a></p>`});
  return new Response(`<html><body style="font-family:Arial;padding:40px"><h1>Ověření připraveno</h1><p>Ve vývoji použij tento odkaz:</p><a href="${url.toString()}">${url.toString()}</a></body></html>`,{headers:{"content-type":"text/html; charset=utf-8"}});
}
