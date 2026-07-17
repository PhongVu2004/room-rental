"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { fetchApi } from "@/lib/api"
import { MapPin, User } from "lucide-react"

export default function AdminRooms() {
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      const data = await fetchApi('/admin/rooms')
      setRooms(data)
    } catch (error) {
      console.error('Failed to fetch rooms', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading rooms...</div>

  return (
    <div className="max-w-7xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Room Management</h1>
        <p className="text-muted-foreground mb-8">Monitor all properties listed on the platform.</p>
        
        <div className="bg-background rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Property</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Landlord</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bookings</th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img 
                          src={room.images?.[0] ? `${process.env.NEXT_PUBLIC_API_URL}${room.images[0]}` : "https://via.placeholder.com/40"} 
                          className="w-10 h-10 rounded-md object-cover mr-3" 
                          alt="" 
                        />
                        <div>
                          <div className="text-sm font-bold text-foreground line-clamp-1">{room.title}</div>
                          <div className="text-xs text-muted-foreground flex items-center mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span className="line-clamp-1">{room.district}, {room.city}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-foreground">
                        <User className="w-4 h-4 mr-2 text-muted-foreground" />
                        {room.landlord?.name || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${room.status === 'AVAILABLE' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                          room.status === 'RENTED' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                          'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                        {room.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {room._count?.bookings || 0} Total
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
