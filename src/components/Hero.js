import Image from 'next/image'; 
import Link from 'next/link';
import React from 'react';

const Hero = () => {
  return (
    <section className="flex flex-col items-center justify-center pt-12 pb-24 px-4 bg-white text-center max-w-5xl mx-auto">

      {/* 1. Ilustrasi Visual */}
      <div className="max-w-lg mx-auto mb-8 -mt-4">
        <Image
          src="/landing.png"
          alt="Preview dashboard"
          width={800}
          height={400}
          priority
          className="w-full h-auto object-contain"
        />
      </div>

      {/* 2. Headline Utama */}
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-black mb-6 leading-[1.1]">
        Sistem Informasi
      </h1>

      {/* 3. Subheadline */}
      <p className="text-lg md:text-xl text-gray-600 max-w-3xl mb-10 leading-relaxed">
        Sistem informasi khusus <strong>Prodi D3 Teknik Informatika ULBI</strong>.
        Cek ketersediaan ruangan secara <em>real-time</em>, ajukan kelas pengganti tanpa tanya admin,
        dan pastikan kegiatan belajar mengajar berjalan tanpa hambatan.
      </p>

      {/* 4. Call to Action */}
      <div className="flex flex-col sm:flex-row gap-4 items-center w-full justify-center">
        <Link
          href="/auth/login"
          className="bg-black text-white px-8 py-3 rounded-[5px] font-semibold text-lg hover:bg-gray-700 transition w-full sm:w-auto"
        >
          Mulai Sekarang
        </Link>

        <Link
          href="/jadwal"
          className="bg-gray-100 text-gray-700 px-8 py-3 rounded-[5px] font-semibold text-lg hover:bg-gray-200 transition w-full sm:w-auto"
        >
          Lihat Jadwal
        </Link>
      </div>

    </section>
  );
};

export default Hero;