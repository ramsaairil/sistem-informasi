'use client';

const jadwal = [
  { mk: 'Pemrograman Web', ruang: 'Lab 2', hari: 'Senin' },
  { mk: 'Basis Data', ruang: 'Ruang 301', hari: 'Rabu' },
];

export default function JadwalPage() {
  return (
    <div className="p-10 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Jadwal Kuliah</h1>

      {jadwal.map((j, i) => (
        <div key={i} className="border rounded p-4 mb-3 hover:bg-gray-50">
          <div className="font-medium">{j.mk}</div>
          <div className="text-sm text-gray-500">
            {j.hari} • {j.ruang}
          </div>
        </div>
      ))}
    </div>
  );
}
