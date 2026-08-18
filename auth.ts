import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
const secret=new TextEncoder().encode(process.env.AUTH_SECRET||"dev-secret");

export type Session={userId:string;email:string;role:string;companyId?:string};

export async function createSession(s:Session){
  const token=await new SignJWT(s).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("7d").sign(secret);
  cookies().set("carsgo_session",token,{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",path:"/",maxAge:604800});
}
export async function getSession():Promise<Session|null>{
  const token=cookies().get("carsgo_session")?.value;if(!token)return null;
  try{const {payload}=await jwtVerify(token,secret);return payload as unknown as Session}catch{return null}
}
export function clearSession(){cookies().delete("carsgo_session")}
export async function requirePartner(){const s=await getSession();if(!s||!["COMPANY_USER","COMPANY_ADMIN","ADMIN"].includes(s.role))throw new Error("UNAUTHORIZED");return s}
export async function requireAdmin(){const s=await getSession();if(!s||s.role!=="ADMIN")throw new Error("UNAUTHORIZED");return s}
