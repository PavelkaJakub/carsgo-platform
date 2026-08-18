import {prisma} from "@/lib/prisma";
import {verifyStripeSignature} from "@/lib/stripeWebhook";
export async function POST(request:Request){
  const raw=await request.text();
  const secret=process.env.STRIPE_WEBHOOK_SECRET;
  const signature=request.headers.get("stripe-signature")||"";
  if(!secret||!verifyStripeSignature(raw,signature,secret))return new Response("Invalid signature",{status:400});
  const event=JSON.parse(raw);
  if(!event?.id)return new Response("Bad event",{status:400});
  if(await prisma.paymentEvent.findUnique({where:{providerId:event.id}}))return new Response("ok");
  await prisma.paymentEvent.create({data:{provider:"stripe",providerId:event.id,eventType:event.type||"unknown",payload:event}});
  if(event.type==="checkout.session.completed"){
    const o=event.data?.object,userId=o?.metadata?.userId,plan=o?.metadata?.plan;
    if(userId&&plan)await prisma.subscription.create({data:{userId,plan,status:"ACTIVE"}});
    const promotionOrderId=o?.metadata?.promotionOrderId,vehicleId=o?.metadata?.vehicleId,days=Number(o?.metadata?.days||0);
    if(promotionOrderId&&vehicleId&&days){
      const startsAt=new Date(),endsAt=new Date(Date.now()+days*86400000);
      await prisma.promotionOrder.update({where:{id:promotionOrderId},data:{status:"PAID",startsAt,endsAt}});
      await prisma.vehicle.update({where:{id:vehicleId},data:{featuredUntil:endsAt}});
    }
  }
  return new Response("ok");
}
