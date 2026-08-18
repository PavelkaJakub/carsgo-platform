export async function sendLeadNotification(input:{to?:string;vehicle:string;leadName:string}){
  // v0.7: provider-agnostic skeleton.
  // Později napojíme Resend/Postmark/SES.
  console.log("LEAD_NOTIFICATION",input);
}
