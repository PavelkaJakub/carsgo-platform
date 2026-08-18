import Nav from "@/components/Nav";
import {prisma} from "@/lib/prisma";
import {notFound} from "next/navigation";
import {calculateCarsgoScore} from "@/lib/carsgoScore";
export default async function Detail({params}:{params:{id:string}}){
  const v=await prisma.vehicle.findUnique({where:{id:params.id},include:{images:true,company:true,priceHistory:{orderBy:{changedAt:"asc"}}}});
  if(!v)notFound();
  const score=await calculateCarsgoScore(prisma,v);
  return <><Nav/><main className="container section"><div className="detail">
    <section className="panel">{v.images[0]?<img src={v.images[0].url} alt="vehicle"/>:null}<h1>{v.brand} {v.model} {v.trim}</h1><div className="meta">{v.year} • {v.fuelType} • {v.transmission} • {v.mileage?.toLocaleString("cs-CZ")} km</div><div className="price">{v.price.toLocaleString("cs-CZ")} Kč</div><div className="panel" style={{marginTop:12}}><b>Carsgo Score {score.score}/100</b><div className="meta">Medián podobných aut: {score.marketMedian.toLocaleString("cs-CZ")} Kč • rozdíl {score.priceDiffPct}% • vzorek {score.peerCount} aut • jistota {score.confidence}</div></div><form action="/api/favorites" method="post"><input type="hidden" name="vehicleId" value={v.id}/><button className="btn secondary" style={{marginTop:10}}>♡ Uložit do oblíbených</button></form><h2>Historie ceny</h2>{v.priceHistory.map(p=><div className="meta" key={p.id}>{p.changedAt.toLocaleDateString("cs-CZ")} — {p.newPrice.toLocaleString("cs-CZ")} Kč</div>)}</section>
    <aside className="panel"><h2>Mám zájem</h2><p className="meta">{v.company?.name} {v.company?.verified?"• Ověřený partner":""}</p><form className="form" action="/api/leads" method="post"><input type="hidden" name="vehicleId" value={v.id}/><input type="hidden" name="companyId" value={v.companyId||""}/><input name="name" placeholder="Jméno" required/><input name="email" type="email" placeholder="E-mail" required/><input name="phone" placeholder="Telefon"/><textarea name="message" placeholder="Mám zájem o toto vozidlo."/><button className="btn">Odeslat poptávku</button></form></aside>
  </div></main></>
}
