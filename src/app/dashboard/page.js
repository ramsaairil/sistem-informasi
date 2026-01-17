'use client';

export default function DashboardPage() {
  
}

function Card({ title, value }) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-xl font-semibold">{value}</h3>
    </div>
  );
}
