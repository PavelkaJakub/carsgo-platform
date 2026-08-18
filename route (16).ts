import {prisma} from "@/lib/prisma";
export async function GET(){
  try{await prisma.$queryRaw`SELECT 1`;return Response.json({status:"ok",database:"ok",version:"1.0.0"});}
  catch{return Response.json({status:"degraded",database:"error",version:"1.0.0"},{status:503});}
}
