"use client";
export default function ErrorPage({reset}:{error:Error&{digest?:string};reset:()=>void}){
 return <html><body><main className="login panel"><h1>Něco se nepovedlo</h1><p className="meta">Požadavek se nepodařilo dokončit.</p><button className="btn" onClick={()=>reset()}>Zkusit znovu</button></main></body></html>
}
