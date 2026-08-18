import Link from "next/link";
export default function VehicleCard({vehicle}:{vehicle:any}){
  const img=vehicle.images?.[0]?.url;
  return <Link href={`/vehicles/${vehicle.id}`} className="card">
    {img?<img src={img} alt={`${vehicle.brand} ${vehicle.model}`}/>:<div style={{height:190,display:"grid",placeItems:"center",background:"#e5e7eb"}}>Bez fotografie</div>}
    <div className="body"><b>{vehicle.brand} {vehicle.model} {vehicle.trim||""}</b><div className="meta">{vehicle.year} • {vehicle.fuelType} • {vehicle.transmission} • {vehicle.mileage?.toLocaleString("cs-CZ")} km</div><div className="price">{vehicle.price.toLocaleString("cs-CZ")} Kč</div>{vehicle.company?.verified&&<div className="badge">Ověřený partner</div>}</div>
  </Link>
}
