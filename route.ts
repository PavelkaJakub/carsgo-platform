import {rateLimit,requestKey} from "@/lib/rateLimit";
import {prisma} from "@/lib/prisma";
import {audit} from "@/lib/audit";
import {getSession} from "@/lib/auth";
import {z} from "zod";
const S=z.object({vehicleId:z.string(),companyId:z.string().optional(),name:z.string().min(2),email:z.string().email(),phone:z.string().optional(),message:z.string().optional()});
export async function POST(request:Request){
  const rl=rateLimit(requestKey(request,"lead"),Number(process.env.RATE_LIMIT_MAX||30),Number(process.env.RATE_LIMIT_WINDOW_MS||60000)); if(!rl.ok)return new Response("Too many requests",{status:429});
  const f=await request.formData();const raw=Object.fromEntries([...f.entries()].map(([k,v])=>[k,String(v)]));const p=S.safeParse(raw);
  if(!p.success)return new Response("Neplatná data",{status:400});
  const lead=await prisma.lead.create({data:{...p.data,companyId:p.data.companyId||null,type:"VEHICLE"}});
  const s=await getSession();await audit(s?.userId,"LEAD_CREATED","Lead",lead.id,{vehicleId:p.data.vehicleId});
  return new Response(`<html><body style="font-family:Arial;padding:40px"><h1>Děkujeme</h1><p>Poptávka byla odeslána.</p><a href="/">Zpět</a></body></html>`,{headers:{"content-type":"text/html; charset=utf-8"}});
}
