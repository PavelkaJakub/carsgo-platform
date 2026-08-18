import Nav from "@/components/Nav";
import VehicleCard from "@/components/VehicleCard";
import {prisma} from "@/lib/prisma";
export default async function Marketplace({searchParams}:{searchParams:Record<string,string|undefined>}){
  const maxPrice=Number(searchParams.maxPrice||0)||undefined,maxMileage=Number(searchParams.maxMileage||0)||undefined;
  const vehicles=await prisma.vehicle.findMany({where:{
    status:"ACTIVE",
    ...(searchParams.brand?{brand:{contains:searchParams.brand,mode:"insensitive"}}:{}),
    ...(searchParams.model?{model:{contains:searchParams.model,mode:"insensitive"}}:{}),
    ...(searchParams.bodyType?{bodyType:searchParams.bodyType}:{}),
    ...(maxPrice?{price:{lte:maxPrice}}:{}),
    ...(maxMileage?{mileage:{lte:maxMileage}}:{})
  },include:{images:true,company:true},orderBy:{createdAt:"desc"}});
  return <><Nav/><main className="container section"><h1>Marketplace</h1><form className="search panel" method="get">
    <input name="brand" defaultValue={searchParams.brand} placeholder="Značka"/><input name="model" defaultValue={searchParams.model} placeholder="Model"/><input name="maxPrice" defaultValue={searchParams.maxPrice} type="number" placeholder="Max cena"/><input name="maxMileage" defaultValue={searchParams.maxMileage} type="number" placeholder="Max km"/><select name="bodyType" defaultValue={searchParams.bodyType||""}><option value="">Karoserie</option><option>SUV</option><option>Kombi</option><option>Sedan</option></select><button className="btn">Filtrovat</button>
  </form><p className="meta">Nalezeno {vehicles.length} vozidel</p><div className="cards">{vehicles.map(v=><VehicleCard key={v.id} vehicle={v}/>)}</div></main></>
}
