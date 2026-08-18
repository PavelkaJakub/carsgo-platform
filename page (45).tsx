import Nav from "@/components/Nav";
export default async function NewListing(){
  return <><Nav/><main className="container section"><div className="panel"><h1>Nový soukromý inzerát</h1>
    <form className="form" action="/api/private-listings" method="post">
      <div className="grid">
        <input name="brand" placeholder="Značka" required/>
        <input name="model" placeholder="Model" required/>
        <input name="trim" placeholder="Verze"/>
        <input name="year" type="number" placeholder="Rok"/>
        <input name="mileage" type="number" placeholder="Nájezd"/>
        <input name="price" type="number" placeholder="Cena" required/>
        <input name="fuelType" placeholder="Palivo"/>
        <input name="transmission" placeholder="Převodovka"/>
      </div>
      <textarea name="description" placeholder="Popis vozidla"/>
      <button className="btn">Publikovat</button>
    </form>
  </div></main></>
}
