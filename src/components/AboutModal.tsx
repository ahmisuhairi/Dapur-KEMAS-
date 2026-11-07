import React from 'react';
import {
  X,
  ChefHat,
  Landmark,
  Zap,
  Smartphone,
  ShieldCheck,
  Award,
  Sparkles,
  Database,
  Layers,
  Compass,
  CheckCircle2,
  Lock,
  ArrowRight,
  Cpu,
  FileSpreadsheet,
  BookOpen,
  Users,
  Printer,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AboutModalProps {
  onClose: () => void;
  onOpenGasModal?: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  onClose,
  onOpenGasModal,
}) => {
  const { isAdmin } = useApp();

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-[#111111] rounded-3xl shadow-2xl max-w-5xl w-full my-auto overflow-hidden border border-zinc-800 flex flex-col max-h-[95vh]">
        {/* ================================================================= */}
        {/* HEADER: KEMAS NEGERI PERLIS OFFICIAL IDENTITY                     */}
        {/* ================================================================= */}
        <div className="bg-[#0b0b0b] px-6 py-4 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3.5">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-950/50">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base sm:text-lg text-zinc-100 tracking-tight">
                  Dokumentasi Lengkap Dapur KEMAS
                </h2>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  Unit PKK Perlis
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold font-mono">
                  V1.00
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Unit Pembangunan Komuniti & Pendidikan Kemahiran • Jabatan Kemajuan Masyarakat Negeri Perlis
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Tutup Halaman"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================================================================= */}
        {/* CONTINUOUS SCROLLABLE CONTENT (NO TAB BUTTONS)                    */}
        {/* ================================================================= */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 text-zinc-300 text-xs leading-relaxed">
          {/* =============================================================== */}
          {/* 1. HERO STATEMENT & VISION BANNER                                */}
          {/* =============================================================== */}
          <div className="bg-gradient-to-br from-indigo-950/60 via-[#161616] to-[#121212] p-6 rounded-3xl border border-indigo-500/30 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Model Transformasi Digital Luar Bandar
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Pelan Digital Perlis (2021–2030)
              </span>
            </div>

            <p className="text-sm sm:text-base text-zinc-100 font-serif italic leading-relaxed">
              “Pembangunan Dapur KEMAS dibangunkan oleh Unit Pembangunan Komuniti & Pendidikan Kemahiran (PKK) KEMAS Negeri Perlis sebagai model transformasi digital luar bandar. Projek ini menggabungkan khazanah kulinari pusaka tradisi dengan kecanggihan teknologi moden bagi melahirkan masyarakat desa yang celik digital, berdikari, dan berdaya saing.”
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-black/40 border border-zinc-800 p-3 rounded-2xl text-center">
                <div className="text-base font-black text-amber-400">RM 0</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Kos Pelayan (Serverless)</div>
              </div>
              <div className="bg-black/40 border border-zinc-800 p-3 rounded-2xl text-center">
                <div className="text-base font-black text-emerald-400">100%</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Google Workspace SSOT</div>
              </div>
              <div className="bg-black/40 border border-zinc-800 p-3 rounded-2xl text-center">
                <div className="text-base font-black text-indigo-400">2 Muka Surat</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Format Tepat PDF A4</div>
              </div>
              <div className="bg-black/40 border border-zinc-800 p-3 rounded-2xl text-center">
                <div className="text-base font-black text-purple-400">3 Peranan</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Kawalan Ketat RBAC</div>
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* 2. SEKSYEN 1: HALA TUJU, MISI, VISI & DASAR PERLIS               */}
          {/* =============================================================== */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-800">
              <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  1. Hala Tuju Dasar, Misi & Visi KEMAS Negeri Perlis
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Penyelarasan dengan Pelan Digital Perlis (2021–2030) dan Kementerian Kemajuan Desa & Wilayah (KKDW)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Misi & Visi */}
              <div className="bg-[#161616] p-5 rounded-2xl border border-zinc-800 space-y-3">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                  <Compass className="w-4 h-4" />
                  <span>Misi & Visi Strategik</span>
                </div>
                <p>
                  <strong className="text-zinc-100 block font-bold mb-0.5">Visi:</strong>
                  Menjadi pemangkin utama pemerkasaan kulinari luar bandar bertaraf digital menjelang tahun 2030.
                </p>
                <p>
                  <strong className="text-zinc-100 block font-bold mb-0.5">Misi:</strong>
                  Mendigitalkan khazanah resipi warisan Perlis, melatih masyarakat desa menguasai alat digital, dan membuka peluang keusahawanan makanan melalui pensijilan modul kemahiran PKK.
                </p>
              </div>

              {/* Pelan Digital Perlis */}
              <div className="bg-[#161616] p-5 rounded-2xl border border-zinc-800 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Award className="w-4 h-4" />
                  <span>Pelan Digital Perlis (2021–2030)</span>
                </div>
                <p>
                  Inisiatif ini dirangka selaras dengan agenda Kerajaan Negeri Perlis untuk merapatkan jurang digital antara bandar dan desa:
                </p>
                <ul className="space-y-1 text-zinc-300">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Masyarakat Desa Celik Digital melalui aplikasi mesra pengguna.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Pemuliharaan khazanah kulinari tradisi secara berpusat dan boleh diwarisi.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Infrastruktur teknologi awan sifar kos lesen untuk penjimatan dana kerajaan.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* 3. SEKSYEN 2: PARADIGMA VIBE CODING & 5 FASA AI-SDLC             */}
          {/* =============================================================== */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-800">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  2. Metodologi Vibe Coding & 5 Fasa Kitaran Hayat AI-SDLC
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Pembangunan berasaskan kecerdasan buatan Gemini Studio dengan lelaran maklum balas pantas
                </p>
              </div>
            </div>

            <div className="bg-[#161616] p-5 rounded-2xl border border-zinc-800 space-y-3">
              <p className="text-zinc-300 leading-relaxed">
                Melalui konsep <strong>Vibe Coding</strong>, proses pembangunan tidak lagi bergantung kepada penulisan kod secara manual baris-demi-baris yang memakan masa berbulan. Sebaliknya, pembangun menyatakan niat kulinari, struktur data, dan logik keselamatan dalam bahasa natural, manakala enjin AI menterjemahkannya kepada kod TypeScript standard, antaramuka React, dan automasi Google Apps Script secara deterministik.
              </p>

              {/* 5 Fasa AI-SDLC Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 pt-2">
                <div className="p-3 bg-zinc-900/90 rounded-xl border border-zinc-800 space-y-1">
                  <div className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">1</div>
                  <strong className="text-zinc-100 font-bold block text-[11px]">Domain Resipi</strong>
                  <p className="text-[10px] text-zinc-400">Penstrukturan relasi 1-ke-banyak (Resepi -&gt; Bahan & Langkah).</p>
                </div>

                <div className="p-3 bg-zinc-900/90 rounded-xl border border-zinc-800 space-y-1">
                  <div className="w-5 h-5 rounded-full bg-amber-600 text-white font-bold text-[10px] flex items-center justify-center">2</div>
                  <strong className="text-zinc-100 font-bold block text-[11px]">Gemini Canvas</strong>
                  <p className="text-[10px] text-zinc-400">Prototaip visual pantas dan reka bentuk kad kulinari gelap.</p>
                </div>

                <div className="p-3 bg-zinc-900/90 rounded-xl border border-zinc-800 space-y-1">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">3</div>
                  <strong className="text-zinc-100 font-bold block text-[11px]">Penyelarasan Data</strong>
                  <p className="text-[10px] text-zinc-400">Integrasi 8 sheet Google Sheets & Bound GAS API.</p>
                </div>

                <div className="p-3 bg-zinc-900/90 rounded-xl border border-zinc-800 space-y-1">
                  <div className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center">4</div>
                  <strong className="text-zinc-100 font-bold block text-[11px]">Maklum Balas PKK</strong>
                  <p className="text-[10px] text-zinc-400">Penyesuaian cetakan 2 halaman A4 on-demand.</p>
                </div>

                <div className="p-3 bg-zinc-900/90 rounded-xl border border-zinc-800 space-y-1">
                  <div className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold text-[10px] flex items-center justify-center">5</div>
                  <strong className="text-zinc-100 font-bold block text-[11px]">Audit RBAC</strong>
                  <p className="text-[10px] text-zinc-400">Penguncian GAS & XLSX khusus kepada Admin sahaja.</p>
                </div>
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* 4. SEKSYEN 3: SINERGI 4 TIANG GOOGLE WORKSPACE & APPSHEET        */}
          {/* =============================================================== */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-800">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  3. Ekosistem Google Workspace & Google AppSheet
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Arkitektur Awan Tanpa Pelayan Berbayar (Serverless Architecture)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Pillar 1 */}
              <div className="bg-[#161616] p-4.5 rounded-2xl border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <Database className="w-4 h-4" />
                  <span>1. Google Sheets</span>
                </div>
                <p className="text-[11px] text-zinc-300">
                  Pangkalan data terpusat (SSOT) dengan 8 lembaran kerja ternormalisasi. Boleh disemak secara telus oleh pegawai PKK.
                </p>
                <div className="text-[10px] text-emerald-400 font-mono pt-1">
                  ✓ Had selamat &lt;10 Juta Sel
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="bg-[#161616] p-4.5 rounded-2xl border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
                  <Smartphone className="w-4 h-4" />
                  <span>2. AppSheet Lapangan</span>
                </div>
                <p className="text-[11px] text-zinc-300">
                  Aplikasi mudah alih No-Code untuk tenaga pengajar mengumpul resipi di kampung walaupun dalam keadaan tiada internet (Offline).
                </p>
                <div className="text-[10px] text-blue-400 font-mono pt-1">
                  ✓ Tangkapan foto telefon terus
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="bg-[#161616] p-4.5 rounded-2xl border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>3. Gemini Canvas</span>
                </div>
                <p className="text-[11px] text-zinc-300">
                  Ruang prototaip UI moden, formula penukaran sukatan masakan, dan struktur kad Cookbook A4 berdefinisi tinggi.
                </p>
                <div className="text-[10px] text-indigo-400 font-mono pt-1">
                  ✓ Penjanaan responsif WYSIWYG
                </div>
              </div>

              {/* Pillar 4 */}
              <div className="bg-[#161616] p-4.5 rounded-2xl border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Cpu className="w-4 h-4" />
                  <span>4. Google Apps Script</span>
                </div>
                <p className="text-[11px] text-zinc-300">
                  Backend API ringan percuma tanpa pelayan yang mengautomasikan penyegerakan data dan bot notifikasi emel kelulusan draf.
                </p>
                <div className="text-[10px] text-amber-400 font-mono pt-1">
                  ✓ 100% Sifar kos pengehosan
                </div>
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* 5. SEKSYEN 4: TADBIR URUS DATA & MATRIKS KESELAMATAN RBAC         */}
          {/* =============================================================== */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-800">
              <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  4. Tadbir Urus Data Terbuka & Matriks Akses RBAC Ketat
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Kawalan hak akses peranan pengguna bagi melindungi keaslian resipi pusaka
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Admin */}
              <div className="bg-[#161616] p-4.5 rounded-2xl border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="font-bold text-xs text-amber-400 uppercase">1. Pentadbir (Admin)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">Kuasa Penuh</span>
                </div>
                <p className="text-[11px] text-zinc-300">Pegawai Kanan Unit PKK KEMAS Perlis:</p>
                <ul className="space-y-1 text-[11px] text-zinc-300">
                  <li>✓ Meluluskan resipi (Draf -&gt; Diterbitkan).</li>
                  <li>✓ Menguruskan 4 Master Data rujukan.</li>
                  <li>✓ Mendaftar akaun staf & menguruskan peranan.</li>
                  <li>✓ <strong>Eksklusif Admin:</strong> Muat turun pangkalan data XLSX.</li>
                  <li>✓ <strong>Eksklusif Admin:</strong> Akses kod Google Apps Script.</li>
                </ul>
              </div>

              {/* Penyumbang */}
              <div className="bg-[#161616] p-4.5 rounded-2xl border border-indigo-500/30 space-y-2">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="font-bold text-xs text-indigo-400 uppercase">2. Penyumbang</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">Tenaga Pengajar</span>
                </div>
                <p className="text-[11px] text-zinc-300">Pemaju Masyarakat (PM) Masakan KEMAS:</p>
                <ul className="space-y-1 text-[11px] text-zinc-300">
                  <li>✓ Menambah resipi baharu (disimpan sebagai Draf).</li>
                  <li>✓ Menyunting draf resipi ciptaan sendiri.</li>
                  <li>✓ Menjana fail PDF Cookbook 2 muka surat.</li>
                  <li className="text-rose-400">✕ Tiada akses fail kod GAS & XLSX database.</li>
                  <li className="text-rose-400">✕ Tidak boleh meluluskan resipi ke awam.</li>
                </ul>
              </div>

              {/* Pengguna Awam */}
              <div className="bg-[#161616] p-4.5 rounded-2xl border border-blue-500/30 space-y-2">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="font-bold text-xs text-blue-400 uppercase">3. Pengguna Awam</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">Masyarakat Desa</span>
                </div>
                <p className="text-[11px] text-zinc-300">Peserta bengkel, komuniti dan orang ramai:</p>
                <ul className="space-y-1 text-[11px] text-zinc-300">
                  <li>✓ Mencari dan menapis resipi warisan terbuka.</li>
                  <li>✓ Menjana dan mencetak PDF Cookbook secara terus.</li>
                  <li className="text-rose-400">✕ Tiada akses fail kod GAS & XLSX database.</li>
                  <li className="text-rose-400">✕ Akses mod bacaan sahaja (Read-Only).</li>
                </ul>
              </div>
            </div>

            {/* Quick Admin Access (Only if Admin is Logged In) */}
            {isAdmin && onOpenGasModal && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <div className="font-bold text-xs text-amber-300">
                      Akses Pentadbir Disahkan: Pusat GAS & XLSX Sedia Diakses
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Anda kini log masuk sebagai Admin dan dibenarkan memuat turun fail XLSX rasmi.
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onOpenGasModal();
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                >
                  <span>Buka Pusat GAS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* =============================================================== */}
          {/* 6. SEKSYEN 5: IMPAK KOMUNITI DESA & FORMAT PDF 2 HALAMAN         */}
          {/* =============================================================== */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-800">
              <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  5. Impak Sosioekonomi Komuniti Desa & Penjanaan PDF 2 Halaman
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Melestarikan warisan masakan dan memperkasa modul pengajaran praktikal
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#161616] p-5 rounded-2xl border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase">
                  <TrendingUp className="w-4 h-4" />
                  <span>Keusahawanan Komuniti Katering</span>
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Peserta bengkel kulinari KEMAS kini dapat menghasilkan kad resipi warisan bertaraf standard industri untuk membina perniagaan katering desa, jualan kuih tradisi, dan pemasaran digital di peringkat negeri.
                </p>
              </div>

              <div className="bg-[#161616] p-5 rounded-2xl border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase">
                  <Printer className="w-4 h-4" />
                  <span>Sistem Cetakan PDF 2 Halaman A4 On-Demand</span>
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Struktur cetakan dibahagikan kepada 2 seksyen tepat: Seksyen 1 untuk Profil & Sukatan Ramuan, Seksyen 2 untuk Langkah Penyediaan & Petua. Memastikan cetakan sentiasa menghasilkan 2 muka surat fizikal yang kemas tanpa bergantung kepada pelayan luar.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* FOOTER BAR                                                        */}
        {/* ================================================================= */}
        <div className="bg-[#0b0b0b] px-6 py-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
            <ChefHat className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Dokumentasi Rasmi Pembangunan Dapur KEMAS • Unit PKK KEMAS Negeri Perlis</span>
          </div>

          <button
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2 rounded-xl text-xs transition-colors cursor-pointer shadow-lg shadow-indigo-950/40"
          >
            Tutup Halaman
          </button>
        </div>
      </div>
    </div>
  );
};
