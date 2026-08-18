import Nav from "@/components/Nav";
import VehicleCard from "@/components/VehicleCard";
import {parseAiSearch,scoreVehicle} from "@/lib/aiSearch";
import {prisma} from "@/lib/prisma";

export default async function AiSearch({searchParams}:{searchParams:Record<string,string|undefined>}){
  const q=searchParams.q||"";
  const f=parseAiSearch(q);
  const vehicles=await prisma.vehicle.findMany({where:{status:"ACTIVE"},include:{images:true,company:true}});
  const ranked=vehicles
    .filter(v=>(!f.maxPrice||v.price<=f.maxPrice*1.15)&&(!f.maxMileage||(v.mileage||999999)<=f.maxMileage*1.2))
    .map(v=>({...v,carsgoScore:scoreVehicle(v,f)}))
    .sort((a,b)=>b.carsgoScore-a.carsgoScore);

  return <><Nav/><main className="container section">
    <h1>AI chytré vyhledávání</h1>
    <form className="panel form" method="get">
      <textarea name="q" rows={4} defaultValue={q} placeholder="Popište auto, které hledáte..."/>
      <button className="btn">Najít vhodná auta</button>
    </form>
    {q&&<div className="panel" style={{marginTop:16}}>
      <b>Carsgo pochopilo:</b>
      <div className="meta">Cena do: {f.maxPrice?.toLocaleString("cs-CZ")||"—"} Kč • nájezd do: {f.maxMileage?.toLocaleString("cs-CZ")||"—"} km • karoserie: {f.bodyType||"—"} • převodovka: {f.transmission||"—"}</div>
      <form action="/api/saved-searches" method="post" style={{marginTop:10}}>
        <input type="hidden" name="query" value={q}/>
        <input name="name" placeholder="Název hledání"/>
        <button className="btn secondary" style={{marginLeft:8}}>Uložit hledání</button>
      </form>
    </div>}
    <div className="cards" style={{marginTop:20}}>
      {ranked.map(v=><div key={v.id}><VehicleCard vehicle={v}/><div className="badge" style={{marginTop:6}}>Carsgo Score {v.carsgoScore}/100</div></div>)}
    </div>
  </main></>
}
