import Nav from "@/components/Nav";
export default async function Register(){
  return <><Nav/><main className="login panel"><h1>Registrace</h1>
    <form className="form" action="/api/auth/register" method="post">
      <input name="firstName" placeholder="Jméno" required/>
      <input name="lastName" placeholder="Příjmení" required/>
      <input name="email" type="email" placeholder="E-mail" required/>
      <input name="password" type="password" placeholder="Heslo" required/>
      <button className="btn">Vytvořit účet</button>
    </form>
  </main></>
}
