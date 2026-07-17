"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { getFavorites } from "@/services/rooms"
import Link from "next/link"
import { Heart, MapPin } from "lucide-react"

export default function UserFavorites() {
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    try {
      const data = await getFavorites()
      setFavorites(data)
    } catch (error) {
      console.error('Failed to fetch favorites', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading favorites...</div>

  return (
    <div className="max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Saved Rooms</h1>
        <p className="text-muted-foreground mb-8">Rooms you have saved for later.</p>
        
        {favorites.length === 0 ? (
          <div className="text-center py-20 bg-background/50 backdrop-blur rounded-2xl border border-dashed flex flex-col items-center">
            <Heart className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">No saved rooms</h3>
            <p className="text-muted-foreground mb-6">You haven't saved any rooms yet.</p>
            <Link href="/rooms" className="text-primary hover:underline font-medium">Explore Rooms</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((room, i) => (
              <motion.div key={room.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                <Link href={`/rooms/${room.id}`} className="group block h-full">
                  <div className="bg-background/50 backdrop-blur rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all h-full flex flex-col hover:shadow-lg">
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img 
                        src={room.images?.[0] ? `${process.env.NEXT_PUBLIC_API_URL}${room.images[0]}` : "https://via.placeholder.com/400x300"} 
                        alt={room.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur p-2 rounded-full text-red-500 shadow-sm">
                        <Heart className="h-4 w-4 fill-current" />
                      </div>
                      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur text-white px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider">
                        {room.status}
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">{room.title}</h3>
                      <div className="flex items-center text-muted-foreground text-sm mb-4">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="line-clamp-1">{room.district}, {room.city}</span>
                      </div>
                      <div className="mt-auto pt-4 border-t border-border/50">
                        <span className="text-xl font-extrabold text-primary">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.price)}
                        </span>
                        <span className="text-muted-foreground text-sm font-medium"> / month</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
