import Nav from "@/components/Nav";
import {getSession} from "@/lib/auth";
import {prisma} from "@/lib/prisma";
import {redirect} from "next/navigation";

export default async function Profile(){
  const s=await getSession(); if(!s) redirect("/login");
  const u=await prisma.user.findUnique({where:{id:s.userId}});
  if(!u) redirect("/login");

  return <><Nav/><main className="container section">
    <div className="panel">
      <h1>Můj profil</h1>
      <form className="form" action="/api/account/profile" method="post">
        <input name="firstName" defaultValue={u.firstName||""} placeholder="Jméno"/>
        <input name="lastName" defaultValue={u.lastName||""} placeholder="Příjmení"/>
        <input name="phone" defaultValue={u.phone||""} placeholder="Telefon"/>
        <input value={u.email} disabled/>
        <div className="meta">E-mail: {u.emailVerifiedAt ? "ověřen" : "neověřen"}</div>
        <button className="btn">Uložit profil</button>
      </form>
    </div>
  </main></>
}
