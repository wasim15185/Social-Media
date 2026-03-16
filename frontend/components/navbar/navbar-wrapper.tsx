"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "./navbar"

export function NavbarWrapper() {
  const pathname = usePathname()

  const hideNavbarRoutes = ["/login", "/signup"]

  if (hideNavbarRoutes.includes(pathname)) {
    return null
  }

  return <Navbar />
}
