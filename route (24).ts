import {assertAllowedRemoteUrl} from "@/lib/safeRemote";
import {prisma} from "@/lib/prisma";import {syncXml} from "@/lib/xmlSync";
export async function POST(request:Request){
  const auth=request.headers.get("authorization");if(auth!==`Bearer ${process.env.CRON_SECRET}`)return new Response("Unauthorized",{status:401});
  const feeds=await prisma.importFeed.findMany({where:{status:"ACTIVE",url:{not:null}}});
  const results=[];
  for(const f of feeds){try{const r=await fetch(assertAllowedRemoteUrl(f.url!).toString(),{cache:"no-store",redirect:"error"});if(!r.ok)throw new Error(`HTTP ${r.status}`);const result=await syncXml(f.companyId,await r.text(),f.id);await prisma.importFeed.update({where:{id:f.id},data:{lastRunAt:new Date(),lastSuccessAt:new Date()}});results.push({feedId:f.id,ok:true,...result})}catch(e:any){results.push({feedId:f.id,ok:false,error:e?.message})}}
  return Response.json({ok:true,count:feeds.length,results});
}
