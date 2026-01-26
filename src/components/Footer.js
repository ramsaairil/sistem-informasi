import Image from "next/image";
import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-[#E9E9E7] py-12 px-6 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 text-sm">

        {/* Kiri: Identitas & Copyright */}
        <div className="flex flex-col gap-2">
          {/* Logo Gambar */}
          <div className="w-20 h-20 relative">
            <Image
              src="/footer.png"  
              alt="Logo ULBI"
              fill                 
              className="object-contain" 
            />
          </div>
          <p className="text-[#9B9A97]">
            © {new Date().getFullYear()} Prodi D3 Teknik Informatika.<br className="hidden md:block" /> Universitas Logistik dan Bisnis Internasional.
          </p>
        </div>

        {/* Kanan: Link Penting / Kontak */}
        <div className="flex flex-wrap gap-8 text-[#787774]">
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold text-[#37352f]">Bantuan</h4>
            <Link href="#" className="hover:text-[#37352f] transition">Lupa Password?</Link>
            <Link href="#" className="hover:text-[#37352f] transition">Hubungi Admin Prodi</Link>
            <Link href="#" className="hover:text-[#37352f] transition">Panduan Penggunaan</Link>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="font-semibold text-[#37352f]">Lokasi</h4>
            <p className="text-[#9B9A97] max-w-[200px] leading-relaxed">
              Jl. Sariasih No. 54 Sarijadi,<br />
              Bandung, 40151
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;