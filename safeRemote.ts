export function assertAllowedRemoteUrl(raw:string){
  const u=new URL(raw);
  if(!["https:"].includes(u.protocol)) throw new Error("Only HTTPS feeds are allowed");
  const allowed=(process.env.ALLOWED_FEED_HOSTS||"").split(",").map(x=>x.trim().toLowerCase()).filter(Boolean);
  if(!allowed.length) throw new Error("ALLOWED_FEED_HOSTS is empty");
  const host=u.hostname.toLowerCase();
  if(!allowed.some(x=>host===x||host.endsWith(`.${x}`))) throw new Error("Feed host is not allowed");
  if(host==="localhost"||host.endsWith(".local")) throw new Error("Local hosts are blocked");
  return u;
}
