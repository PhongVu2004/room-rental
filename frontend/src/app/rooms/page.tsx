"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getRooms, Room } from '@/services/rooms';
import RoomCard from '@/components/RoomCard';
import RoomSkeleton from '@/components/RoomSkeleton';
import FilterBar from '@/components/FilterBar';
import Pagination from '@/components/Pagination';

function RoomsList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ currentPage: 1, totalPages: 1 });
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const params = Object.fromEntries(searchParams.entries());
        const res = await getRooms(params);
        setRooms(res.data || []);
        setMeta({
          currentPage: res.meta.page,
          totalPages: res.meta.totalPages,
        });
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [searchParams]);

  const handleFilter = (filters: any) => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    router.push(`/rooms?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/rooms?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow container py-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-8 text-center">
          Available Rooms
        </h1>
        
        <FilterBar onFilter={handleFilter} />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => <RoomSkeleton key={i} />)}
          </div>
        ) : rooms.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {rooms.map(room => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
            <Pagination 
              currentPage={meta.currentPage} 
              totalPages={meta.totalPages} 
              onPageChange={handlePageChange} 
            />
          </>
        ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              <p className="text-xl font-medium text-gray-900 mb-2">No rooms found</p>
              <p>Try adjusting your search filters.</p>
            </div>
        )}
      </div>
    </div>
  );
}

export default function RoomsPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <RoomsList />
    </Suspense>
  );
}
