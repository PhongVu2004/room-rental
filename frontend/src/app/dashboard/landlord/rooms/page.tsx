"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getRooms, getStatistics, Room } from '@/services/rooms';

export default function LandlordRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;
        const user = JSON.parse(userStr);

        const [statsData, roomsData] = await Promise.all([
          getStatistics(),
          getRooms({ landlordId: user.id }),
        ]);
        setStats(statsData);
        setRooms(roomsData.data || []);
      } catch (error) {
        console.error('Failed to fetch landlord data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Manage Rooms</h1>
          <p className="text-muted-foreground">View and manage all your properties.</p>
        </div>
        <Link href="/dashboard/landlord/rooms/create" className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium transition shadow-sm">
          + Add New Room
        </Link>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-background/50 backdrop-blur p-6 rounded-2xl shadow-sm border border-border/50">
            <p className="text-muted-foreground text-sm font-medium mb-1">Total Rooms</p>
            <h3 className="text-3xl font-extrabold">{stats.totalRooms}</h3>
          </div>
          <div className="bg-background/50 backdrop-blur p-6 rounded-2xl shadow-sm border border-border/50">
            <p className="text-muted-foreground text-sm font-medium mb-1">Rented Rooms</p>
            <h3 className="text-3xl font-extrabold text-blue-500">{stats.rentedRooms}</h3>
          </div>
          <div className="bg-background/50 backdrop-blur p-6 rounded-2xl shadow-sm border border-border/50">
            <p className="text-muted-foreground text-sm font-medium mb-1">Available Rooms</p>
            <h3 className="text-3xl font-extrabold text-green-500">{stats.availableRooms}</h3>
          </div>
          <div className="bg-background/50 backdrop-blur p-6 rounded-2xl shadow-sm border border-border/50">
            <p className="text-muted-foreground text-sm font-medium mb-1">Average Price</p>
            <h3 className="text-2xl font-extrabold text-primary">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.avgPrice || 0)}
            </h3>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-background rounded-2xl shadow-sm border border-border overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Room</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price / month</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-border">
            {rooms.map(room => (
              <tr key={room.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-bold text-foreground">{room.title}</div>
                      <div className="text-xs text-muted-foreground">{room.district}, {room.city}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-primary">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.price)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                    room.status === 'AVAILABLE' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                    room.status === 'RENTED' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                    'bg-red-500/10 text-red-500 border-red-500/20'
                  }`}>
                    {room.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link href={`/rooms/${room.id}`} className="text-primary hover:underline mr-4">View</Link>
                  {/* Add Edit/Delete buttons as needed */}
                </td>
              </tr>
            ))}
            {rooms.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground border-dashed border-t">
                  You have no rooms yet. Add a new room!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
