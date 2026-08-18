import {prisma} from "@/lib/prisma";
import type {MetadataRoute} from "next";
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
  const base=process.env.NEXT_PUBLIC_APP_URL||"http://localhost:3000";
  const vehicles=await prisma.vehicle.findMany({where:{status:"ACTIVE"},select:{id:true,updatedAt:true}});
  return [
    {url:base,lastModified:new Date(),priority:1},
    {url:`${base}/marketplace`,lastModified:new Date(),priority:.9},
    {url:`${base}/ai-search`,lastModified:new Date(),priority:.8},
    ...vehicles.map(v=>({url:`${base}/vehicles/${v.id}`,lastModified:v.updatedAt,priority:.7}))
  ];
}
