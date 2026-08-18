import {getSession} from "@/lib/auth";
import {prisma} from "@/lib/prisma";
export async function POST(request:Request){
  const s=await getSession(); if(!s) return new Response("Unauthorized",{status:401});
  const f=await request.formData(),vehicleId=String(f.get("vehicleId")||"");
  const vehicle=await prisma.vehicle.findUnique({where:{id:vehicleId}});
  if(!vehicle||vehicle.sourceType!==`PRIVATE:${s.userId}`) return new Response("Forbidden",{status:403});
  const days=Math.max(1,Math.min(30,Number(f.get("days")||7)));
  const amount=days*4900;
  await prisma.promotionOrder.create({data:{vehicleId,userId:s.userId,type:"FEATURED",amount,status:"PENDING"}});
  return Response.redirect(new URL("/my-listings",request.url),303);
}
