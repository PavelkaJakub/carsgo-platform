import {getSession} from "@/lib/auth";
import {prisma} from "@/lib/prisma";
export async function POST(request:Request){
  const s=await getSession(); if(!s) return Response.redirect(new URL("/login",request.url),303);

  const active=await prisma.vehicle.count({where:{companyId:null,sourceType:`PRIVATE:${s.userId}`,status:"ACTIVE"}});
  const sub=await prisma.subscription.findFirst({where:{userId:s.userId,status:"ACTIVE"},orderBy:{createdAt:"desc"}});
  const limit=sub?.plan==="PRIVATE_PLUS"?5:1;
  if(active>=limit) return new Response(`Limit aktivních inzerátů je ${limit}.`,{status:403});

  const f=await request.formData();
  const v=await prisma.vehicle.create({data:{
    companyId:null,
    brand:String(f.get("brand")||""),
    model:String(f.get("model")||""),
    trim:String(f.get("trim")||""),
    year:Number(f.get("year")||0)||null,
    mileage:Number(f.get("mileage")||0)||null,
    price:Number(f.get("price")||0),
    fuelType:String(f.get("fuelType")||""),
    transmission:String(f.get("transmission")||""),
    description:String(f.get("description")||""),
    status:"PENDING_REVIEW",
    sourceType:`PRIVATE:${s.userId}`
  }});
  await prisma.vehiclePriceHistory.create({data:{vehicleId:v.id,oldPrice:null,newPrice:v.price,source:"PRIVATE"}});
  return Response.redirect(new URL("/my-listings",request.url),303);
}
