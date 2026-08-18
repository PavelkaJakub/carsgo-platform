import {validateImageUpload} from "@/lib/images";
import {PutObjectCommand} from "@aws-sdk/client-s3";import {getSignedUrl} from "@aws-sdk/s3-request-presigner";import {s3} from "@/lib/s3";import {requirePartner} from "@/lib/auth";
export async function POST(request:Request){
  try{await requirePartner()}catch{return new Response("Unauthorized",{status:401})}
  if(!process.env.S3_BUCKET)return Response.json({error:"S3 not configured"},{status:501});
  const {filename,contentType}=await request.json();let safeName;try{safeName=validateImageUpload(filename,contentType)}catch(e:any){return new Response(e.message,{status:400})}const key=`vehicles/${crypto.randomUUID()}-${safeName}`;
  const command=new PutObjectCommand({Bucket:process.env.S3_BUCKET,Key:key,ContentType:contentType});
  const uploadUrl=await getSignedUrl(s3,command,{expiresIn:300});
  const publicUrl=process.env.S3_PUBLIC_BASE_URL?`${process.env.S3_PUBLIC_BASE_URL.replace(/\/$/,"")}/${key}`:null;
  return Response.json({uploadUrl,key,publicUrl});
}
