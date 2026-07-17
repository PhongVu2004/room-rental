"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getBookings, cancelBooking, Booking } from '@/services/bookings';
import { Calendar } from 'lucide-react';

export default function GuestBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await getBookings();
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking request?')) return;
    try {
      await cancelBooking(id);
      fetchBookings(); // reload
    } catch (error: any) {
      alert(error.response?.data?.message || 'Unable to cancel at this time');
    }
  };

  const statusMap = {
    PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    CONFIRMED: { label: 'Confirmed', color: 'bg-green-100 text-green-800' },
    REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
    CANCELLED: { label: 'Cancelled', color: 'bg-gray-100 text-gray-800' },
  };

  if (loading) return (
    <div className="max-w-6xl space-y-4">
      <div className="h-8 w-64 bg-muted animate-pulse rounded-md"></div>
      <div className="h-4 w-96 bg-muted animate-pulse rounded-md mb-8"></div>
      <div className="h-[400px] w-full bg-muted/50 animate-pulse rounded-2xl border border-border/50"></div>
    </div>
  );

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Booking History</h1>
          <p className="text-muted-foreground">Review your past and upcoming stays.</p>
        </div>
      </div>

      <div className="bg-background rounded-2xl shadow-sm border border-border overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Room</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Move-in Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estimated Total</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-border">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img 
                      src={booking.room?.images?.[0] ? `${process.env.NEXT_PUBLIC_API_URL}${booking.room.images[0]}` : "https://via.placeholder.com/64"} 
                      className="w-12 h-12 rounded-lg object-cover mr-4" 
                      alt="" 
                    />
                    <div>
                      <div className="text-sm font-bold text-foreground line-clamp-1">{booking.room?.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{booking.room?.district}, {booking.room?.city}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {new Date(booking.startDate).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.totalPrice)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                    booking.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                    booking.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                    booking.status === 'REJECTED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                    'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link href={`/rooms/${booking.roomId}`} className="text-primary hover:underline mr-4">
                    View Room
                  </Link>
                  {booking.status === 'PENDING' && (
                    <button 
                      onClick={() => handleCancel(booking.id)}
                      className="text-red-500 hover:text-red-600 font-semibold"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-24 text-center border-t border-border/50 bg-background/50">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="p-4 bg-muted rounded-full">
                      <Calendar className="h-8 w-8 text-muted-foreground opacity-50" />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight mt-4">No booking requests yet</h3>
                    <p className="text-muted-foreground">When you book a room, it will appear here.</p>
                    <Link href="/rooms" className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 shadow-sm hover:shadow-md">
                      Explore Rooms
                    </Link>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
