import "./globals.css";
import CookieConsent from "@/components/CookieConsent";
import type {Metadata} from "next";
export const metadata:Metadata={title:"Carsgo v0.6",description:"Marketplace + Partner + Admin"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="cs"><body>{children}<CookieConsent/></body></html>}
