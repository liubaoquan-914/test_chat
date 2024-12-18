import AppContextProvider from "@/components/AppContext"
import EventBusContextProvider from '@/components/EventBusContext'
import "@/styles/globals.css"
import "@/styles/markdown.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "首页",
}

export default function RootLayout ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body>
        <AppContextProvider>
          <EventBusContextProvider>
            {children}
          </EventBusContextProvider>
        </AppContextProvider>
      </body>
    </html>
  )
}