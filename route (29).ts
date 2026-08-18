import {rateLimit,requestKey} from "@/lib/rateLimit";
import {prisma} from "@/lib/prisma";
import {randomToken} from "@/lib/tokens";
import {sendEmail} from "@/lib/email";
export async function POST(request:Request){
  const rl=rateLimit(requestKey(request,"forgot"),Number(process.env.RATE_LIMIT_MAX||30),Number(process.env.RATE_LIMIT_WINDOW_MS||60000)); if(!rl.ok)return new Response("Too many requests",{status:429});
  const f=await request.formData();
  const email=String(f.get("email")||"").toLowerCase();
  const user=await prisma.user.findUnique({where:{email}});
  if(user){
    const token=randomToken();
    await prisma.passwordResetToken.deleteMany({where:{userId:user.id}});
    await prisma.passwordResetToken.create({data:{userId:user.id,token,expiresAt:new Date(Date.now()+1000*60*30)}});
    const url=new URL(`/reset-password?token=${token}`,request.url);
    await sendEmail({to:user.email,subject:"Obnova hesla Carsgo",html:`<h1>Obnova hesla</h1><p><a href="${url.toString()}">Nastavit nové heslo</a></p>`});
    return new Response(`<html><body style="font-family:Arial;padding:40px"><h1>Reset připraven</h1><a href="${url.toString()}">${url.toString()}</a></body></html>`,{headers:{"content-type":"text/html; charset=utf-8"}});
  }
  return new Response("Pokud účet existuje, reset odkaz byl vytvořen.");
}
