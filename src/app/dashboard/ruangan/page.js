import React from 'react';
import RoomCard from '@/components/RoomCard';

const rooms = [
  {
    id: 1,
    nama: "Lab Komputer Dasar",
    deskripsi: "Komputer i5 Gen 12, RAM 16GB. Cocok untuk praktikum dasar.",
    kapasitas: 30,
    status: "Tersedia",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80" 
  },
  {
    id: 2,
    nama: "Ruang Teori 3.4",
    deskripsi: "Kelas teori standar dengan proyektor HDMI dan AC sentral.",
    kapasitas: 40,
    status: "Tersedia",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
  },
  {
    id: 3,
    nama: "Aula Serbaguna",
    deskripsi: "Kapasitas besar untuk seminar atau kuliah umum gabungan.",
    kapasitas: 120,
    status: "Penuh",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80"
  },
];

export default function RuanganPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header a la Notion */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Daftar Ruangan</h1>
      </div>

      {/* Grid Layout (3 Kolom di layar besar agar mirip gambar referensi) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((item) => (
          <RoomCard key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
}