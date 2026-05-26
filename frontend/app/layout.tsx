import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils/utils"
import { NavbarWrapper } from "@/components/navbar/navbar-wrapper"
import { Toaster } from "@/components/ui/sonner"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        fontSans.variable
      )}
    >
      <body>
        <ThemeProvider>
          <NavbarWrapper />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

// function Footer() {
//   return (
//     <footer className="mx-auto my-3 max-w-[1200px] text-center text-sm text-muted-foreground">
//       &copy; {new Date().getFullYear()} MyApp. All rights reserved.
//     </footer>
//   )
// }
