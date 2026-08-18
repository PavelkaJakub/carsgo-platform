import Nav from "@/components/Nav";
import {requireAdmin} from "@/lib/auth";
import {prisma} from "@/lib/prisma";
import {redirect} from "next/navigation";
export default async function Users(){
  try{await requireAdmin()}catch{redirect("/login")}
  const users=await prisma.user.findMany({orderBy:{createdAt:"desc"},include:{_count:{select:{favorites:true,savedSearches:true}}}});
  return <><Nav/><main className="container section"><h1>Uživatelé</h1>
    <table className="table"><thead><tr><th>E-mail</th><th>Role</th><th>Ověřen</th><th>Oblíbené</th><th>Hledání</th></tr></thead><tbody>
      {users.map(u=><tr key={u.id}><td>{u.email}</td><td>{u.role}</td><td>{u.emailVerifiedAt?"ANO":"NE"}</td><td>{u._count.favorites}</td><td>{u._count.savedSearches}</td></tr>)}
    </tbody></table>
  </main></>
}
