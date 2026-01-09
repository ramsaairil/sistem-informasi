import { Zap, ShieldCheck, RefreshCw } from "lucide-react";

const Features = () => {
  const features = [
    {
      title: "Cek Status",
      desc: "Tidak perlu lagi berjalan ke ruangan untuk memastikan kosong atau isi. Lihat status ruangan langsung dari smartphone Anda.",
      icon: Zap,
    },
    {
      title: "Jadwal Anti Bentrok",
      desc: "Sistem otomatis menolak pengajuan di jam yang sama. Kepastian jadwal bagi Dosen dan Mahasiswa.",
      icon: ShieldCheck,
    },
    {
      title: "Reschedule",
      desc: "Ada keperluan mendadak? Cari ruangan pengganti yang kosong dan ajukan dalam hitungan detik.",
      icon: RefreshCw,
    },
  ];

  return (
    <section className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 mb-6">
                  <Icon className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
                </div>

                <h3 className="text-xl font-semibold text-black mb-3">
                  {f.title}
                </h3>

                <p className="text-gray-600 leading-relaxed text-sm">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
