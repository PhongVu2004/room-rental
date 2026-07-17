"use client";

import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { getNotifications, markAsRead, Notification } from "@/services/notifications";
import toast from "react-hot-toast";

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    
    // Setup SSE for real-time notifications
    let eventSource: EventSource | null = null;
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    if (token) {
      eventSource = new EventSource(`${apiUrl}/notifications/stream?token=${token}`);
      
      eventSource.onmessage = (event) => {
        try {
          const newNotification: Notification = JSON.parse(event.data);
          setNotifications((prev) => [newNotification, ...prev]);
          toast.success(`New Notification: ${newNotification.title}`);
        } catch (err) {
          console.error("Failed to parse SSE message", err);
        }
      };

      eventSource.onerror = (error) => {
        console.error("SSE connection error", error);
        // Optionally handle reconnection or close on persistent errors
      };
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      if (Array.isArray(data)) {
        setNotifications(data);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const unreadCount = Array.isArray(notifications) ? notifications.filter(n => !n.isRead).length : 0;

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="p-2 rounded-full hover:bg-gray-100 transition relative"
        aria-label="Toggle notifications"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
      >
        <Bell className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{unreadCount} unread</span>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No notifications.
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer flex justify-between items-start ${!n.isRead ? 'bg-blue-50/50' : ''}`}
                >
                  <div className="flex-1 mr-4">
                    <h4 className={`text-sm ${!n.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                      {n.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">{n.message}</p>
                    <span className="text-[10px] text-gray-400 mt-2 block">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {!n.isRead && (
                    <button 
                      onClick={(e) => handleMarkAsRead(n.id, e)}
                      className="text-xs text-blue-600 hover:text-blue-800 shrink-0"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
