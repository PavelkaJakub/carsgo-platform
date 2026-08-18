import {getSession} from "@/lib/auth";

export async function POST(request:Request){
  const s=await getSession(); if(!s) return new Response("Unauthorized",{status:401});
  if(!process.env.STRIPE_SECRET_KEY) return new Response("Stripe není nakonfigurován.",{status:501});
  const f=await request.formData();
  const plan=String(f.get("plan")||"");
  const price=plan==="PRIVATE_PLUS"?process.env.STRIPE_PRICE_PRIVATE_PLUS:plan==="BUSINESS"?process.env.STRIPE_PRICE_BUSINESS:null;
  if(!price) return new Response("Neplatný tarif",{status:400});

  const base=process.env.APP_URL||new URL(request.url).origin;
  const body=new URLSearchParams();
  body.set("mode","subscription");
  body.set("line_items[0][price]",price);
  body.set("line_items[0][quantity]","1");
  body.set("success_url",`${base}/account?billing=success`);
  body.set("cancel_url",`${base}/pricing?billing=cancel`);
  body.set("customer_email",s.email);
  body.set("metadata[userId]",s.userId);
  body.set("metadata[plan]",plan);

  const r=await fetch("https://api.stripe.com/v1/checkout/sessions",{
    method:"POST",
    headers:{"Authorization":`Bearer ${process.env.STRIPE_SECRET_KEY}`,"Content-Type":"application/x-www-form-urlencoded"},
    body
  });
  if(!r.ok) return new Response(await r.text(),{status:502});
  const data=await r.json();
  return Response.redirect(data.url,303);
}
