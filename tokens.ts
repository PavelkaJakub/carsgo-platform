export function randomToken(){
  return crypto.randomUUID().replace(/-/g,"")+crypto.randomUUID().replace(/-/g,"");
}
