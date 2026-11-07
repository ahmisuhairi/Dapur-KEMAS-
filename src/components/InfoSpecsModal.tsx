import React from 'react';
import { X, Sparkles, ChefHat, CheckCircle2 } from 'lucide-react';

interface InfoSpecsModalProps {
  onClose: () => void;
}

export const InfoSpecsModal: React.FC<InfoSpecsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#121212] rounded-2xl shadow-2xl max-w-3xl w-full my-auto overflow-hidden border border-zinc-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0f0f0f] border-b border-zinc-800 text-zinc-100 p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <ChefHat className="w-5 h-5 text-indigo-400" />
            <h3 className="font-extrabold text-sm sm:text-base text-zinc-100">
              Spesifikasi Teknikal & Pengurusan Projek Dapur KEMAS
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-zinc-300 leading-relaxed">
          {/* Executive Summary */}
          <div className="space-y-2 bg-indigo-600/10 p-4 rounded-xl border border-indigo-500/20">
            <div className="flex items-center space-x-2 text-indigo-300 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>1. Executive Summary & Visi Produk</span>
            </div>
            <p>
              Aplikasi <strong>"Dapur KEMAS"</strong> merupakan
              inisiatif pendigitalan sistem pengurusan resepi masakan warisan
              Malaysia dan Asia yang direka khusus untuk Unit Pembangunan
              Komuniti & Pendidikan Kemahiran (PKK), Jabatan Kemajuan Masyarakat
              (KEMAS) Negeri Perlis.
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-zinc-300">
              <div>
                <strong className="text-zinc-100">Jabatan Pemilik:</strong> Unit PKK, KEMAS Perlis
              </div>
              <div>
                <strong className="text-zinc-100">Sistem:</strong> Produksi Digital KEMAS Perlis
              </div>
              <div>
                <strong className="text-zinc-100">Identiti Warna:</strong> Elegant Dark (#0a0a0a, #121212, Indigo)
              </div>
              <div>
                <strong className="text-zinc-100">Kos Perisian:</strong> RM 0 (Google Workspace Infrastructure)
              </div>
            </div>
          </div>

          {/* Database Architecture */}
          <div className="space-y-2">
            <h4 className="font-bold text-zinc-100 text-sm border-b border-zinc-800 pb-1">
              2. Seni Bina Pangkalan Data (8 Jadual Normalized)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 bg-[#1a1a1a] rounded-lg border border-zinc-800">
                <strong className="text-indigo-400 block">Jadual Operasi Transaksi (4)</strong>
                <ul className="list-disc list-inside space-y-0.5 text-zinc-400 mt-1">
                  <li>Resepi_Master (Utama)</li>
                  <li>Bahan_Resepi (Sub-detail Ramuan)</li>
                  <li>Langkah_Resepi (Sub-detail Langkah Bertajuk)</li>
                  <li>Pengguna (Peranan Staf)</li>
                </ul>
              </div>

              <div className="p-2.5 bg-[#1a1a1a] rounded-lg border border-zinc-800">
                <strong className="text-amber-400 block">Jadual Master Data Taksonomi (4)</strong>
                <ul className="list-disc list-inside space-y-0.5 text-zinc-400 mt-1">
                  <li>Kategori_Masakan (Ref)</li>
                  <li>Etnik_Kaum (Ref)</li>
                  <li>Negeri_Asal (Ref)</li>
                  <li>Jenis_Hidangan (Ref)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Automation Bot Features */}
          <div className="space-y-2">
            <h4 className="font-bold text-zinc-100 text-sm border-b border-zinc-800 pb-1">
              3. Penjanaan PDF & Enjin Notifikasi
            </h4>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-zinc-100">Penjanaan PDF Terus (On-Demand Client):</strong> Fail PDF Cookbook dijana terus secara atas-permintaan pada peranti pengguna apabila butang 'Jana PDF' ditekan untuk mana-mana resepi tertentu. Tiada lagi auto-generate semasa kelulusan admin.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-zinc-100">Bot 2 (Notifikasi Draf):</strong> Menghantar makluman notifikasi emel automatik kepada Admin apabila Penyumbang menambah resepi draf baharu.
                </div>
              </div>
            </div>
          </div>

          {/* User Matrix */}
          <div className="space-y-2">
            <h4 className="font-bold text-zinc-100 text-sm border-b border-zinc-800 pb-1">
              4. Peranan Pengguna & Kebenaran Akses
            </h4>
            <ul className="space-y-1 text-[11px] list-disc list-inside text-zinc-400">
              <li>
                <strong className="text-zinc-200">Admin:</strong> Kelulusan penerbitan, urus 4 jadual Master Data, urus peranan pengguna, & sunting/padam mana-mana resepi.
              </li>
              <li>
                <strong className="text-zinc-200">Penyumbang:</strong> Memasukkan resepi baharu (simpan automatik sebagai Draf) & menyunting draf sendiri.
              </li>
              <li>
                <strong className="text-zinc-200">Pengguna:</strong> Carian, penapisan gallery, baca butiran, & muat turun PDF Cookbook (Akses Read-Only).
              </li>
            </ul>
          </div>
        </div>

        <div className="p-3 bg-[#0a0a0a] border-t border-zinc-800 text-right">
          <button
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-xl text-xs shadow-md shadow-indigo-900/20"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
