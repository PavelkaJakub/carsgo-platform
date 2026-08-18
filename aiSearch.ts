export type AiFilters = {
  maxPrice?: number;
  maxMileage?: number;
  bodyType?: string;
  transmission?: string;
  fuelTypes?: string[];
  priorities: string[];
};

export function parseAiSearch(input:string):AiFilters {
  const q=input.toLowerCase();
  const out:AiFilters={priorities:[]};

  const price=q.match(/(?:do|max(?:imálně)?|max\.?)[^0-9]{0,8}([0-9\s]{3,9})\s*(tis(?:íc)?|kč)?/);
  if(price){
    let n=Number(price[1].replace(/\s/g,""));
    if(price[2]?.startsWith("tis")) n*=1000;
    out.maxPrice=n;
  }

  const km=q.match(/(?:do|max(?:imálně)?|max\.?)[^0-9]{0,8}([0-9\s]{2,8})\s*km/);
  if(km) out.maxMileage=Number(km[1].replace(/\s/g,""));

  if(q.includes("suv")) out.bodyType="SUV";
  else if(q.includes("kombi")) out.bodyType="Kombi";
  else if(q.includes("sedan")) out.bodyType="Sedan";

  if(q.includes("automat")) out.transmission="Automat";
  if(q.includes("manuál")||q.includes("manual")) out.transmission="Manuál";

  const fuels:string[]=[];
  if(q.includes("hybrid")) fuels.push("Hybrid");
  if(q.includes("benzín")||q.includes("benzin")) fuels.push("Benzín");
  if(q.includes("diesel")||q.includes("naft")) fuels.push("Diesel");
  if(q.includes("elektro") && !q.includes("nechci elektro")) fuels.push("Elektro");
  if(fuels.length) out.fuelTypes=fuels;

  if(q.includes("rodinn")) out.priorities.push("family");
  if(q.includes("bezpeč")) out.priorities.push("safety");
  if(q.includes("spolehliv")) out.priorities.push("reliability");
  if(q.includes("servis")||q.includes("provozní náklady")) out.priorities.push("low_cost");

  return out;
}

export function scoreVehicle(v:any, f:AiFilters){
  let score=70;
  if(f.maxPrice && v.price<=f.maxPrice) score+=8;
  if(f.maxMileage && (v.mileage||999999)<=f.maxMileage) score+=6;
  if(f.bodyType && v.bodyType===f.bodyType) score+=6;
  if(f.transmission && v.transmission===f.transmission) score+=5;
  if(f.fuelTypes?.length && f.fuelTypes.includes(v.fuelType)) score+=5;
  if(f.priorities.includes("family") && ["SUV","Kombi"].includes(v.bodyType||"")) score+=4;
  if(f.priorities.includes("reliability") && ["Toyota","Škoda","Volkswagen"].includes(v.brand)) score+=3;
  if(f.priorities.includes("low_cost") && ["Hybrid","Benzín","Diesel"].includes(v.fuelType||"")) score+=2;
  return Math.min(100,score);
}
