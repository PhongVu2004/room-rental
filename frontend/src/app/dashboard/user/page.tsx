"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card"
import { motion } from "framer-motion"
import { Home, Calendar, Clock, ChevronRight } from "lucide-react"
import { getBookings, Booking } from "@/services/bookings"
import Link from "next/link"

export default function UserDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const data = await getBookings()
      setBookings(data)
    } catch (error) {
      console.error('Failed to fetch bookings', error)
    } finally {
      setLoading(false)
    }
  }

  const activeStays = bookings.filter(b => b.status === 'CONFIRMED').length
  const pendingRequests = bookings.filter(b => b.status === 'PENDING').length
  const recentBookings = bookings.slice(0, 3) // latest 3

  if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading dashboard...</div>

  return (
    <div className="max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Overview</h1>
        <p className="text-muted-foreground mb-8">Welcome back! Here's an overview of your activity.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-background/50 backdrop-blur border-border/50 hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold tracking-tighter">{bookings.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-background/50 backdrop-blur border-border/50 hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Active Stays</CardTitle>
              <Home className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold tracking-tighter text-primary">{activeStays}</div>
            </CardContent>
          </Card>
          <Card className="bg-background/50 backdrop-blur border-border/50 hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Pending</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold tracking-tighter text-orange-500">{pendingRequests}</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold tracking-tight">Recent Bookings</h2>
          <Link href="/dashboard/user/bookings" className="text-sm text-primary hover:underline font-medium">View all</Link>
        </div>
        
        <div className="space-y-4">
          {recentBookings.map((booking, i) => (
            <motion.div key={booking.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="group hover:border-primary/50 transition-colors cursor-pointer bg-background/50 backdrop-blur border-border/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={`${process.env.NEXT_PUBLIC_API_URL}${booking.room.images?.[0]}`} 
                      className="w-14 h-14 rounded-lg object-cover" 
                      alt="" 
                    />
                    <div>
                      <h3 className="font-semibold tracking-tight group-hover:text-primary transition-colors line-clamp-1">{booking.room.title}</h3>
                      <p className="text-sm text-muted-foreground">{new Date(booking.startDate).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center space-x-4">
                    <div className="hidden sm:block">
                      <div className="font-bold text-primary">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.totalPrice)}</div>
                      <div className="text-xs text-muted-foreground">{booking.status}</div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {recentBookings.length === 0 && (
            <div className="text-center p-8 text-muted-foreground border rounded-lg border-dashed">
              No recent bookings found.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
