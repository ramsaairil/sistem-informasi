'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Calendar, 
  Loader2
} from 'lucide-react';

export default function JadwalPage() {
  const [jadwal, setJadwal] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJadwal = async () => {
    try {
      setLoading(true);
      
      // PERBAIKAN DI SINI:
      // 1. Menggunakan 'start_time' (sesuai database)
      // 2. Menggunakan alias relasi 'courses:course_id' agar Supabase paham lewat mana harus join
      const { data, error } = await supabase
        .from('schedules')
        .select(`
          id,
          date,
          start_time,
          lecturer,
          status,
          courses:course_id ( name ),
          rooms:room_id ( name )
        `)
        .order('date', { ascending: true });

      if (error) throw error;
      
      console.log("Data jadwal:", data); // Debugging
      setJadwal(data || []);
      
    } catch (err) {
      console.error('Gagal mengambil data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJadwal();
  }, []);

  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('selesai') || s.includes('completed')) return 'bg-gray-100 text-gray-600';
    if (s.includes('batal') || s.includes('cancelled')) return 'bg-red-100 text-red-600';
    if (s.includes('aktif') || s.includes('active')) return 'bg-green-100 text-green-600 animate-pulse';
    return 'bg-blue-100 text-blue-600';
  };

  return (
    <div className="min-h-screen bg-white text-[#37352f] font-sans">
      {/* CONTAINER UTAMA */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#37352f] mb-1">
            Jadwal
          </h1>
          <p className="text-sm text-[#787774]">
            Daftar semua jadwal kelas yang tersedia.
          </p>
        </div>

        {/* SCHEDULE LIST */}
        <div className="bg-white border border-gray-200 rounded-[4px] overflow-hidden hover:shadow-md transition-shadow duration-200" style={{ boxShadow: "rgba(15, 15, 15, 0.05) 0px 0px 0px 1px inset" }}>
          
          {/* Header List */}
          <div className="px-6 py-4 border-b border-[#E9E9E7] flex justify-between items-center">
            <h2 className="text-base font-semibold text-[#37352f]">
              Semua Jadwal
            </h2>
            <span className="text-sm text-[#787774]">{jadwal.length} kelas</span>
          </div>

          {/* Content */}
          {loading ? (
            <div className="p-8 text-center text-[#9B9A97]">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={16} />
                <span>Memuat jadwal...</span>
              </div>
            </div>
          ) : jadwal.length === 0 ? (
            <div className="p-8 text-center text-[#9B9A97]">
              <Calendar size={32} className="mx-auto mb-2 opacity-20" />
              <p className="text-sm italic">Tidak ada jadwal tersedia</p>
            </div>
          ) : (
            <div className="divide-y divide-[#E9E9E7]">
              {jadwal.map((item) => (
                <div key={item.id} className="p-4 hover:bg-[#F7F7F5] transition-colors group">
                  <div className="flex items-start justify-between gap-4">
                    
                    {/* LEFT: Time & Info */}
                    <div className="flex items-start gap-3 flex-1">
                      
                      {/* Time Badge */}
                      <div className="flex-shrink-0">
                        <div className="text-[10px] font-mono font-bold text-[#37352f] bg-[#E3E2E0] px-2 py-1.5 rounded-[3px] text-center min-w-[75px]">
                          {/* UPDATE: Menggunakan start_time */}
                          {item.start_time?.slice(0, 5) || '--:--'}
                        </div>
                      </div>

                      {/* Course Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-[#37352f] mb-1">
                          {/* Mengambil nama dari relasi courses */}
                          {item.courses?.name || 'Mata Kuliah Tidak Ditemukan'}
                        </h3>
                        
                        <div className="space-y-0.5 text-[11px] text-[#787774]">
                          {/* Lecturer */}
                          {item.lecturer && (
                            <div>Dosen: {item.lecturer}</div>
                          )}
                          
                          {/* Room (Mengambil nama dari relasi rooms) */}
                          {item.rooms?.name && (
                            <div>Ruangan: {item.rooms.name}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* RIGHT: Status Badge */}
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center px-2 py-1 rounded-[3px] text-[10px] font-medium whitespace-nowrap ${getStatusColor(item.status)}`}>
                        {item.status || 'Terjadwal'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}