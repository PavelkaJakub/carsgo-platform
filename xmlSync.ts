import { XMLParser } from "fast-xml-parser";
import { prisma } from "@/lib/prisma";
const parser=new XMLParser({ignoreAttributes:false});
const arr=<T,>(v:T|T[]|undefined):T[]=>!v?[]:Array.isArray(v)?v:[v];

export async function syncXml(companyId:string,xml:string,importFeedId?:string){
  let created=0,updated=0,deactivated=0,errors=0;
  const parsed=parser.parse(xml);
  const items=arr(parsed?.vehicles?.vehicle);
  const seen:string[]=[];

  for(const item of items){
    try{
      const externalId=String(item.externalId||"");if(!externalId)throw new Error("missing externalId");
      seen.push(externalId);
      const existing=await prisma.vehicle.findUnique({where:{companyId_externalId:{companyId,externalId}}});
      const price=Number(item.price||0);
      const data={
        brand:String(item.brand||""),model:String(item.model||""),trim:item.trim?String(item.trim):null,
        bodyType:item.bodyType?String(item.bodyType):null,fuelType:item.fuelType?String(item.fuelType):null,
        transmission:item.transmission?String(item.transmission):null,year:item.year?Number(item.year):null,
        mileage:item.mileage?Number(item.mileage):null,price,status:"ACTIVE" as const,sourceType:"XML"
      };
      if(existing){
        if(existing.price!==price)await prisma.vehiclePriceHistory.create({data:{vehicleId:existing.id,oldPrice:existing.price,newPrice:price,source:"XML"}});
        await prisma.vehicle.update({where:{id:existing.id},data});updated++;
      }else{
        const v=await prisma.vehicle.create({data:{...data,companyId,externalId}});
        await prisma.vehiclePriceHistory.create({data:{vehicleId:v.id,oldPrice:null,newPrice:price,source:"XML"}});
        created++;
      }
    }catch{errors++}
  }

  if(seen.length){
    const r=await prisma.vehicle.updateMany({where:{companyId,sourceType:"XML",externalId:{notIn:seen},status:"ACTIVE"},data:{status:"INACTIVE"}});
    deactivated=r.count;
  }
  const log=await prisma.importLog.create({data:{companyId,importFeedId,status:errors?"PARTIAL":"SUCCESS",vehiclesCreated:created,vehiclesUpdated:updated,vehiclesDeactivated:deactivated,errorsCount:errors,message:"XML sync"}});
  return {created,updated,deactivated,errors,log};
}
