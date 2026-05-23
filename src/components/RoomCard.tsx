import React from 'react';
import { Star, Shield, Wifi, Tv, Coffee, User, Wind, Snowflake, CheckCircle } from 'lucide-react';
import { Room } from '../types';

interface RoomCardProps {
  key?: string | number;
  room: Room;
  onBook: (room: Room) => void;
  onViewDetails: (room: Room) => void;
}

export default function RoomCard({ room, onBook, onViewDetails }: RoomCardProps) {
  // Map standard amenities to specialized icons
  const getAmenityIcon = (amenity: string) => {
    const lower = amenity.toLowerCase();
    if (lower.includes('wifi')) return <Wifi className="h-4 w-4 text-amber-500" />;
    if (lower.includes('tv')) return <Tv className="h-4 w-4 text-amber-500" />;
    if (lower.includes('ac') || lower.includes('condition')) return <Snowflake className="h-4 w-4 text-amber-500" />;
    if (lower.includes('hot water')) return <Wind className="h-4 w-4 text-amber-500" />;
    return <Coffee className="h-4 w-4 text-amber-500" />;
  };

  return (
    <div className="group relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:border-amber-500/30 flex flex-col h-full transform hover:-translate-y-1">
      {/* Absolute Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <span className={`px-2.5 py-1 text-xs uppercase tracking-wider font-bold rounded-md shadow-md ${
          room.ac 
            ? 'bg-amber-500 text-slate-950 font-sans' 
            : 'bg-slate-800 text-slate-300'
        }`}>
          {room.ac ? 'Air Conditioned' : 'Non-AC Standard'}
        </span>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-md text-amber-400 font-bold px-2 py-1 rounded text-xs">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span>{room.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Room Image Carousel Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
        <img
          src={room.images[0] || "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <p className="text-amber-500/90 font-mono text-xs tracking-widest uppercase font-bold">Room {room.roomNumber}</p>
          <div className="text-right">
            <span className="text-amber-400 text-lg font-bold font-serif">₹{room.price}</span>
            <span className="text-slate-300 text-xs font-sans"> / Night</span>
          </div>
        </div>
      </div>

      {/* Contents */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-3">
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold">
            {room.type} Suite
          </span>
          <h3 className="font-serif text-lg font-bold text-slate-100 mt-1 line-clamp-1 group-hover:text-amber-400 transition-colors">
            {room.name}
          </h3>
        </div>

        {/* Capacity Details */}
        <div className="flex items-center gap-4 text-xs text-slate-400 mb-4 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
          <div className="flex items-center gap-1.5">
            <User className="h-4 w-4 text-slate-400" />
            <span>Capacity: {room.capacity} {room.capacity > 1 ? 'Guests' : 'Guest'}</span>
          </div>
          <div className="h-3 w-px bg-slate-700" />
          <div className="flex items-center gap-1 text-emerald-400">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            <span>Instant booking</span>
          </div>
        </div>

        {/* Short Amenity list previews */}
        <div className="mb-6 flex-grow">
          <p className="text-[10px] uppercase tracking-wider font-mono text-slate-400 font-bold mb-2">Amenities included:</p>
          <div className="flex flex-wrap gap-2">
            {room.amenities.slice(0, 4).map((amen, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1 bg-slate-800 text-[11px] text-slate-300 px-2 py-1 rounded-md border border-slate-700/50"
              >
                {getAmenityIcon(amen)}
                <span>{amen}</span>
              </span>
            ))}
            {room.amenities.length > 4 && (
              <span className="bg-slate-950/60 text-[10px] text-amber-500 px-2 py-1 rounded-md font-mono self-center font-bold">
                +{room.amenities.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Click Action Footers */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <button
            onClick={() => onViewDetails(room)}
            className="w-full text-center py-2.5 rounded-lg border border-slate-700 hover:border-amber-500/30 text-slate-300 text-xs font-bold font-sans hover:bg-slate-800 transition-all active:scale-95"
          >
            Details & Facilities
          </button>
          <button
            onClick={() => onBook(room)}
            className="w-full text-center py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold font-sans transition-all active:scale-95 shadow-md shadow-amber-500/5"
          >
            Reserve Now
          </button>
        </div>
      </div>
    </div>
  );
}
