import {getSession} from "@/lib/auth";
import {prisma} from "@/lib/prisma";
export async function POST(request:Request){
 const s=await getSession();if(!s)return new Response("Unauthorized",{status:401});
 if(!process.env.STRIPE_SECRET_KEY)return new Response("Stripe není nakonfigurován",{status:501});
 const f=await request.formData(),vehicleId=String(f.get("vehicleId")||""),days=Math.max(1,Math.min(30,Number(f.get("days")||7)));
 const v=await prisma.vehicle.findUnique({where:{id:vehicleId}});
 if(!v||v.sourceType!==`PRIVATE:${s.userId}`)return new Response("Forbidden",{status:403});
 const order=await prisma.promotionOrder.create({data:{vehicleId,userId:s.userId,type:"FEATURED",amount:days*4900,status:"PENDING"}});
 const base=process.env.APP_URL||new URL(request.url).origin;
 const body=new URLSearchParams();
 body.set("mode","payment");body.set("success_url",`${base}/my-listings?promotion=success`);body.set("cancel_url",`${base}/my-listings?promotion=cancel`);
 body.set("line_items[0][price_data][currency]","czk");body.set("line_items[0][price_data][unit_amount]",String(order.amount));
 body.set("line_items[0][price_data][product_data][name]",`Carsgo TOP ${days} dní`);body.set("line_items[0][quantity]","1");
 body.set("metadata[promotionOrderId]",order.id);body.set("metadata[vehicleId]",vehicleId);body.set("metadata[days]",String(days));
 const r=await fetch("https://api.stripe.com/v1/checkout/sessions",{method:"POST",headers:{"Authorization":`Bearer ${process.env.STRIPE_SECRET_KEY}`,"Content-Type":"application/x-www-form-urlencoded"},body});
 if(!r.ok)return new Response(await r.text(),{status:502});const data=await r.json();return Response.redirect(data.url,303);
}
