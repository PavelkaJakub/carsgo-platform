import Nav from "@/components/Nav";
export default async function Reset({searchParams}:{searchParams:Record<string,string|undefined>}){
  return <><Nav/><main className="login panel"><h1>Nové heslo</h1>
    <form className="form" action="/api/auth/reset-password" method="post">
      <input type="hidden" name="token" value={searchParams.token||""}/>
      <input name="password" type="password" placeholder="Nové heslo" required/>
      <button className="btn">Nastavit heslo</button>
    </form>
  </main></>
}
