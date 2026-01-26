import { Zap, ShieldCheck, RefreshCw } from "lucide-react";

const Features = () => {
  const features = [
    {
      title: "Cek Status Ruangan",
      desc: "Pantau ketersediaan ruangan secara real-time. Akses informasi status ruangan dari mana saja dan kapan saja.",
      icon: Zap,
    },
    {
      title: "Jadwal Terjadwal",
      desc: "Sistem otomatis mencegah bentrok jadwal. Kepastian jadwal kelas untuk dosen dan mahasiswa.",
      icon: ShieldCheck,
    },
    {
      title: "Reschedule Mudah",
      desc: "Ada keperluan mendadak? Cari ruangan pengganti dan ajukan dalam hitungan detik.",
      icon: RefreshCw,
    },
  ];

  return (
    <section className="py-24 bg-[#FAFAF9] border-t border-[#E9E9E7]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-[#37352f] mb-3">Fitur Utama</h2>
          <p className="text-[#9B9A97]">Segalanya yang Anda butuhkan untuk mengelola ruangan dengan efisien</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="bg-white p-8 rounded-[4px] border border-[#E9E9E7] hover:border-[#D0CED0] hover:shadow-sm transition"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-[3px] bg-[#FAFAF9] border border-[#E9E9E7] mb-6">
                  <Icon className="w-6 h-6 text-[#37352f]" strokeWidth={1.5} />
                </div>

                <h3 className="text-lg font-semibold text-[#37352f] mb-3">
                  {f.title}
                </h3>

                <p className="text-[#787774] leading-relaxed text-sm">
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
