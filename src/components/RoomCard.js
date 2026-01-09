import React from 'react';
// Menggunakan Next.js Image atau img tag biasa
import Image from 'next/image'; 

const RoomCard = ({ data }) => {
  return (
    <div className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:bg-gray-50 transition-colors cursor-pointer h-full">
      {/* 1. GAMBAR THUMBNAIL (Rasio persegi panjang) */}
      <div className="relative w-full h-40 bg-gray-100">
        <img
          src={data.image}
          alt={data.nama}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 2. KONTEN TENGAH */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-2">
          {/* Judul Ruangan */}
          <h3 className="text-base font-semibold text-gray-900 leading-tight">
            {data.nama}
          </h3>
          
          {/* Ikon Centang Biru (Menandakan Tersedia/Verified) - Persis Referensi */}
          {data.status === 'Tersedia' && (
             <div className="flex-shrink-0 text-blue-500 mt-0.5">
               <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                 <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
               </svg>
             </div>
          )}
        </div>

        {/* Deskripsi Singkat (Opsional, agar tidak kosong) */}
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {data.deskripsi}
        </p>

        {/* 3. INFO BAWAH (Metadata) */}
        <div className="mt-auto pt-2 flex items-center gap-2 text-xs text-gray-500 font-medium">
          {/* Ikon Buku/Gedung kecil */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
             <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
          </svg>
          {/* Teks Kapasitas */}
          <span>{data.kapasitas} Kursi</span>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;