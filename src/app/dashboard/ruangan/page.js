'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Building2, X } from 'lucide-react';

export default function RuanganPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('rooms')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;
        setRooms(data);
      } catch (error) {
        console.error("Error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const getStatusColor = (status) => {
    if (status === 'Tersedia') return 'bg-green-100 text-green-700';
    if (status === 'Terpakai') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-white text-[#37352f] font-sans">
      {/* CONTAINER UTAMA */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* --- HEADER --- */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#37352f] mb-1">
            Daftar Ruangan
          </h1>
          <p className="text-sm text-[#787774]">
            Pilih ruangan yang tersedia di bawah ini untuk melihat detail.
          </p>
        </div>

        {/* --- KONTEN GRID --- */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="border border-[#E9E9E7] rounded-[4px] overflow-hidden bg-[#FAFAF9] animate-pulse">
                <div className="h-28 w-full bg-[#E9E9E7]"></div>
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-[#E9E9E7] rounded w-3/4"></div>
                  <div className="h-2 bg-[#E9E9E7] rounded w-full"></div>
                  <div className="h-2 bg-[#E9E9E7] rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="py-10 text-[#9B9A97] italic text-sm">
            Belum ada data ruangan yang tersedia.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className="group flex flex-col border border-[#E9E9E7] rounded-[4px] overflow-hidden hover:bg-[#F7F7F5] cursor-pointer transition-colors duration-200 text-left"
                style={{ boxShadow: "rgba(15, 15, 15, 0.05) 0px 0px 0px 1px inset" }}
              >
                {/* Cover Image */}
                <div className="h-28 w-full bg-[#F7F7F5] relative overflow-hidden border-b border-[#E9E9E7]">
                  {room.image_url ? (
                    <img 
                      src={room.image_url} 
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#F1F1EF]">
                       <Building2 size={20} className="text-[#9B9A97] opacity-40" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-3 flex flex-col gap-2">
                  <h3 className="text-sm font-medium text-[#37352f] leading-snug">
                    {room.name || "Untitled"}
                  </h3>

                  <div className="flex flex-col gap-1.5">
                    <div className="text-[11px] text-[#787774] line-clamp-2 leading-relaxed">
                       {room.description || "No description"}
                    </div>

                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-[3px] text-[10px] font-medium ${getStatusColor(room.status)}`}>
                        {room.status || 'Tersedia'}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* MODAL POPUP */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* BACKDROP WITH BLUR */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedRoom(null)}
          />

          {/* MODAL CONTAINER */}
          <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedRoom(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors z-10 bg-white rounded-full p-1"
            >
              <X size={20} />
            </button>

            {/* Image */}
            <div className="h-64 w-full bg-gray-100 overflow-hidden flex items-center justify-center">
              {selectedRoom.image_url ? (
                <img
                  src={selectedRoom.image_url}
                  alt={selectedRoom.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center text-gray-300">
                  <Building2 size={56} />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedRoom.name}
              </h2>
              
              <div className="mb-6">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedRoom.status)}`}>
                  {selectedRoom.status || 'Tersedia'}
                </span>
              </div>

              {selectedRoom.description && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                    Deskripsi
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {selectedRoom.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}