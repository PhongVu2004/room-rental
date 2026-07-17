"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getBookings, approveBooking, rejectBooking, Booking } from '@/services/bookings';

export default function LandlordBookings() {
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

  const handleApprove = async (id: string) => {
    if (!confirm('Approve this booking request?')) return;
    try {
      await approveBooking(id);
      fetchBookings(); // reload
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error');
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Reject this booking request?')) return;
    try {
      await rejectBooking(id);
      fetchBookings(); // reload
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error');
    }
  };

  const statusMap = {
    PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    CONFIRMED: { label: 'Approved', color: 'bg-green-100 text-green-800' },
    REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
    CANCELLED: { label: 'Cancelled by Guest', color: 'bg-gray-100 text-gray-800' },
  };

  if (loading) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Manage Bookings</h1>
          <p className="text-muted-foreground">Review and respond to booking requests.</p>
        </div>
      </div>

      <div className="bg-background rounded-2xl shadow-sm border border-border overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Room</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tenant</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dates</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-border">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-bold text-foreground line-clamp-1">{booking.room?.title}</div>
                      <div className="text-xs text-muted-foreground">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.totalPrice)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-foreground">{booking.user?.name}</div>
                  <div className="text-xs text-muted-foreground">{booking.user?.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {new Date(booking.startDate).toLocaleDateString('vi-VN')} <br />
                  <span className="text-xs">to</span> {new Date(booking.endDate).toLocaleDateString('vi-VN')}
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
                  {booking.status === 'PENDING' && (
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => handleApprove(booking.id)}
                        className="text-green-600 hover:text-green-900 dark:text-green-500 dark:hover:text-green-400 font-semibold"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleReject(booking.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-400 font-semibold"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground border-t border-dashed">
                  No booking requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
