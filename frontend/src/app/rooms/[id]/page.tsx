"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getRoom, Room, toggleFavorite } from '@/services/rooms';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function RoomDetail() {
  const { id } = useParams();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const data = await getRoom(id as string);
        setRoom(data);
        setIsFavorite(data.isFavorite || false);
      } catch (error) {
        console.error('Error fetching room:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchRoom();
  }, [id]);

  const handleFavorite = async () => {
    try {
      const res = await toggleFavorite(id as string);
      setIsFavorite(res.isFavorite);
    } catch (error) {
      alert('You need to login to save this room.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading room details...</div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Room not found!</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card rounded-[2rem] shadow-sm border border-border/50 overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
          {/* Gallery */}
          <div className="flex flex-col md:flex-row h-auto md:h-[500px]">
            <div className="w-full md:w-2/3 bg-muted relative">
              {room.images && room.images.length > 0 ? (
                <Image 
                  src={`${API_URL}${room.images[activeImage]}`} 
                  alt="Room" 
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">No images</div>
              )}
            </div>
            <div className="w-full md:w-1/3 bg-background border-l border-border/50 flex md:flex-col overflow-x-auto md:overflow-y-auto p-4 gap-4 scrollbar-hide">
              {room.images?.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  aria-label={`View image ${idx + 1}`}
                  className={`relative cursor-pointer rounded-xl overflow-hidden border-2 flex-shrink-0 w-32 md:w-full h-24 md:h-32 transition-all duration-300 ${activeImage === idx ? 'border-primary ring-2 ring-primary/20 scale-[0.98]' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <Image src={`${API_URL}${img}`} fill sizes="33vw" className="object-cover" alt={`Thumb ${idx}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-extrabold text-foreground mb-2 tracking-tighter">{room.title}</h1>
                <p className="text-lg text-muted-foreground tracking-tight">{room.address}, {room.district}, {room.city}</p>
              </div>
              <button 
                onClick={handleFavorite}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                className="p-4 rounded-full bg-secondary hover:bg-secondary/80 transition-all hover:scale-105 active:scale-95 shadow-sm"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-8 w-8 ${isFavorite ? 'text-red-500 fill-current drop-shadow-md' : 'text-muted-foreground'}`} 
                  fill={isFavorite ? "currentColor" : "none"} 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-border/50">
              <span className="text-4xl font-black text-primary">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.price)}
              </span>
              <span className="text-muted-foreground text-xl">/ month</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-2 space-y-8">
                <section>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Detailed Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {room.description}
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Amenities</h3>
                  <div className="flex flex-wrap gap-3">
                    {room.amenities?.map((am, i) => (
                      <span key={i} className="px-4 py-2 bg-primary/10 text-primary rounded-full font-medium">
                        {am}
                      </span>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Nearby Universities</h3>
                  <div className="flex flex-wrap gap-3">
                    {room.nearbyUniversities?.map((uni, i) => (
                      <span key={i} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full font-medium border border-border/50">
                        {uni}
                      </span>
                    ))}
                  </div>
                </section>
              </div>

              <div className="md:col-span-1">
                <div className="bg-card rounded-[2rem] p-8 border border-border/50 shadow-sm sticky top-24 ring-1 ring-black/5 dark:ring-white/5">
                  <h3 className="text-xl font-bold text-foreground mb-6 tracking-tight">Contact Info</h3>
                  <div className="space-y-5">
                    <div>
                      <p className="text-sm text-muted-foreground">Landlord</p>
                      <p className="font-semibold text-foreground text-lg">{room.landlord?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-bold text-xl text-primary">{room.landlord?.phone || 'Not updated'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-foreground">{room.landlord?.email}</p>
                    </div>
                  </div>
                  <Link href={`/rooms/${id}/book`} className="w-full mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 block text-center">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
