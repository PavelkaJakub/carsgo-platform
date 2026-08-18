import Nav from "@/components/Nav";
import VehicleCard from "@/components/VehicleCard";
import {prisma} from "@/lib/prisma";
export default async function Home(){
  const vehicles=await prisma.vehicle.findMany({where:{status:"ACTIVE"},include:{images:true,company:true},take:6,orderBy:{createdAt:"desc"}});
  return <><Nav/><main className="container">
    <section className="hero"><h1>Vše kolem auta.<br/><span>Na jednom místě.</span></h1><p>Marketplace, leasing, financování a chytré hledání propojené s reálnými daty partnerů.</p></section>
    <section className="section"><form className="search panel" action="/marketplace" method="get">
      <input name="brand" placeholder="Značka"/><input name="model" placeholder="Model"/><input name="maxPrice" type="number" placeholder="Max cena"/><input name="maxMileage" type="number" placeholder="Max km"/><select name="bodyType"><option value="">Karoserie</option><option>SUV</option><option>Kombi</option><option>Sedan</option></select><button className="btn">Hledat</button>
    </form></section>
    <section className="section"><h2>Doporučené vozy</h2><div className="cards">{vehicles.map(v=><VehicleCard key={v.id} vehicle={v}/>)}</div></section>
  </main></>
}
