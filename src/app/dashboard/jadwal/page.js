'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function JadwalPage() {
  // Hanya butuh state untuk menampung data & loading
  const [jadwal, setJadwal] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FUNCTION: HANYA AMBIL DATA (READ ONLY) ---
  const fetchJadwal = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      setJadwal(data);
    } catch (err) {
      console.error('Gagal mengambil data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJadwal();
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Jadwal Perkuliahan</h1>
          <p className="text-gray-500 mt-1">
            Informasi jadwal dosen.
          </p>
        </div>
      </div>

      {/* --- TABEL DATA --- */}
      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Ruangan</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Hari</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Jam</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Mata Kuliah</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Dosen</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                  Sedang memuat data...
                </td>
              </tr>
            ) : jadwal.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                  Belum ada jadwal saat ini.
                </td>
              </tr>
            ) : (
              jadwal.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.ruangan}</td>
                  <td className="px-4 py-3">{item.hari}</td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                    {item.jam_mulai?.slice(0, 5)} - {item.jam_selesai?.slice(0, 5)}
                  </td>
                  <td className="px-4 py-3">{item.matkul}</td>
                  <td className="px-4 py-3">{item.dosen}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        item.status === 'Terpakai'
                          ? 'bg-red-50 text-red-600 border border-red-100'
                          : 'bg-green-50 text-green-600 border border-green-100'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}