export async function calculateCarsgoScore(prisma:any, vehicle:any){
  const peers=await prisma.vehicle.findMany({
    where:{
      status:"ACTIVE",
      brand:vehicle.brand,
      model:vehicle.model,
      id:{not:vehicle.id},
      ...(vehicle.year?{year:{gte:vehicle.year-2,lte:vehicle.year+2}}:{})
    },
    select:{price:true,mileage:true,year:true,priceHistory:{orderBy:{changedAt:"asc"}}}
  });

  const prices=peers.map((p:any)=>p.price).sort((a:number,b:number)=>a-b);
  const median=prices.length ? prices[Math.floor(prices.length/2)] : vehicle.price;
  const priceDiffPct=median?Math.round(((vehicle.price-median)/median)*100):0;

  let score=78;
  if(priceDiffPct<=-12) score+=14;
  else if(priceDiffPct<=-6) score+=9;
  else if(priceDiffPct<=0) score+=5;
  else if(priceDiffPct>=15) score-=14;
  else if(priceDiffPct>=7) score-=7;

  const mileage=vehicle.mileage||0;
  if(mileage<60000) score+=5;
  else if(mileage>180000) score-=7;

  const ownHistory=vehicle.priceHistory||[];
  if(ownHistory.length>=2 && ownHistory[ownHistory.length-1]?.newPrice < ownHistory[0]?.newPrice) score+=3;

  const confidence=peers.length>=10?"HIGH":peers.length>=4?"MEDIUM":"LOW";
  return {
    score:Math.max(0,Math.min(100,score)),
    marketMedian:median,
    priceDiffPct,
    peerCount:peers.length,
    confidence
  };
}
