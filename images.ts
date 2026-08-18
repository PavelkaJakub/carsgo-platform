export function validateImageUrl(raw:string){
  const u=new URL(raw);
  if(u.protocol!=="https:") throw new Error("Image must use HTTPS");
  if(["localhost","127.0.0.1","::1"].includes(u.hostname)) throw new Error("Local image URL blocked");
  return u.toString();
}
export function validateImageUpload(filename:string,contentType:string){
  const allowed=["image/jpeg","image/png","image/webp"];
  if(!allowed.includes(contentType)) throw new Error("Unsupported image type");
  const safe=filename.replace(/[^a-zA-Z0-9._-]/g,"_").slice(-120);
  return safe||"image";
}
