import Nav from "@/components/Nav";
export default async function Pricing(){
  return <><Nav/><main className="container section">
    <h1>Carsgo tarify</h1>
    <div className="cards">
      <div className="panel"><h2>Soukromník Free</h2><div className="price">0 Kč</div><p>1 aktivní inzerát.</p></div>
      <div className="panel"><h2>Soukromník Plus</h2><div className="price">199 Kč / měsíc</div><p>Až 5 aktivních inzerátů a premium funkce.</p>
        <form action="/api/billing/checkout" method="post"><input type="hidden" name="plan" value="PRIVATE_PLUS"/><button className="btn">Vybrat Plus</button></form>
      </div>
      <div className="panel"><h2>Business</h2><div className="price">2 990 Kč / měsíc</div><p>XML import, více uživatelů, leady a statistiky.</p>
        <form action="/api/billing/checkout" method="post"><input type="hidden" name="plan" value="BUSINESS"/><button className="btn">Vybrat Business</button></form>
      </div>
    </div>
  </main></>
}
