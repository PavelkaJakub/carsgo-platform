"use client";
import {useEffect,useState} from "react";
export default function CookieConsent(){
  const [show,setShow]=useState(false);
  useEffect(()=>setShow(!localStorage.getItem("carsgo_cookie_consent")),[]);
  if(!show)return null;
  function save(value:string){localStorage.setItem("carsgo_cookie_consent",value);setShow(false)}
  return <div style={{position:"fixed",left:16,right:16,bottom:16,zIndex:50,maxWidth:850,margin:"auto"}} className="panel">
    <b>Soukromí a cookies</b>
    <p className="meta">Nezbytné cookies používáme pro fungování Carsgo. Analytické a marketingové technologie budou zapnuté pouze po souhlasu.</p>
    <button className="btn" onClick={()=>save("all")}>Povolit vše</button>{" "}
    <button className="btn secondary" onClick={()=>save("necessary")}>Jen nezbytné</button>{" "}
    <a href="/privacy">Nastavení a informace</a>
  </div>
}
