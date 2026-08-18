import Nav from "@/components/Nav";
import {getSession} from "@/lib/auth";
import {prisma} from "@/lib/prisma";
import {redirect} from "next/navigation";

export default async function MyListings(){
  const s=await getSession(); if(!s) redirect("/login");
  const vehicles=await prisma.vehicle.findMany({where:{companyId:null,sourceType:`PRIVATE:${s.userId}`},orderBy:{createdAt:"desc"}});
  return <><Nav/><main className="container section">
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <h1>Moje inzeráty</h1><a className="btn" href="/my-listings/new">Přidat inzerát</a>
    </div>
    <table className="table"><thead><tr><th>Vozidlo</th><th>Cena</th><th>Stav</th></tr></thead><tbody>
      {vehicles.map(v=><tr key={v.id}><td>{v.brand} {v.model}</td><td>{v.price.toLocaleString("cs-CZ")} Kč</td><td>{v.status}</td></tr>)}
    </tbody></table>
  </main></>
}
