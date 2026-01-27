'use client'; // 1. Wajib tambahkan ini di baris paling atas

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/navigation'; // Untuk navigasi manual
import { useAuth } from '@/context/AuthContext'; // Import context auth Anda

const Hero = () => {
  const router = useRouter();
  
  // 2. Ambil status user dari Context (sesuaikan dengan nama variable di context Anda)
  // Bisa berupa 'user', 'session', atau 'isAuthenticated'
  const { user } = useAuth(); 

  // 3. Fungsi untuk menangani klik tombol Jadwal
  const handleJadwalClick = (e) => {
    e.preventDefault(); // Mencegah perilaku default Link

    if (user) {
      // Jika sudah login, pergi ke dashboard
      router.push('/dashboard/jadwal');
    } else {
      // Jika belum login, lempar ke login
      // Opsional: Bawa parameter 'next' agar setelah login otomatis balik ke jadwal
      router.push('/login?next=/dashboard/jadwal'); 
    }
  };

  return (
    <section className="flex flex-col items-center justify-center pt-16 pb-24 px-4 bg-white text-center max-w-5xl mx-auto">

      {/* 1. Ilustrasi Visual (Tetap sama) */}
      <div className="max-w-lg mx-auto mb-8">
        <Image
          src="/landing.png"
          alt="Preview dashboard"
          width={800}
          height={400}
          priority
          className="w-full h-auto object-contain"
        />
      </div>

      {/* 2. Headline (Tetap sama) */}
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#37352f] mb-6 leading-[1.2]">
        Sistem Informasi
      </h1>

      {/* 3. Subheadline (Tetap sama) */}
      <p className="text-lg md:text-lg text-[#787774] max-w-3xl mb-10 leading-relaxed">
        Platform manajemen ruangan untuk <strong className="text-[#37352f]">Prodi D3 Teknik Informatika ULBI</strong>.
        Cek ketersediaan ruangan secara real-time, ajukan jadwal pengganti, dan kelola peminjaman dengan mudah.
      </p>

      {/* 4. Call to Action */}
      <div className="flex flex-col sm:flex-row gap-4 items-center w-full justify-center">
        {/* Tombol Login (Tetap sama) */}
        <Link
          href="/login"
          className="bg-[#37352f] text-white px-8 py-3 rounded-[4px] font-semibold text-base hover:bg-[#2e2c28] transition w-full sm:w-auto"
        >
          Mulai Sekarang
        </Link>

        {/* Tombol Lihat Jadwal (DIMODIFIKASI) */}
        {/* Kita ganti Link jadi button atau tetap Link dengan onClick handler */}
        <button
          onClick={handleJadwalClick}
          className="border-2 border-[#E9E9E7] text-[#37352f] px-8 py-3 rounded-[4px] font-semibold text-base hover:bg-[#FAFAF9] transition w-full sm:w-auto"
        >
          Lihat Jadwal
        </button>
      </div>

    </section>
  );
};

export default Hero;