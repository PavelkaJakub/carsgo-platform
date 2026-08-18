import Nav from "@/components/Nav";
export default async function Forgot(){
  return <><Nav/><main className="login panel"><h1>Zapomenuté heslo</h1>
    <form className="form" action="/api/auth/forgot-password" method="post">
      <input name="email" type="email" placeholder="E-mail" required/>
      <button className="btn">Vytvořit reset odkaz</button>
    </form>
  </main></>
}
