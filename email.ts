type Mail={to:string;subject:string;html:string};

export async function sendEmail(mail:Mail){
  const provider=(process.env.EMAIL_PROVIDER||"console").toLowerCase();

  if(provider==="resend" && process.env.RESEND_API_KEY){
    const r=await fetch("https://api.resend.com/emails",{
      method:"POST",
      headers:{"Authorization":`Bearer ${process.env.RESEND_API_KEY}`,"Content-Type":"application/json"},
      body:JSON.stringify({from:process.env.EMAIL_FROM,to:[mail.to],subject:mail.subject,html:mail.html})
    });
    if(!r.ok) throw new Error(`Resend ${r.status}`);
    return;
  }

  if(provider==="postmark" && process.env.POSTMARK_SERVER_TOKEN){
    const r=await fetch("https://api.postmarkapp.com/email",{
      method:"POST",
      headers:{"X-Postmark-Server-Token":process.env.POSTMARK_SERVER_TOKEN,"Content-Type":"application/json"},
      body:JSON.stringify({From:process.env.EMAIL_FROM,To:mail.to,Subject:mail.subject,HtmlBody:mail.html})
    });
    if(!r.ok) throw new Error(`Postmark ${r.status}`);
    return;
  }

  console.log("EMAIL",mail);
}
