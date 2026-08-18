import Nav from "@/components/Nav";
import {requireAdmin} from "@/lib/auth";
import {prisma} from "@/lib/prisma";
import {redirect} from "next/navigation";
export default async function Moderation(){
  try{await requireAdmin()}catch{redirect("/login")}
  const vehicles=await prisma.vehicle.findMany({where:{status:"PENDING_REVIEW"},orderBy:{createdAt:"asc"}});
  return <><Nav/><main className="container section"><h1>Moderace inzerátů</h1>
    <table className="table"><thead><tr><th>Vozidlo</th><th>Cena</th><th>Zdroj</th><th>Akce</th></tr></thead><tbody>
      {vehicles.map(v=><tr key={v.id}><td>{v.brand} {v.model}</td><td>{v.price.toLocaleString("cs-CZ")} Kč</td><td>{v.sourceType}</td><td>
        <form action={`/api/admin/moderation/${v.id}`} method="post" style={{display:"inline"}}><input type="hidden" name="action" value="approve"/><button className="btn">Schválit</button></form>{" "}
        <form action={`/api/admin/moderation/${v.id}`} method="post" style={{display:"inline"}}><input type="hidden" name="action" value="reject"/><button className="btn secondary">Zamítnout</button></form>
      </td></tr>)}
    </tbody></table>
  </main></>
}
