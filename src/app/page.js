import Image from "next/image";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black font-sans">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}
