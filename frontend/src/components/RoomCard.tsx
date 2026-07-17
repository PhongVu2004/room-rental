import Link from 'next/link';
import Image from 'next/image';
import { Room } from '../services/rooms';
import { useState } from 'react';
import { toggleFavorite } from '../services/rooms';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function RoomCard({ room }: { room: Room }) {
  const [isFavorite, setIsFavorite] = useState(room.isFavorite || false);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const res = await toggleFavorite(room.id);
      setIsFavorite(res.isFavorite);
    } catch (error) {
      console.error('Failed to toggle favorite', error);
      alert('You need to login to favorite a room.');
    }
  };

  const coverImage = room.images && room.images.length > 0 
    ? `${API_URL}${room.images[0]}`
    : 'https://via.placeholder.com/400x300?text=No+Image';

  return (
    <Link href={`/rooms/${room.id}`}>
      <div className="bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-stripe transition-all duration-500 relative group cursor-pointer border border-border/50 hover:border-primary/20 hover:-translate-y-1">
        <div className="relative h-56 overflow-hidden bg-muted">
          <Image 
            src={coverImage} 
            alt={room.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-foreground shadow-sm">
            {room.status}
          </div>
          
          <button 
            onClick={handleFavorite}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-background/50 backdrop-blur-md hover:bg-background hover:scale-110 transition-all duration-300 shadow-sm"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-current drop-shadow-md' : 'text-foreground'}`} 
              fill={isFavorite ? "currentColor" : "none"} 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        <div className="p-5">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-xl font-bold text-foreground truncate pr-4">{room.title}</h3>
            <div className="flex items-center text-sm font-semibold">
              <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              4.9
            </div>
          </div>
          <p className="text-muted-foreground text-sm mb-4 truncate tracking-tight">{room.address}, {room.district}, {room.city}</p>
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/50">
            <span className="text-xl font-bold text-foreground">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.price)}
              <span className="text-sm font-normal text-muted-foreground">/tháng</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
