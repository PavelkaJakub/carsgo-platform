import {prisma} from "@/lib/prisma";

export default async function Verify({searchParams}:{searchParams:Record<string,string|undefined>}){
  const token=searchParams.token||"";
  const row=await prisma.emailVerificationToken.findUnique({where:{token}});
  let ok=false;
  if(row && row.expiresAt>new Date()){
    await prisma.user.update({where:{id:row.userId},data:{emailVerifiedAt:new Date()}});
    await prisma.emailVerificationToken.delete({where:{id:row.id}});
    ok=true;
  }
  return <main className="login panel"><h1>{ok?"E-mail ověřen":"Odkaz není platný"}</h1><a className="btn" href="/account">Pokračovat</a></main>
}
