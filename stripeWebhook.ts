import {createHmac,timingSafeEqual} from "crypto";
export function verifyStripeSignature(payload:string,header:string,secret:string,tolerance=300){
  const parts=Object.fromEntries(header.split(",").map(x=>x.split("=",2)));
  const ts=Number(parts.t),sig=parts.v1;
  if(!ts||!sig) return false;
  if(Math.abs(Date.now()/1000-ts)>tolerance)return false;
  const expected=createHmac("sha256",secret).update(`${ts}.${payload}`).digest("hex");
  const a=Buffer.from(expected),b=Buffer.from(sig);
  return a.length===b.length&&timingSafeEqual(a,b);
}
