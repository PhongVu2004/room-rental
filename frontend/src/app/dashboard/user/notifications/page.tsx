"use client"

import { motion } from "framer-motion"
import { Bell, CalendarCheck, CalendarX, MessageSquare, Info } from "lucide-react"
import { useEffect, useState } from "react"
import { getNotifications, markAsRead, Notification } from "@/services/notifications"

export default function UserNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      if (data) setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.isRead);
    for (const notification of unreadNotifications) {
      await handleMarkAsRead(notification.id);
    }
  };

  const getIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('approved') || lowerTitle.includes('chấp nhận')) return <CalendarCheck className="h-5 w-5 text-green-500" />
    if (lowerTitle.includes('rejected') || lowerTitle.includes('từ chối') || lowerTitle.includes('hủy')) return <CalendarX className="h-5 w-5 text-red-500" />
    if (lowerTitle.includes('message')) return <MessageSquare className="h-5 w-5 text-blue-500" />
    return <Info className="h-5 w-5 text-muted-foreground" />
  }

  return (
    <div className="max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Notifications</h1>
            <p className="text-muted-foreground">Stay updated on your booking statuses and messages.</p>
          </div>
          <button 
            onClick={handleMarkAllAsRead}
            className="text-sm text-primary hover:underline font-medium"
          >
            Mark all as read
          </button>
        </div>
        
        <div className="bg-background rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="divide-y divide-border">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">You have no notifications yet.</div>
            ) : notifications.map((notification, i) => (
              <motion.div 
                key={notification.id} 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: i * 0.1 }}
                onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                className={`p-5 flex items-start gap-4 transition-colors hover:bg-muted/30 cursor-pointer ${!notification.isRead ? 'bg-primary/5' : ''}`}
              >
                <div className={`mt-1 h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${!notification.isRead ? 'bg-primary/10' : 'bg-muted'}`}>
                  {getIcon(notification.title)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold text-base ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className={`text-sm ${!notification.isRead ? 'text-foreground/90' : 'text-muted-foreground'}`}>
                    {notification.message}
                  </p>
                </div>
                {!notification.isRead && (
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
