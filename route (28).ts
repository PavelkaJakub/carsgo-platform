import {rateLimit,requestKey} from "@/lib/rateLimit";
import {prisma} from "@/lib/prisma";
import {createSession} from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request:Request){
  const rl=rateLimit(requestKey(request,"register"),Number(process.env.RATE_LIMIT_MAX||30),Number(process.env.RATE_LIMIT_WINDOW_MS||60000)); if(!rl.ok)return new Response("Too many requests",{status:429});
  const f=await request.formData();
  const email=String(f.get("email")||"").toLowerCase();
  const password=String(f.get("password")||"");
  if(password.length<8) return new Response("Heslo musí mít alespoň 8 znaků",{status:400});
  if(await prisma.user.findUnique({where:{email}})) return new Response("E-mail už existuje",{status:409});

  const user=await prisma.user.create({
    data:{
      email,
      passwordHash:await bcrypt.hash(password,10),
      firstName:String(f.get("firstName")||""),
      lastName:String(f.get("lastName")||""),
      role:"USER"
    }
  });
  await createSession({userId:user.id,email:user.email,role:user.role});
  return Response.redirect(new URL("/account",request.url),303);
}
