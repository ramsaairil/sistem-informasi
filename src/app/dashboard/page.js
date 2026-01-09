'use client';

export default function DashboardPage() {
  return (
    <div className="max-w-5xl mx-auto p-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Jadwal Hari Ini" value="2 Mata Kuliah" />
        <Card title="Pemesanan Aktif" value="1 Ruangan" />
        <Card title="Notifikasi" value="1 Pesan" />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-xl font-semibold">{value}</h3>
    </div>
  );
}
