const store=new Map<string,{count:number;reset:number}>();
export function rateLimit(key:string,limit=30,windowMs=60000){
  const now=Date.now(), current=store.get(key);
  if(!current||current.reset<now){store.set(key,{count:1,reset:now+windowMs});return {ok:true,remaining:limit-1}}
  current.count++;
  return {ok:current.count<=limit,remaining:Math.max(0,limit-current.count)};
}
export function requestKey(request:Request,prefix:string){
  const ip=request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()||"local";
  return `${prefix}:${ip}`;
}
