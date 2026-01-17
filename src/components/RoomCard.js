import React from 'react';

export default function RoomCard({ data }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      {/* Bagian Gambar */}
      <div className="relative h-48 w-full bg-gray-200">
        {data.image ? (
          <img
            src={data.image}
            alt={data.nama}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        
        {/* Badge Status */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
              data.status === 'Tersedia'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {data.status}
          </span>
        </div>
      </div>

      {/* Bagian Info */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {data.nama}
        </h3>
        
        <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-grow">
          {data.deskripsi}
        </p>

        <div className="mt-auto"> 
          <button className="w-full py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors">
            Lihat Detail
          </button>
        </div>
        
      </div>
    </div>
  );
}