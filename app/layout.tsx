"use client"

import Script from "next/script"
import BlurVignette from "@/components/layout/BlurVignette"
import BottomNav from "@/components/layout/bottomnav"
import SidePanel from "@/components/layout/sidepanel"
import TopNav from "@/components/layout/topnav"
import PageTransition from "@/components/layout/PageTransition"
import { SectionProvider } from "@/lib/context/SectionContext"
import "./globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <Script
          id="adobe-fonts"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(d) {
              var config = {
                kitId: 'pse7nlp',
                scriptTimeout: 3000,
                async: true
              },
              h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\\bwf-loading\\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
            })(document);`
          }}
        />
        <SectionProvider>
          <SidePanel />
          <TopNav />
          <BlurVignette />
          <BottomNav />
          <PageTransition>
            {children}
          </PageTransition>
        </SectionProvider>
      </body>
    </html>
  )
}