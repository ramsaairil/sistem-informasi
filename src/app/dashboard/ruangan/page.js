'use client';

import React, { useEffect, useState } from 'react';
import RoomCard from '@/components/RoomCard';
import { supabase } from '@/lib/supabase';

export default function RuanganPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        // PENTING: Mengambil data dari tabel 'rooms'
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Daftar Ruangan</h1>
        <p className="text-gray-500">
          Cek ketersediaan ruangan kampus di sini.
        </p>
      </div>

      {/* Konten */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="text-center py-20 text-gray-500">
            Sedang memuat data ruangan...
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-20 text-gray-400 border-2 border-dashed rounded-lg">
            Belum ada data ruangan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((item) => (
              <RoomCard key={item.id} data={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}