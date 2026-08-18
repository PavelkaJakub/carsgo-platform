import Nav from "@/components/Nav";
import {getSession} from "@/lib/auth";
import {prisma} from "@/lib/prisma";
import {redirect} from "next/navigation";

export default async function Account(){
  const s=await getSession(); if(!s) redirect("/login");
  const user=await prisma.user.findUnique({
    where:{id:s.userId},
    include:{
      favorites:{include:{vehicle:{include:{images:true,company:true}}}},
      savedSearches:{orderBy:{createdAt:"desc"}}
    }
  });
  return <><Nav/><main className="container section">
    <h1>Můj Carsgo</h1><p><a className="btn secondary" href="/account/profile">Profil</a> <a className="btn secondary" href="/my-listings">Moje inzeráty</a> <a className="btn secondary" href="/pricing">Tarify</a></p><form action="/api/auth/send-verification" method="post"><button className="btn secondary">Ověřit e-mail</button></form>
    <div className="grid">
      <section className="panel"><h2>Oblíbená auta</h2>
        {user?.favorites.length?user.favorites.map(f=><div key={f.id}><a href={`/vehicles/${f.vehicle.id}`}><b>{f.vehicle.brand} {f.vehicle.model}</b></a><div className="meta">{f.vehicle.price.toLocaleString("cs-CZ")} Kč</div></div>):<p className="meta">Zatím žádná.</p>}
      </section>
      <section className="panel"><h2>Uložená hledání</h2>
        {user?.savedSearches.length?user.savedSearches.map(x=><div key={x.id}><b>{x.name}</b><div className="meta">{x.query||"Klasické filtry"}</div></div>):<p className="meta">Zatím žádná.</p>}
      </section>
    </div>
  </main></>
}
