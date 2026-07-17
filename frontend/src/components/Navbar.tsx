"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { Moon, Sun, Home, User, LogIn, LogOut } from "lucide-react"
import { Button } from "./button"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/context/auth-context"
import dynamic from 'next/dynamic'

const NotificationDropdown = dynamic(
  () => import('./NotificationDropdown').then((mod) => mod.NotificationDropdown),
  { ssr: false }
)

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const { user, logout, isLoading } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'glass border-b-0' : 'bg-transparent border-b border-border/50'}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-8 flex items-center space-x-2" aria-label="Go to Home">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <Home className="h-5 w-5" aria-hidden={true} />
            </div>
            <span className="hidden font-bold tracking-tight sm:inline-block text-lg">
              RoomRent
            </span>
          </Link>
          <div className="hidden md:flex space-x-6 items-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors">Home</Link>
            <Link href="/rooms" className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors">Rooms</Link>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors">About Us</Link>
            {user && (
              <Link href={`/dashboard/${user.role === 'GUEST' ? 'user' : user.role.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors">
                Dashboard
              </Link>
            )}
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Toggle theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {mounted && theme === "dark" ? (
                <Sun className="h-4 w-4" aria-hidden={true} />
              ) : (
                <Moon className="h-4 w-4" aria-hidden={true} />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            {!isLoading && user ? (
              <div className="flex items-center space-x-4">
                <NotificationDropdown />
                <span className="text-sm font-medium hidden md:inline-block">Hi, {user.firstName || user.email.split('@')[0]}</span>
                <Button variant="outline" size="sm" className="hidden md:flex rounded-full px-4" aria-label="Sign Out" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" aria-hidden={true} />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="default" size="sm" className="hidden md:flex rounded-full px-5">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </motion.header>
  )
}
