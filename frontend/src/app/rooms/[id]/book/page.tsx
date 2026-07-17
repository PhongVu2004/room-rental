"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getRoom, Room } from '@/services/rooms';
import { createBooking } from '@/services/bookings';
export default function BookRoomPage() {
  const { id } = useParams();
  const router = useRouter();
  const [room, setRoom] = useState<Room | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      getRoom(id as string).then(setRoom).catch(console.error);
    }
  }, [id]);

  const calculateMonths = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return months > 0 ? months : 0; // Simplified calculation
  };

  const months = calculateMonths();
  const totalPrice = room ? room.price * (months === 0 ? 1 : months) : 0; // Default at least 1 month

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return alert('Please select dates');
    setLoading(true);
    try {
      await createBooking({
        roomId: id as string,
        startDate,
        endDate,
        totalPrice,
      });
      alert('Booking request sent successfully!');
      router.push('/dashboard/user/bookings');
    } catch (error: any) {
      alert(error.response?.data?.message || 'An error occurred while booking');
    } finally {
      setLoading(false);
    }
  };

  if (!room) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Confirm Booking</h1>
          
          <div className="flex flex-col md:flex-row gap-8 mb-8 border-b border-gray-100 pb-8">
            <div className="w-full md:w-1/3">
              <img 
                src={`${process.env.NEXT_PUBLIC_API_URL}${room.images?.[0]}`} 
                alt={room.title}
                className="w-full h-40 object-cover rounded-xl"
              />
            </div>
            <div className="w-full md:w-2/3">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{room.title}</h2>
              <p className="text-gray-500 mb-4">{room.address}, {room.district}, {room.city}</p>
              <div className="text-2xl font-bold text-blue-600">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.price)}
                <span className="text-sm font-normal text-gray-500">/month</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleBooking} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Move-in Date</label>
                <input 
                  type="date" 
                  required
                  className="w-full border-gray-300 rounded-lg shadow-sm p-3 border focus:ring-blue-500 focus:border-blue-500"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Move-out Date</label>
                <input 
                  type="date" 
                  required
                  className="w-full border-gray-300 rounded-lg shadow-sm p-3 border focus:ring-blue-500 focus:border-blue-500"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-800 font-medium">Estimated Total Price</p>
                <p className="text-xs text-blue-600">Based on lease months ({months === 0 ? 'Minimum 1 month' : `${months} months`})</p>
              </div>
              <div className="text-3xl font-black text-blue-700">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Submit Booking Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
