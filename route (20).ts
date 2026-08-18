import {requireAdmin} from "@/lib/auth";
import {prisma} from "@/lib/prisma";
import {audit} from "@/lib/audit";
export async function POST(request:Request,{params}:{params:{id:string}}){
  let s;try{s=await requireAdmin()}catch{return new Response("Unauthorized",{status:401})}
  const f=await request.formData(), action=String(f.get("action")||"");
  const status=action==="approve"?"ACTIVE":"REJECTED";
  await prisma.vehicle.update({where:{id:params.id},data:{status}});
  await audit(s.userId,action==="approve"?"LISTING_APPROVED":"LISTING_REJECTED","Vehicle",params.id);
  return Response.redirect(new URL("/admin/moderation",request.url),303);
}
