import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white sticky top-0 z-50 border-b border-[#E9E9E7]">
      
      {/* Kiri: Logo ULBI & Menu */}
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-3 font-bold text-xl text-[#37352f]">
          
          {/* LOGO DI SINI */}
          <Image 
            src="/logo-ulbi.png" 
            alt="Logo ULBI"
            width={32}
            height={32}
            className="object-contain" 
          />
          
        </Link>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#787774]">
          <Link href="#" className="hover:text-[#37352f] transition">Beranda</Link>
          <Link href="#" className="hover:text-[#37352f] transition">Tentang</Link>
          <Link href="#" className="hover:text-[#37352f] transition">Kontak</Link>
        </div>
      </div>

      {/* Kanan: Login */}
      <div className="flex items-center gap-3 text-sm font-medium">
        <Link 
          href="/login" 
          className="bg-[#37352f] text-white px-6 py-2 rounded-[4px] hover:bg-[#2e2c28] transition font-semibold"
        >
          Masuk
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;