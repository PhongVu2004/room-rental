"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { 
  LayoutDashboard, 
  User, 
  Heart, 
  Calendar, 
  Bell, 
  Home, 
  Users, 
  Settings,
  BarChart
} from "lucide-react"

export function Sidebar() {
  const { user } = useAuth()
  const pathname = usePathname()

  if (!user) return null

    const getLinks = () => {
      switch (user.role) {
        case 'ADMIN':
          return [
            { href: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard },
            { href: '/dashboard/admin/users', label: 'Users', icon: Users },
            { href: '/dashboard/admin/rooms', label: 'Rooms', icon: Home },
            { href: '/dashboard/admin/bookings', label: 'Bookings', icon: Calendar },
            { href: '/dashboard/admin/reports', label: 'Reports', icon: BarChart },
            { href: '/dashboard/admin/logs', label: 'System Logs', icon: Settings },
          ]
        case 'LANDLORD':
          return [
            { href: '/dashboard/landlord', label: 'Analytics', icon: BarChart },
            { href: '/dashboard/landlord/rooms', label: 'My Rooms', icon: Home },
            { href: '/dashboard/landlord/bookings', label: 'Bookings', icon: Calendar },
          ]
        default: // GUEST
          return [
            { href: '/dashboard/user', label: 'Overview', icon: LayoutDashboard },
            { href: '/dashboard/user/profile', label: 'Profile', icon: User },
            { href: '/dashboard/user/favorites', label: 'Favorites', icon: Heart },
            { href: '/dashboard/user/bookings', label: 'Bookings', icon: Calendar },
            { href: '/dashboard/user/notifications', label: 'Notifications', icon: Bell },
          ]
      }
    }

  const links = getLinks()

  return (
    <aside className="hidden w-64 flex-col border-r bg-background md:flex min-h-[calc(100vh-4rem)]">
      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const isActive = pathname === link.href
          const Icon = link.icon
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? "bg-background shadow-sm ring-1 ring-black/5 dark:ring-white/10 text-foreground" 
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
