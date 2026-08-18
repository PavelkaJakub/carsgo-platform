import {getSession} from "@/lib/auth";
export default async function Nav(){
  const s=await getSession();
  return <header className="nav"><div className="container nav-inner">
    <a className="logo" href="/">CARS<span>GO</span></a>
    <nav className="nav-links"><a href="/marketplace">Marketplace</a><a href="/ai-search">AI hledání</a><a href="/partner">Partner</a>{s?.role==="ADMIN"&&<a href="/admin">Admin</a>}</nav>
    {s?<><a href="/account" className="btn secondary">Můj účet</a><form action="/api/auth/logout" method="post"><button className="btn secondary">Odhlásit</button></form></>:<><a className="btn secondary" href="/register">Registrace</a><a className="btn" href="/login">Přihlásit</a></>}
  </div></header>
}
