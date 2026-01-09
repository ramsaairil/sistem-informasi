import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white sticky top-0 z-50 border-b border-gray-100">
      
      {/* Kiri: Logo ULBI & Menu */}
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-3 font-bold text-xl text-gray-900">
          
          {/* LOGO DI SINI */}
          <Image 
            src="/logo-ulbi.png" 
            alt="Logo ULBI"
            width={32}
            height={32}
            className="object-contain" 
          />
          
        </Link>

        {/* ... (Menu) ... */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="#" className="hover:text-black transition">Beranda</Link>
          <Link href="#" className="hover:text-black transition">Tentang</Link>
          <Link href="#" className="hover:text-black transition">Kontak</Link>
        </div>
      </div>

      {/* Kanan: Login */}
      <div className="flex items-center gap-3 text-sm font-medium">
        <Link 
          href="/auth/login" 
          className="bg-black text-white px-6 py-2 rounded-[5px] hover:bg-gray-800 transition font-semibold"
        >
          Masuk
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;