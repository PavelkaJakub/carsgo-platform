import {getSession} from "@/lib/auth";
import {prisma} from "@/lib/prisma";
export async function POST(request:Request){
  const s=await getSession(); if(!s) return Response.redirect(new URL("/login",request.url),303);
  const f=await request.formData(), vehicleId=String(f.get("vehicleId")||"");
  await prisma.favorite.upsert({
    where:{userId_vehicleId:{userId:s.userId,vehicleId}},
    update:{},
    create:{userId:s.userId,vehicleId}
  });
  return Response.redirect(new URL(`/vehicles/${vehicleId}`,request.url),303);
}
