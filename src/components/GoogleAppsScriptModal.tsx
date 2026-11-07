import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Code2,
  Copy,
  Check,
  Download,
  ExternalLink,
  Layers,
  Database,
  X,
  Sparkles,
  HelpCircle,
  Server,
  Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportToXLSX } from '../utils/xlsxExport';
import { GAS_FILES, GasFileItem } from '../data/gasFiles';

interface GoogleAppsScriptModalProps {
  onClose: () => void;
}

export const GoogleAppsScriptModal: React.FC<GoogleAppsScriptModalProps> = ({ onClose }) => {
  const { recipes, bahanList, langkahList, users, masterData, isAdmin } = useApp();

  const [activeTab, setActiveTab] = useState<'xlsx' | 'gas_files' | 'guide'>('xlsx');
  const [selectedGasFile, setSelectedGasFile] = useState<GasFileItem>(GAS_FILES[0]);
  const [copiedFilename, setCopiedFilename] = useState<string | null>(null);

  // Strict RBAC Guard: Only Admin can access GAS and XLSX Database Center
  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
        <div className="bg-zinc-950 border border-rose-500/30 w-full max-w-md rounded-2xl p-6 shadow-2xl text-center space-y-4">
          <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto text-rose-400">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-extrabold text-zinc-100">
            Akses Ditolak: Khas Pentadbir Sahaja
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Pusat Integrasi Google Apps Script (GAS) dan Muat Turun Pangkalan Data XLSX hanya dibenarkan untuk peranan <strong className="text-zinc-200">Admin (Pentadbir)</strong> sahaja. Penyumbang dan Pengguna tidak mempunyai kebenaran akses ke bahagian ini selaras dengan polisi tadbir urus data KEMAS Perlis.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs transition-colors cursor-pointer"
          >
            Tutup Paparan
          </button>
        </div>
      </div>
    );
  }

  // Download full XLSX (Admin Only)
  const handleDownloadXlsx = () => {
    if (!isAdmin) return;
    exportToXLSX({
      recipes,
      bahanList,
      langkahList,
      users,
      masterData,
    });
  };

  // Copy code
  const handleCopyCode = (file: GasFileItem) => {
    navigator.clipboard.writeText(file.code);
    setCopiedFilename(file.filename);
    setTimeout(() => setCopiedFilename(null), 2500);
  };

  // Download single GS/HTML file
  const handleDownloadSingleFile = (file: GasFileItem) => {
    const blob = new Blob([file.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download all 4 GAS files in sequence
  const handleDownloadAllFiles = () => {
    GAS_FILES.forEach((file, index) => {
      setTimeout(() => {
        handleDownloadSingleFile(file);
      }, index * 250);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-zinc-950 border border-amber-500/30 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-950/80 via-zinc-900 to-zinc-950 px-6 py-4 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-amber-300 flex items-center gap-2">
                <span>Pusat Integrasi Google Apps Script & XLSX Database</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-mono">
                  V1.00 Lengkap
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Pakej Lengkap 4 Fail GAS V1.00 (Code.gs, Index.html, css.html, JavaScript.html) & Pangkalan Data XLSX
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tab Switcher */}
        <div className="bg-zinc-900/90 px-6 border-b border-zinc-800 flex flex-wrap gap-2 pt-3">
          <button
            onClick={() => setActiveTab('xlsx')}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold flex items-center gap-2 border-t border-x transition-all ${
              activeTab === 'xlsx'
                ? 'bg-zinc-950 border-amber-500/40 text-amber-400 shadow-lg'
                : 'bg-transparent border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-400" />
            1. Fail XLSX Google Sheet
          </button>

          <button
            onClick={() => setActiveTab('gas_files')}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold flex items-center gap-2 border-t border-x transition-all ${
              activeTab === 'gas_files'
                ? 'bg-zinc-950 border-amber-500/40 text-amber-400 shadow-lg'
                : 'bg-transparent border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Code2 className="w-4 h-4 text-amber-400" />
            2. Fail Kod GAS (Code.gs, HTML, CSS, JS)
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold flex items-center gap-2 border-t border-x transition-all ${
              activeTab === 'guide'
                ? 'bg-zinc-950 border-amber-500/40 text-amber-400 shadow-lg'
                : 'bg-transparent border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            3. Panduan Deploy KEMAS Perlis
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-grow overflow-y-auto space-y-6">
          {/* TAB 1: XLSX DATABASE DOWNLOAD */}
          {activeTab === 'xlsx' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-emerald-950/40 via-zinc-900 to-zinc-950 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                        <Sparkles className="w-3.5 h-3.5" /> Ready for Google Sheets Import
                      </div>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        isAdmin
                          ? 'bg-purple-500/10 border border-purple-500/30 text-purple-300'
                          : 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
                      }`}>
                        <Lock className="w-3.5 h-3.5" /> Kawalan RBAC: Eksport Khas Admin Sahaja
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-emerald-300">
                      Muat Turun Fail Pangkalan Data Excel (.XLSX)
                    </h3>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      Fail XLSX ini mengandungi kesemua 8 lembaran kerja (worksheets) yang diformat khusus mengikut skema pangkalan data Dapur KEMAS. Selaras dengan polisi keselamatan data KEMAS Perlis, <strong className="text-zinc-100">hanya peranan Pentadbir (Admin) sahaja yang dibenarkan mengeksport data ke XLSX</strong>.
                    </p>
                  </div>

                  {isAdmin ? (
                    <button
                      onClick={handleDownloadXlsx}
                      className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/40 hover:scale-[1.02] transition-all whitespace-nowrap"
                    >
                      <Download className="w-5 h-5" />
                      Muat Turun Dapur_KEMAS_Database.xlsx
                    </button>
                  ) : (
                    <div className="flex flex-col items-center md:items-end gap-1.5">
                      <button
                        disabled
                        className="px-6 py-3.5 rounded-xl bg-zinc-800/80 border border-zinc-700 text-zinc-400 font-bold flex items-center justify-center gap-2.5 cursor-not-allowed opacity-80"
                        title="Hanya Pentadbir (Admin) dibenarkan memuat turun fail XLSX."
                      >
                        <Lock className="w-4 h-4 text-amber-400" />
                        <span>Eksport XLSX (Khas Admin)</span>
                      </button>
                      <span className="text-[11px] text-amber-400/80 text-center md:text-right">
                        Hanya Admin sahaja boleh eksport ke XLSX
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Worksheets Overview */}
              <div>
                <h4 className="text-sm font-bold text-zinc-300 mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  Struktur 8 Lembaran Kerja (Sheets) Dalam Fail XLSX:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-zinc-900/80 rounded-xl border border-zinc-800">
                    <p className="font-bold text-amber-400 text-sm">1. ResepiMaster</p>
                    <p className="text-xs text-zinc-400 mt-1">{recipes.length} Rekod Resepi Utama</p>
                  </div>
                  <div className="p-3.5 bg-zinc-900/80 rounded-xl border border-zinc-800">
                    <p className="font-bold text-amber-400 text-sm">2. BahanResepi</p>
                    <p className="text-xs text-zinc-400 mt-1">{bahanList.length} Senarai Bahan Sukatan</p>
                  </div>
                  <div className="p-3.5 bg-zinc-900/80 rounded-xl border border-zinc-800">
                    <p className="font-bold text-amber-400 text-sm">3. LangkahResepi</p>
                    <p className="text-xs text-zinc-400 mt-1">{langkahList.length} Arahan & Tajuk Langkah</p>
                  </div>
                  <div className="p-3.5 bg-zinc-900/80 rounded-xl border border-zinc-800">
                    <p className="font-bold text-indigo-400 text-sm">4. Pengguna</p>
                    <p className="text-xs text-zinc-400 mt-1">{users.length} Akses Role Pengguna</p>
                  </div>
                  <div className="p-3.5 bg-zinc-900/80 rounded-xl border border-zinc-800">
                    <p className="font-bold text-emerald-400 text-xs">5. Kategori_Masakan</p>
                    <p className="text-xs text-zinc-400 mt-1">{masterData.Kategori_Masakan.length} Kategori Registered</p>
                  </div>
                  <div className="p-3.5 bg-zinc-900/80 rounded-xl border border-zinc-800">
                    <p className="font-bold text-emerald-400 text-xs">6. Etnik_Kaum</p>
                    <p className="text-xs text-zinc-400 mt-1">{masterData.Etnik_Kaum.length} Etnik / Kaum</p>
                  </div>
                  <div className="p-3.5 bg-zinc-900/80 rounded-xl border border-zinc-800">
                    <p className="font-bold text-emerald-400 text-xs">7. Negeri_Asal</p>
                    <p className="text-xs text-zinc-400 mt-1">{masterData.Negeri_Asal.length} Negeri di Malaysia</p>
                  </div>
                  <div className="p-3.5 bg-zinc-900/80 rounded-xl border border-zinc-800">
                    <p className="font-bold text-emerald-400 text-xs">8. Jenis_Hidangan</p>
                    <p className="text-xs text-zinc-400 mt-1">{masterData.Jenis_Hidangan.length} Jenis Hidangan</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GAS CODE FILES VIEW & DOWNLOAD */}
          {activeTab === 'gas_files' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
                <div className="flex flex-wrap gap-2">
                  {GAS_FILES.map((file) => (
                    <button
                      key={file.filename}
                      onClick={() => setSelectedGasFile(file)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                        selectedGasFile.filename === file.filename
                          ? 'bg-amber-500 text-zinc-950 shadow-md'
                          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      }`}
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      {file.filename}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyCode(selectedGasFile)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1.5 border border-zinc-700 transition-colors"
                  >
                    {copiedFilename === selectedGasFile.filename ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Disalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Salin Kod
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDownloadSingleFile(selectedGasFile)}
                    className="px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 text-xs font-medium flex items-center gap-1.5 border border-amber-500/30 transition-colors cursor-pointer"
                    title="Muat turun fail yang sedang dibuka"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Simpan Fail
                  </button>

                  <button
                    onClick={handleDownloadAllFiles}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                    title="Muat turun kesemua 4 fail GAS sekali gus"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Muat Turun Semua (4 Fail)</span>
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-amber-400/90 font-mono bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-lg">
                ℹ️ {selectedGasFile.description}
              </p>

              {/* Code Display Area */}
              <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
                <pre className="p-4 text-xs font-mono text-zinc-200 overflow-x-auto max-h-[400px] leading-relaxed">
                  <code>{selectedGasFile.code}</code>
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: STEP-BY-STEP GUIDANCE FOR PKK PERLIS */}
          {activeTab === 'guide' && (
            <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <h4 className="font-bold text-amber-400 flex items-center gap-2 text-base">
                  <Server className="w-5 h-5" />
                  Panduan Penyebaran (Deployment) Google Apps Script - Unit PKK Perlis
                </h4>
                <p className="text-xs text-zinc-300 mt-1">
                  Ikuti 5 langkah mudah ini untuk menjadikan Google Sheet anda sebagai pangkalan data awan hidup Dapur KEMAS:
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-amber-500 text-zinc-950 font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div>
                    <h5 className="font-bold text-zinc-100">Buka Google Drive & Cipta Google Sheet</h5>
                    <p className="text-xs text-zinc-400 mt-1">
                      Muat naik fail <code className="text-amber-300">Dapur_KEMAS_Database.xlsx</code> yang dimuat turun daripada Tab 1 ke Google Drive. Buka fail tersebut dan pilih <strong className="text-zinc-200">File &gt; Save as Google Sheets</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-amber-500 text-zinc-950 font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div>
                    <h5 className="font-bold text-zinc-100">Buka Apps Script Editor</h5>
                    <p className="text-xs text-zinc-400 mt-1">
                      Dalam Google Sheet berkenaan, klik menu <strong className="text-zinc-200">Extensions &gt; Apps Script</strong>. Namakan projek Apps Script anda sebagai <strong className="text-amber-300">Dapur_KEMAS_Backend</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-amber-500 text-zinc-950 font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <div>
                    <h5 className="font-bold text-zinc-100">Cipta 4 Fail Kod Sedia Ada</h5>
                    <p className="text-xs text-zinc-400 mt-1">
                      Salin kod daripada Tab 2 ke dalam 4 fail Apps Script berikut:
                    </p>
                    <ul className="list-disc list-inside text-xs text-amber-300/90 mt-2 space-y-1 font-mono">
                      <li>Code.gs (Fail Script)</li>
                      <li>Index.html (Fail HTML)</li>
                      <li>css.html (Fail HTML)</li>
                      <li>JavaScript.html (Fail HTML)</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-amber-500 text-zinc-950 font-bold flex items-center justify-center shrink-0">
                    4
                  </span>
                  <div>
                    <h5 className="font-bold text-zinc-100">Jalankan Setup Automatik</h5>
                    <p className="text-xs text-zinc-400 mt-1">
                      Pilih fungsi <code className="text-amber-300">setupDatabaseSheets</code> dalam editor Apps Script dan tekan butang <strong className="text-zinc-200">Run</strong>. Ini akan memastikan kesemua 8 lembaran kerja dikunci dan diformat dengan sempurna.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-amber-500 text-zinc-950 font-bold flex items-center justify-center shrink-0">
                    5
                  </span>
                  <div>
                    <h5 className="font-bold text-zinc-100">Deploy / Kemaskini Versi Web App</h5>
                    <p className="text-xs text-zinc-400 mt-1">
                      <strong>Untuk Kali Pertama:</strong> Klik <strong className="text-amber-300">Deploy &gt; New deployment</strong>. Pilih jenis <strong className="text-zinc-200">Web app</strong>. Tetapkan <em>Execute as: Me</em> dan <em>Who has access: Anyone</em>. Salin URL Web App yang terhasil.
                    </p>
                    <div className="mt-2.5 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
                      <strong>⚠️ PENTING UNTUK KEMASKINI KOD SEDIA ADA:</strong><br />
                      Jika anda telah mengemaskini kod dalam fail-fail di atas, perubahan TIDAK akan muncul pada URL sedia ada selagi anda tidak mencipta versi baharu! Sila pergi ke <strong className="text-white">Deploy &gt; Manage deployments</strong> &gt; klik ikon <strong className="text-white">Pensil (Edit)</strong> &gt; pada pilihan <em>Version</em>, pilih <strong className="text-white">New version</strong> &gt; klik butang <strong className="text-white">Deploy</strong>.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-zinc-900 border-t border-zinc-800 p-4 px-6 flex items-center justify-between">
          <div className="text-xs text-zinc-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            Unit PKK KEMAS Negeri Perlis • Google Apps Script & Sheets
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs sm:text-sm transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
