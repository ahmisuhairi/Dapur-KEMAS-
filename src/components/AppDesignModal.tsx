import React, { useState } from 'react';
import {
  X,
  Palette,
  Table2,
  Image as ImageIcon,
  Layers,
  Smartphone,
  Database,
  ExternalLink,
  ChefHat,
  Sparkles,
  FileSpreadsheet,
  CheckCircle2,
  Grid,
  FileText,
  Sliders,
  Maximize2,
} from 'lucide-react';

interface AppDesignModalProps {
  onClose: () => void;
}

export const AppDesignModal: React.FC<AppDesignModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'screens' | 'tables' | 'design_tokens'>('screens');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const designScreenshots = [
    {
      title: 'Header & Menu Hamburger Navigasi Rasmi',
      desc: 'Reka bentuk bar navigasi atas bersih dengan logo chef Dapur KEMAS, butang hamburger drawer, loceng notifikasi dan pemilih peranan staf.',
      category: 'UI Navigation & Layout',
      path: '/assets/aistudio/IMG_1190_920f02bf.jpeg',
    },
    {
      title: 'Misi, Visi & Teras Pendigitalan KEMAS Perlis',
      desc: 'Paparan kad identiti rasmi Unit PKK KEMAS Negeri Perlis berpandukan Pelan Strategik Pendigitalan Negeri Perlis (2021-2030).',
      category: 'Branding & Policy UI',
      path: '/assets/aistudio/IMG_1191_973b8edf.jpeg',
    },
    {
      title: 'Antara Muka AppSheet & Pengumpulan Data Lapangan',
      desc: 'Paparan integrasi mudah alih AppSheet bagi fasilitator PKK memasukkan resipi pusaka dan data warisan luar bandar secara atas talian mahupun offline.',
      category: 'Mobile & Field Collection',
      path: '/assets/aistudio/IMG_1183_83e13487.jpeg',
    },
    {
      title: 'Borang Pendaftaran Resepi & Kawalan Validasi',
      desc: 'Borang pendaftaran 3 bahagian: Maklumat Asas Kulinari, Ramuan Berkumpulan & Langkah Bergambar dengan kawalan ketat status Draf.',
      category: 'Form UX & Validation',
      path: '/assets/aistudio/IMG_1184_2fb70068.jpeg',
    },
    {
      title: 'Taksonomi Kategori Masakan & Metrik Metadata',
      desc: 'Struktur taksonomi masakan warisan (Tradisional Warisan, Kuih-Muih, Makanan Laut) dan pemetaan etnik Melayu, Siam, Cina.',
      category: 'Taxonomy & Categorization',
      path: '/assets/aistudio/IMG_1185_6c865c10.jpeg',
    },
    {
      title: 'Kad Resepi Warisan & Galeri Interaktif',
      desc: 'Gaya kad moden gelap (dark theme) dengan badge kesukaran, masa persediaan, jumlah hidangan, dan indikator status kelulusan pentadbir.',
      category: 'Catalog & Cards',
      path: '/assets/aistudio/IMG_1187_b99bc2f1.jpeg',
    },
    {
      title: 'Reka Bentuk Format Cetakan PDF 2 Halaman A4',
      desc: 'Susun atur deterministik 2 muka surat tepat: Seksyen 1 (Profil & Ramuan) dan Seksyen 2 (Langkah Memasak & Panduan Pemeliharaan).',
      category: 'Print Architecture & PDF',
      path: '/assets/aistudio/IMG_1188_d9f6263c.png',
    },
    {
      title: 'Print Engine Dialog & Pratonton PDF Cetakan',
      desc: 'Pengesahan pemisahan muka surat (page break) cetakan pada pelayar Safari/Chrome untuk menghasilkan dokumen PDF fizikal berkualiti tinggi.',
      category: 'Print Engine & Export',
      path: '/assets/aistudio/IMG_0332_7a0cc7a4.png',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-[#121212] border border-indigo-500/30 w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0e0e0e] px-6 py-4 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600/20 border border-indigo-500/40 p-2.5 rounded-xl text-indigo-400">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-zinc-100">
                  Seni Bina Reka Bentuk Aplikasi (App Design)
                </h2>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold px-2 py-0.5 rounded-full">
                  Dokumentasi Lengkap
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Unit Pembangunan Komuniti & Pendidikan Kemahiran (PKK), KEMAS Negeri Perlis
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="bg-[#161616] px-6 border-b border-zinc-800 flex gap-2 pt-2.5 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('screens')}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-t border-x transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'screens'
                ? 'bg-[#121212] border-indigo-500/40 text-indigo-300 shadow-lg'
                : 'bg-transparent border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-indigo-400" />
            <span>1. Galeri Imej & Antara Muka UI</span>
          </button>

          <button
            onClick={() => setActiveTab('tables')}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-t border-x transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'tables'
                ? 'bg-[#121212] border-indigo-500/40 text-indigo-300 shadow-lg'
                : 'bg-transparent border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Table2 className="w-4 h-4 text-emerald-400" />
            <span>2. Skema Jadual Relasi Data (Database Tables)</span>
          </button>

          <button
            onClick={() => setActiveTab('design_tokens')}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-t border-x transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'design_tokens'
                ? 'bg-[#121212] border-indigo-500/40 text-indigo-300 shadow-lg'
                : 'bg-transparent border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>3. Sistem Reka Bentuk (Design Tokens & UX)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 flex-grow overflow-y-auto space-y-6">
          {/* ========================================================= */}
          {/* TAB 1: UI SCREENSHOTS GALLERY                             */}
          {/* ========================================================= */}
          {activeTab === 'screens' && (
            <div className="space-y-5">
              <div className="bg-gradient-to-r from-indigo-950/40 via-zinc-900 to-[#161616] p-4.5 rounded-2xl border border-indigo-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Koleksi Tangkapan Skrin Seni Bina Antara Muka (UI Screenshots)
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Visual perancangan dan implementasi sebenar Dapur KEMAS yang merangkumi reka bentuk AppSheet, susun atur kad katalog, borang pendaftaran, dan cetakan PDF 2 muka surat.
                  </p>
                </div>
                <span className="text-[11px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full font-bold self-start md:self-auto shrink-0">
                  {designScreenshots.length} Reka Bentuk Sedia Ada
                </span>
              </div>

              {/* Grid of Screenshots */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {designScreenshots.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-[#181818] border border-zinc-800 hover:border-indigo-500/50 rounded-2xl overflow-hidden transition-all flex flex-col group"
                  >
                    {/* Image Thumbnail with zoom overlay */}
                    <div
                      onClick={() => setSelectedImage(item.path)}
                      className="relative bg-zinc-950 h-44 overflow-hidden cursor-pointer"
                    >
                      <img
                        src={item.path}
                        alt={item.title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3 py-1.5 rounded-xl bg-indigo-600/90 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg backdrop-blur-xs">
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>Buka Imej Penuh</span>
                        </span>
                      </div>
                      <span className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-zinc-300 border border-zinc-700/60">
                        {item.category}
                      </span>
                    </div>

                    {/* Content Meta */}
                    <div className="p-3.5 flex flex-col flex-grow justify-between space-y-2">
                      <div>
                        <h4 className="text-xs font-bold text-zinc-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedImage(item.path)}
                        className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 self-start pt-1 cursor-pointer"
                      >
                        <span>Lihat Terperinci</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: RELATIONAL DATABASE TABLES                         */}
          {/* ========================================================= */}
          {activeTab === 'tables' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-[#161616] p-4.5 rounded-2xl border border-emerald-500/20">
                <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                  <Table2 className="w-4 h-4 text-emerald-400" />
                  Struktur Pangkalan Data Hubungan (Relational Schema)
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Struktur ternormalisasi 8 jadual yang menjamin integriti data, mengelakkan had sel 10 juta Google Sheets, dan mematuhi model hubungan kunci asing (Foreign Keys).
                </p>
              </div>

              {/* Table 1: ResepiMaster */}
              <div className="bg-[#181818] rounded-2xl border border-zinc-800 overflow-hidden space-y-2 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    <strong className="text-zinc-100 text-sm">1. Jadual: ResepiMaster (Entiti Induk)</strong>
                  </div>
                  <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                    17 Lajur · PK: ID_Resepi
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-400 font-bold bg-[#141414]">
                        <th className="py-2 px-3">Nama Lajur (Field)</th>
                        <th className="py-2 px-3">Jenis Data</th>
                        <th className="py-2 px-3">Sifat / Integriti</th>
                        <th className="py-2 px-3">Keterangan / Contoh Nilai</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 text-zinc-300 font-mono text-[11px]">
                      <tr>
                        <td className="py-1.5 px-3 text-amber-400 font-bold">ID_Resepi</td>
                        <td className="py-1.5 px-3 text-zinc-400">Text</td>
                        <td className="py-1.5 px-3 text-emerald-400">Primary Key (PK)</td>
                        <td className="py-1.5 px-3 font-sans text-zinc-300">Pengenal unik, cth: RSP-001</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 text-zinc-100 font-bold">Nama_Resepi</td>
                        <td className="py-1.5 px-3 text-zinc-400">Text</td>
                        <td className="py-1.5 px-3 text-rose-400">Required</td>
                        <td className="py-1.5 px-3 font-sans text-zinc-300">Tajuk kulinari warisan, cth: Laksa Perlis Asli Warisan</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 text-zinc-100">Kategori_Masakan</td>
                        <td className="py-1.5 px-3 text-zinc-400">Ref / Enum</td>
                        <td className="py-1.5 px-3 text-indigo-400">FK -&gt; Kategori_Masakan</td>
                        <td className="py-1.5 px-3 font-sans text-zinc-300">Tradisional Warisan, Kuih-Muih, dll</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 text-zinc-100">Etnik_Kaum</td>
                        <td className="py-1.5 px-3 text-zinc-400">Ref / Enum</td>
                        <td className="py-1.5 px-3 text-indigo-400">FK -&gt; Etnik_Kaum</td>
                        <td className="py-1.5 px-3 font-sans text-zinc-300">Melayu, Siam, Cina, dll</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 text-zinc-100">Negeri_Asal</td>
                        <td className="py-1.5 px-3 text-zinc-400">Ref / Enum</td>
                        <td className="py-1.5 px-3 text-indigo-400">FK -&gt; Negeri_Asal</td>
                        <td className="py-1.5 px-3 font-sans text-zinc-300">Perlis, Kedah, Pulau Pinang, dll</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 text-zinc-100">Status</td>
                        <td className="py-1.5 px-3 text-zinc-400">Enum</td>
                        <td className="py-1.5 px-3 text-amber-400">Draf | Diterbitkan</td>
                        <td className="py-1.5 px-3 font-sans text-zinc-300">Hanya Admin boleh ubah kepada 'Diterbitkan'</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 text-zinc-100">Fail_PDF_Cookbook</td>
                        <td className="py-1.5 px-3 text-zinc-400">Text (Path)</td>
                        <td className="py-1.5 px-3 text-zinc-500">Optional</td>
                        <td className="py-1.5 px-3 font-sans text-zinc-300">Lokasi nama fail PDF Cookbook dijana atas permintaan</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 text-zinc-100">Dicipta_Oleh</td>
                        <td className="py-1.5 px-3 text-zinc-400">Email</td>
                        <td className="py-1.5 px-3 text-indigo-400">FK -&gt; Pengguna.Emel</td>
                        <td className="py-1.5 px-3 font-sans text-zinc-300">Emel akaun staf yang mendaftar resipi</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Table 2 & 3: BahanResepi & LangkahResepi (Sub-Details) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* BahanResepi */}
                <div className="bg-[#181818] rounded-2xl border border-zinc-800 p-4 space-y-2">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <strong className="text-zinc-100 text-xs sm:text-sm">
                      2. Jadual: BahanResepi (Ramuan)
                    </strong>
                    <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                      Relasi: N -&gt; 1 ResepiMaster
                    </span>
                  </div>
                  <ul className="text-xs space-y-1.5 text-zinc-300 font-mono">
                    <li>• <strong className="text-amber-400">ID_Bahan</strong> (PK): Text UUID</li>
                    <li>• <strong className="text-indigo-400">ID_Resepi</strong> (FK): Hubung ke ResepiMaster</li>
                    <li>• <strong className="text-zinc-100">Kumpulan_Bahan</strong>: Text (Bahan Utama, Rempah Kisar, dll)</li>
                    <li>• <strong className="text-zinc-100">Nama_Bahan</strong>: Text (cth: Isi Ikan Kembung)</li>
                    <li>• <strong className="text-zinc-100">Kuantiti</strong>: Number (cth: 500)</li>
                    <li>• <strong className="text-zinc-100">Unit</strong>: Text (gram, ekor, sudu makan, dll)</li>
                    <li>• <strong className="text-zinc-100">Turutan</strong>: Number turutan susunan</li>
                  </ul>
                </div>

                {/* LangkahResepi */}
                <div className="bg-[#181818] rounded-2xl border border-zinc-800 p-4 space-y-2">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <strong className="text-zinc-100 text-xs sm:text-sm">
                      3. Jadual: LangkahResepi (Arahan)
                    </strong>
                    <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                      Relasi: N -&gt; 1 ResepiMaster
                    </span>
                  </div>
                  <ul className="text-xs space-y-1.5 text-zinc-300 font-mono">
                    <li>• <strong className="text-amber-400">ID_Langkah</strong> (PK): Text UUID</li>
                    <li>• <strong className="text-indigo-400">ID_Resepi</strong> (FK): Hubung ke ResepiMaster</li>
                    <li>• <strong className="text-zinc-100">Nombor_Langkah</strong>: Number turutan berturutan (1, 2, 3...)</li>
                    <li>• <strong className="text-zinc-100">Tajuk_Langkah</strong>: Text frasa ringkas</li>
                    <li>• <strong className="text-zinc-100">Arahan</strong>: LongText perenggan penjelasan</li>
                    <li>• <strong className="text-zinc-100">Gambar_Langkah</strong>: Text Image URL / Path</li>
                    <li>• <strong className="text-zinc-100">Masa_Minit</strong>: Number anggaran masa</li>
                  </ul>
                </div>
              </div>

              {/* Table 4 & 5: Pengguna & MasterData */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Pengguna Table */}
                <div className="bg-[#181818] rounded-2xl border border-zinc-800 p-4 space-y-2">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <strong className="text-zinc-100 text-xs sm:text-sm">
                      4. Jadual: Pengguna (Kawalan Akses RBAC)
                    </strong>
                    <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                      Matriks Keselamatan
                    </span>
                  </div>
                  <ul className="text-xs space-y-1.5 text-zinc-300 font-mono">
                    <li>• <strong className="text-amber-400">Emel</strong> (PK): Alamat emel staf rasmi (@kemas.gov.my)</li>
                    <li>• <strong className="text-zinc-100">Nama</strong>: Nama penuh staf atau jawatan</li>
                    <li>• <strong className="text-emerald-400">Role</strong>: Enum ('Admin' | 'Penyumbang' | 'Pengguna')</li>
                    <li>• <strong className="text-blue-400">Password</strong>: Kata laluan pengguna (Default: 'kemas123')</li>
                    <li>• <strong className="text-zinc-100">Aktif</strong>: Boolean (TRUE/FALSE) status akaun</li>
                  </ul>
                </div>

                {/* MasterData Taxonomy */}
                <div className="bg-[#181818] rounded-2xl border border-zinc-800 p-4 space-y-2">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <strong className="text-zinc-100 text-xs sm:text-sm">
                      5. Jadual: Master Data Taksonomi (4 Jadual Rujukan)
                    </strong>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Lookup Sheets
                    </span>
                  </div>
                  <div className="text-xs space-y-1.5 text-zinc-300 font-mono">
                    <p>• <strong className="text-emerald-400">Kategori_Masakan:</strong> Nama, Aktif</p>
                    <p>• <strong className="text-emerald-400">Etnik_Kaum:</strong> Nama, Aktif</p>
                    <p>• <strong className="text-emerald-400">Negeri_Asal:</strong> Nama, Aktif</p>
                    <p>• <strong className="text-emerald-400">Jenis_Hidangan:</strong> Nama, Aktif</p>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans pt-1">
                    Hanya akaun peranan Admin yang dibenarkan menambah dan mengaktifkan / menyahaktifkan pilihan dalam menu rujukan ini.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: DESIGN SYSTEM & TOKENS                             */}
          {/* ========================================================= */}
          {activeTab === 'design_tokens' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-amber-950/40 via-zinc-900 to-[#161616] p-4.5 rounded-2xl border border-amber-500/20">
                <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  Sistem Reka Bentuk UI/UX (Design System Tokens)
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Prinsip penggayaan berasaskan kontras tinggi, estetik kerajaan moden, dan reka letak mesra skrin sentuh (Mobile-First responsive breakpoints).
                </p>
              </div>

              {/* Color Tokens */}
              <div className="bg-[#181818] p-4.5 rounded-2xl border border-zinc-800 space-y-3">
                <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                  Palet Warna & Identiti Visual Dapur KEMAS
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#0a0a0a] border border-zinc-800 space-y-1">
                    <div className="w-6 h-6 rounded-lg bg-[#0a0a0a] border border-zinc-700"></div>
                    <div className="font-bold text-zinc-100">Surface Dark</div>
                    <div className="text-[10px] text-zinc-400 font-mono">#0a0a0a / #121212</div>
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-1">
                    <div className="w-6 h-6 rounded-lg bg-indigo-600"></div>
                    <div className="font-bold text-indigo-300">Primary Brand</div>
                    <div className="text-[10px] text-zinc-400 font-mono">Indigo 600 (#4f46e5)</div>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-1">
                    <div className="w-6 h-6 rounded-lg bg-amber-500"></div>
                    <div className="font-bold text-amber-300">Accent Culinary</div>
                    <div className="text-[10px] text-zinc-400 font-mono">Amber 500 (#f59e0b)</div>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500"></div>
                    <div className="font-bold text-emerald-300">Status Validated</div>
                    <div className="text-[10px] text-zinc-400 font-mono">Emerald 500 (#10b981)</div>
                  </div>
                </div>
              </div>

              {/* 2-Page PDF Cookbook Spec */}
              <div className="bg-[#181818] p-4.5 rounded-2xl border border-zinc-800 space-y-3">
                <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  Spesifikasi Reka Bentuk Cetakan PDF 2 Muka Surat A4
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-300">
                  <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 space-y-1">
                    <strong className="text-amber-400 block font-bold">
                      Muka Surat 1 (Seksyen 1): Profil & Ramuan Lengkap
                    </strong>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Kepala surat rasmi Unit PKK KEMAS Negeri Perlis, tajuk masakan, metadata hidangan (masa penyediaan, masa memasak, bilangan sajian), foto kulinari berkualiti tinggi, dan senarai ramuan sukatan berkumpulan.
                    </p>
                  </div>
                  <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 space-y-1">
                    <strong className="text-indigo-400 block font-bold">
                      Muka Surat 2 (Seksyen 2): Langkah Penyediaan & Panduan
                    </strong>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Langkah-langkah penyediaan terperinci berturutan nombor, anggaran masa setiap langkah, petua memasak warisan, dan ruangan nota kualiti kulinari.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#0e0e0e] px-6 py-3.5 border-t border-zinc-800 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
            <ChefHat className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Dokumentasi Seni Bina Reka Bentuk • Dapur KEMAS Negeri Perlis</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>

      {/* Lightbox Modal for Full Screenshot */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-zinc-700 shadow-2xl">
            <img
              src={selectedImage}
              alt="Pratonton Penuh Reka Bentuk"
              className="max-h-[85vh] w-auto object-contain mx-auto"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/70 hover:bg-black text-white cursor-pointer"
              title="Tutup Pratonton"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
