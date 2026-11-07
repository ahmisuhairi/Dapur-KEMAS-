import React, { useState } from 'react';
import {
  Smartphone,
  X,
  ExternalLink,
  Layers,
  Sparkles,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Monitor,
  Eye,
  Sliders,
  ShieldCheck,
  FileText,
  Share2,
} from 'lucide-react';

interface PhoneMockupModalProps {
  onClose: () => void;
  onActivatePhoneSimulator: () => void;
  isSimulatorActive?: boolean;
}

export const PhoneMockupModal: React.FC<PhoneMockupModalProps> = ({
  onClose,
  onActivatePhoneSimulator,
  isSimulatorActive = false,
}) => {
  const [selectedMockup, setSelectedMockup] = useState<'hand' | 'duo'>('hand');

  // Generated mockup images
  const mockups = {
    hand: {
      id: 'hand',
      title: 'Mockup 1: Paparan Telefon Dalam Genggaman',
      subtitle: 'iPhone 16 Pro OLED • Resepi Warisan Perlis & Kad Masakan',
      src: '/src/assets/images/phone_mockup_dapur_1793629379785.jpg',
      aspect: 'aspect-[9/16]',
      description:
        'Mockup peranti telefon pintar memaparkan antaramuka pengguna Dapur KEMAS yang responsif. Menampilkan foto masakan asli Rendang Daging Warisan Perlis, tag kategori, masa penyediaan, dan bar navigasi mudah alih yang mesra ibu jari.',
    },
    duo: {
      id: 'duo',
      title: 'Mockup 2: Dwi-Peranti di Ruang Meja Dapur',
      subtitle: 'Papan Pemuka (Dashboard) & Halaman Perincian Resepi Penuh',
      src: '/src/assets/images/phone_mockup_duo_1793629396537.jpg',
      aspect: 'aspect-[16/9]',
      description:
        'Mockup komersial dwi-telefon di atas meja masakan KEMAS dengan rempah ratus warisan. Menunjukkan aliran lengkap daripada pemilihan kategori masakan di Papan Pemuka sehingga senarai ramuan dan langkah penyediaan terperinci.',
    },
  };

  const activeData = mockups[selectedMockup];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#121212] border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#171717] border-b border-zinc-800 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-900/40">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-white">
                  Mockup Peranti Telefon Pintar (Mobile Preview)
                </h2>
                <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Dapur KEMAS
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Visualisasi reka bentuk mudah alih & mod simulator interaktif untuk seluruh aplikasi.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onActivatePhoneSimulator();
                onClose();
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                isSimulatorActive
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-900/40'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-900/40'
              }`}
              title="Aktifkan bingkai telefon interaktif di skrin langsung"
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isSimulatorActive ? 'Simulasi Aktif' : 'Uji Bingkai Telefon Langsung'}
              </span>
              <span className="sm:hidden">Uji Telefon</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Mockup Selector Tabs */}
          <div className="flex flex-wrap gap-2.5 bg-[#0e0e0e] p-1.5 rounded-2xl border border-zinc-800">
            <button
              onClick={() => setSelectedMockup('hand')}
              className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                selectedMockup === 'hand'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-900/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Mockup Genggaman Telefon (Vertikal)</span>
            </button>

            <button
              onClick={() => setSelectedMockup('duo')}
              className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                selectedMockup === 'duo'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-900/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Mockup Dwi-Telefon Meja Dapur (Papan Pemuka & Resepi)</span>
            </button>
          </div>

          {/* Active Mockup Display Card */}
          <div className="bg-[#0b0b0b] rounded-3xl border border-zinc-800 p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-center">
            {/* Visual Frame */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="relative group max-h-[580px] rounded-2xl overflow-hidden border border-zinc-800/80 shadow-2xl bg-zinc-950 flex items-center justify-center">
                <img
                  src={activeData.src}
                  alt={activeData.title}
                  className="w-full max-h-[560px] object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[11px] text-zinc-300 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Fotorealistik HD</span>
                </div>
              </div>
            </div>

            {/* Details & Specs Column */}
            <div className="w-full lg:w-1/2 space-y-4">
              <div>
                <span className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">
                  Koleksi Reka Bentuk Mudah Alih
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {activeData.title}
                </h3>
                <p className="text-xs font-semibold text-zinc-400 mt-1">
                  {activeData.subtitle}
                </p>
                <p className="text-xs text-zinc-300 mt-3 leading-relaxed">
                  {activeData.description}
                </p>
              </div>

              {/* Mobile Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                <div className="p-3 rounded-2xl bg-[#161616] border border-zinc-800">
                  <div className="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Viewport Telefon Pintar</span>
                  </div>
                  <div className="text-sm font-extrabold text-zinc-100 mt-1">
                    390 x 844 px (iPhone / Galaxy)
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    Diskalakan responsif dengan zon sentuhan ibu jari.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-[#161616] border border-zinc-800">
                  <div className="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Mod Gelap OLED</span>
                  </div>
                  <div className="text-sm font-extrabold text-zinc-100 mt-1">
                    Jimat Bateri & Kontras Tinggi
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    Latar belakang hitam tulen dan aksen rempah emas.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-[#161616] border border-zinc-800">
                  <div className="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Navigasi Bawah Telefon</span>
                  </div>
                  <div className="text-sm font-extrabold text-zinc-100 mt-1">
                    Bottom Navigation Bar
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    Akses pantas ke Utama, Resepi, Tambah, & Tetapan.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-[#161616] border border-zinc-800">
                  <div className="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                    <span>Jana PDF Dari Telefon</span>
                  </div>
                  <div className="text-sm font-extrabold text-zinc-100 mt-1">
                    Cookbook Muat Turun Segera
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    Format kad A4 berkualiti tinggi terus ke peranti.
                  </p>
                </div>
              </div>

              {/* Call-to-action button */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={() => {
                    onActivatePhoneSimulator();
                    onClose();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50 transition-all cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>
                    {isSimulatorActive
                      ? 'Kekalkan Mod Simulasi Telefon'
                      : 'Buka Seluruh Aplikasi Dalam Bingkai Telefon'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Comparison Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#151515] to-[#121212] border border-zinc-800">
            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Ciri-ciri Mesra Telefon Pintar (Mobile-First Engineering)</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-black/40 border border-zinc-800/80">
                <span className="font-extrabold text-indigo-300 block mb-1">
                  1. Sentuhan Mudah & Tangan Tunggal
                </span>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Semua butang penting terletak dalam zon capaian ibu jari, memudahkan suri rumah atau tenaga pengajar KEMAS memasak sambil merujuk telefon.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-zinc-800/80">
                <span className="font-extrabold text-emerald-300 block mb-1">
                  2. Kad Resepi Kompak & Ikonik
                </span>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Foto makanan tradisional bersaiz optimum dengan label masa memasak, tahap kesukaran, dan status draf/terbit yang mudah dibaca sepintas lalu.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-zinc-800/80">
                <span className="font-extrabold text-purple-300 block mb-1">
                  3. PWA & Akses Luar Talian
                </span>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Boleh dipasang ke skrin utama telefon pintar seperti aplikasi asli (native app) dengan cache pantas dan sokongan skrin penuh.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#141414] border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-indigo-400" />
            <span>Unit PKK KEMAS Negeri Perlis • Digital Heritage Culinary App</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
