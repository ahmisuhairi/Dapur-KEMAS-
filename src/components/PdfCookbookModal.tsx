import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Download,
  Sparkles,
  ChefHat,
  CheckCircle2,
  Loader2,
  Clock,
  Users,
  BookOpen,
  FileText,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import { ResepiMaster, BahanResepi, LangkahResepi } from '../types';
import { useApp } from '../context/AppContext';

interface PdfCookbookModalProps {
  recipe: ResepiMaster;
  ingredients: BahanResepi[];
  steps: LangkahResepi[];
  onClose: () => void;
}

export const PdfCookbookModal: React.FC<PdfCookbookModalProps> = ({
  recipe,
  ingredients,
  steps,
  onClose,
}) => {
  const { recordPdfGenerated } = useApp();

  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);
  const portalPage1Ref = useRef<HTMLDivElement>(null);
  const portalPage2Ref = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Group ingredients by Kumpulan_Bahan
  const groupedIngredients: Record<string, BahanResepi[]> = {};
  ingredients.forEach((item) => {
    const group = item.Kumpulan_Bahan || 'Bahan Utama';
    if (!groupedIngredients[group]) {
      groupedIngredients[group] = [];
    }
    groupedIngredients[group].push(item);
  });

  const sortedSteps = [...steps].sort(
    (a, b) => a.Nombor_Langkah - b.Nombor_Langkah
  );

  const totalTime =
    (recipe.Masa_Penyediaan_Minit || 0) + (recipe.Masa_Memasak_Minit || 0);

  // Clean up print classes on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('kemas-print-mode');
    };
  }, []);

  // Quick smooth scroll to sections
  const scrollToSection = (sectionNumber: 1 | 2) => {
    const targetRef = sectionNumber === 1 ? page1Ref : page2Ref;
    if (targetRef.current && scrollContainerRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // DIRECT PDF DOWNLOAD (Guaranteed 2 Pages via jsPDF + html2canvas)
  const handleDownloadPdf = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setDownloadSuccess(false);
    setErrorMessage(null);

    try {
      const page1 = portalPage1Ref.current || page1Ref.current;
      const page2 = portalPage2Ref.current || page2Ref.current;

      if (!page1 || !page2) {
        throw new Error('Kedua-dua elemen halaman PDF tidak dijumpai.');
      }

      // Temporarily reveal portal container off-screen for crisp rendering
      const portal = document.getElementById('kemas-print-portal');
      if (portal) {
        portal.style.display = 'block';
        portal.style.position = 'fixed';
        portal.style.left = '-9999px';
        portal.style.top = '0';
        portal.style.width = '794px'; // Exactly A4 width at 96 DPI
        portal.style.zIndex = '-1';
      }

      await new Promise((resolve) => setTimeout(resolve, 150));

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

      const canvasOptions = {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        imageTimeout: 10000,
        windowWidth: 1024,
      };

      // 1. Capture Page 1 (Seksyen 1)
      let canvas1: HTMLCanvasElement;
      try {
        canvas1 = await html2canvas(page1, canvasOptions);
      } catch (err) {
        console.warn('Fallback capture page 1 with relaxed options:', err);
        canvas1 = await html2canvas(page1Ref.current || page1, {
          scale: 1.5,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
        });
      }

      const imgData1 = canvas1.toDataURL('image/jpeg', 0.95);
      const ratio1 = Math.min(pdfWidth / canvas1.width, pdfHeight / canvas1.height);
      const renderW1 = canvas1.width * ratio1;
      const renderH1 = canvas1.height * ratio1;
      const posX1 = (pdfWidth - renderW1) / 2;

      pdf.addImage(imgData1, 'JPEG', posX1, 0, renderW1, renderH1);

      // 2. Capture Page 2 (Seksyen 2) - ALWAYS add as Page 2
      pdf.addPage();

      let canvas2: HTMLCanvasElement;
      try {
        canvas2 = await html2canvas(page2, canvasOptions);
      } catch (err) {
        console.warn('Fallback capture page 2 with relaxed options:', err);
        canvas2 = await html2canvas(page2Ref.current || page2, {
          scale: 1.5,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
        });
      }

      const imgData2 = canvas2.toDataURL('image/jpeg', 0.95);
      const ratio2 = Math.min(pdfWidth / canvas2.width, pdfHeight / canvas2.height);
      const renderW2 = canvas2.width * ratio2;
      const renderH2 = canvas2.height * ratio2;
      const posX2 = (pdfWidth - renderW2) / 2;

      pdf.addImage(imgData2, 'JPEG', posX2, 0, renderW2, renderH2);

      // Reset portal style
      if (portal) {
        portal.style.display = '';
        portal.style.position = '';
        portal.style.left = '';
        portal.style.top = '';
        portal.style.width = '';
        portal.style.zIndex = '';
      }

      const sanitizedName = (recipe.Nama_Resepi || 'Resepi')
        .replace(/[^a-zA-Z0-9\s_-]/g, '')
        .trim()
        .replace(/\s+/g, '_');
      const filename = `Cookbook_${sanitizedName}_2Page.pdf`;

      pdf.save(filename);
      recordPdfGenerated(recipe.ID_Resepi);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4500);
    } catch (error) {
      console.error('Ralat semasa muat turun PDF:', error);
      setErrorMessage(
        'Muat turun fail PDF tidak berjaya. Sila pastikan sambungan internet stabil dan cuba sekali lagi.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Reusable Component for Seksyen 1 (Page 1) Content
  const renderSeksyen1Content = () => (
    <>
      <div className="space-y-3.5">
        {/* Document Header Branding */}
        <div className="border-b-4 border-indigo-600 pb-2.5 flex justify-between items-end">
          <div>
            <div className="flex items-center space-x-1.5 text-indigo-700 font-bold text-xs uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Jabatan Kemajuan Masyarakat (KEMAS) Perlis</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 tracking-tight">
              Koleksi Resepi Warisan Digital
            </h1>
            <p className="text-[11px] text-slate-500">
              Unit Pembangunan Komuniti & Pendidikan Kemahiran (PKK) • Dapur KEMAS
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="inline-block bg-indigo-50 text-indigo-700 border border-indigo-200 font-black text-[11px] px-2.5 py-0.5 rounded uppercase tracking-wider">
              SEKSYEN 1 DARI 2
            </span>
            <div className="text-[10px] text-slate-500 mt-0.5 font-mono font-semibold">
              ID: {recipe.ID_Resepi}
            </div>
          </div>
        </div>

        {/* Recipe Title & Badges */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="bg-indigo-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
              {recipe.Kategori_Masakan}
            </span>
            {recipe.Negeri_Asal && (
              <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[11px] font-bold px-2 py-0.5 rounded-full">
                {recipe.Negeri_Asal}
              </span>
            )}
            {recipe.Etnik_Kaum && (
              <span className="bg-slate-100 text-slate-700 border border-slate-300 text-[11px] font-bold px-2 py-0.5 rounded-full">
                Etnik {recipe.Etnik_Kaum}
              </span>
            )}
            <span className="bg-slate-100 text-slate-700 border border-slate-300 text-[11px] font-bold px-2 py-0.5 rounded-full ml-auto">
              Tahap: {recipe.Tahap_Kesukaran}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 border-l-4 border-indigo-600 pl-3 leading-tight">
            {recipe.Nama_Resepi}
          </h2>

          {recipe.Deskripsi && (
            <p className="text-xs text-slate-600 italic leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              "{recipe.Deskripsi}"
            </p>
          )}

          {/* Photo & Duration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200 items-center">
            <div className="md:col-span-1 h-32 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
              <img
                src={recipe.Gambar_Utama}
                alt={recipe.Nama_Resepi}
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="md:col-span-2 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-slate-500 block text-[10px] flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3 text-indigo-500" /> Masa Menyedia
                </span>
                <strong className="text-slate-800 text-xs sm:text-sm">
                  {recipe.Masa_Penyediaan_Minit || 0} minit
                </strong>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-slate-500 block text-[10px] flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3 text-amber-500" /> Masa Memasak
                </span>
                <strong className="text-slate-800 text-xs sm:text-sm">
                  {recipe.Masa_Memasak_Minit || 0} minit
                </strong>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-slate-500 block text-[10px] font-medium">Jumlah Masa</span>
                <strong className="text-indigo-600 text-xs sm:text-sm">
                  {totalTime} minit
                </strong>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-slate-500 block text-[10px] flex items-center gap-1 font-medium">
                  <Users className="w-3 h-3 text-emerald-500" /> Bilangan Sajian
                </span>
                <strong className="text-slate-800 text-xs sm:text-sm">
                  {recipe.Bilangan_Hidangan} orang
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients Section */}
        <div className="space-y-1.5 pt-0.5">
          <div className="flex items-center justify-between border-b-2 border-indigo-200 pb-1">
            <h3 className="text-xs sm:text-sm font-bold text-indigo-800 uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              <span>Bahan-Bahan Ramuan (Lengkap)</span>
            </h3>
            <span className="text-[10px] text-slate-600 bg-indigo-50 font-semibold px-2 py-0.5 rounded border border-indigo-100">
              {ingredients.length} ramuan direkodkan
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.keys(groupedIngredients).map((groupName) => (
              <div
                key={groupName}
                className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 shadow-2xs"
              >
                <h4 className="font-bold text-amber-800 text-[11px] mb-1 pb-0.5 border-b border-amber-200 flex items-center justify-between">
                  <span>{groupName}</span>
                  <span className="text-[9px] text-slate-500 font-normal">
                    {groupedIngredients[groupName].length} item
                  </span>
                </h4>
                <ul className="space-y-1 text-[11px]">
                  {groupedIngredients[groupName].map((b) => (
                    <li
                      key={b.ID_Bahan}
                      className="flex items-start justify-between py-0.5 border-b border-slate-200/50 text-slate-700 last:border-0"
                    >
                      <span className="font-medium">• {b.Nama_Bahan}</span>
                      <span className="font-bold text-slate-900 ml-2 whitespace-nowrap">
                        {b.Kuantiti} {b.Unit !== 'secukup rasa' ? b.Unit : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer on Seksyen 1 */}
      <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-medium">
        <div>
          <span className="font-semibold text-slate-600">Dapur KEMAS • Unit PKK KEMAS Negeri Perlis</span>
          <span className="hidden sm:inline text-slate-400 ml-2">| Seksyen 1: Profil & Bahan</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-indigo-600 font-semibold hidden sm:inline">
            Langkah Penyediaan di Halaman 2 →
          </span>
          <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
            Halaman 1 / 2
          </span>
        </div>
      </div>
    </>
  );

  // Reusable Component for Seksyen 2 (Page 2) Content
  const renderSeksyen2Content = () => (
    <>
      <div className="space-y-3.5">
        {/* Running Header on Seksyen 2 */}
        <div className="pb-2.5 border-b-2 border-indigo-200 flex justify-between items-center text-xs">
          <div className="flex items-center gap-2 font-bold text-indigo-800">
            <ChefHat className="w-4 h-4 text-indigo-600" />
            <div>
              <span className="text-slate-900 font-black block text-sm">
                Dapur KEMAS • Panduan Penyediaan Lengkap
              </span>
              <span className="text-[10px] text-slate-500 font-normal">
                Unit PKK KEMAS Negeri Perlis • Warisan Kulinari Tradisi
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span className="inline-block bg-amber-50 text-amber-800 border border-amber-300 font-black text-[10px] px-2.5 py-0.5 rounded uppercase tracking-wider">
              SEKSYEN 2 DARI 2
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <span className="font-semibold text-slate-700 truncate max-w-[150px]">
                {recipe.Nama_Resepi}
              </span>
              <span>•</span>
              <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.2 rounded border border-indigo-200">
                Halaman 2 / 2
              </span>
            </div>
          </div>
        </div>

        {/* Steps Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b-2 border-indigo-200 pb-1">
            <h3 className="text-xs sm:text-sm font-bold text-indigo-800 uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              <span>Langkah-Langkah Penyediaan Berturutan</span>
            </h3>
            <span className="text-[10px] text-slate-600 bg-indigo-50 font-semibold px-2 py-0.5 rounded border border-indigo-100">
              {sortedSteps.length} langkah lengkap
            </span>
          </div>

          <div className="space-y-2">
            {sortedSteps.map((step) => (
              <div
                key={step.ID_Langkah}
                className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs"
              >
                <span className="bg-indigo-600 text-white font-black text-xs w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  {step.Nombor_Langkah}
                </span>
                <div className="space-y-0.5 text-xs flex-grow">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                      {step.Tajuk_Langkah}
                    </h4>
                    {step.Masa_Minit ? (
                      <span className="inline-block text-[10px] text-amber-800 font-semibold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded shrink-0">
                        Masa: {step.Masa_Minit} minit
                      </span>
                    ) : null}
                  </div>
                  <p className="text-slate-700 leading-relaxed text-[11px] sm:text-xs">
                    {step.Arahan}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Amalan Kulinari & Piawaian KEMAS Perlis */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-2.5 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-900 font-bold text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Panduan Kulinari & Standard Masakan KEMAS Perlis:</span>
          </div>
          <p className="text-[10px] text-slate-700 leading-relaxed">
            Pastikan sukatan bahan diikuti dengan tepat untuk mengekalkan keaslian rasa pusaka warisan. Kawalan suhu api dan ketepatan masa menumis memastikan aroma rempah asli terpelihara dengan sempurna.
          </p>
        </div>
      </div>

      {/* Official KEMAS Document Footer & Verification */}
      <div className="pt-3 border-t-2 border-indigo-200 text-center text-[10px] text-slate-500 space-y-1">
        <div className="font-bold text-slate-800 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          <span>Dokumen Rasmi Dapur KEMAS • Unit Pembangunan Komuniti & Pendidikan Kemahiran (PKK) KEMAS Perlis</span>
        </div>
        <div className="text-slate-600">
          Resepi disahkan oleh Pentadbir KEMAS • Dicipta oleh: <strong className="text-slate-800">{recipe.Dicipta_Oleh}</strong>
        </div>
        <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono pt-0.5">
          <span>Dokumentasi Lengkap 2 Seksyen (2 Muka Surat)</span>
          <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-sans">
            Seksyen 2 / Halaman 2 dari 2 (Tamat)
          </span>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* ================================================================= */}
      {/* 1. DEDICATED PRINT PORTAL (Directly in document.body)              */}
      {/* This bypasses all WebKit modal & scroll clipping bugs             */}
      {/* ================================================================= */}
      {createPortal(
        <div id="kemas-print-portal">
          <div
            ref={portalPage1Ref}
            className="kemas-print-page-1 font-sans text-slate-800 bg-white"
          >
            {renderSeksyen1Content()}
          </div>
          <div
            ref={portalPage2Ref}
            className="kemas-print-page-2 font-sans text-slate-800 bg-white"
          >
            {renderSeksyen2Content()}
          </div>
        </div>,
        document.body
      )}

      {/* ================================================================= */}
      {/* 2. ON-SCREEN MODAL PREVIEW FOR THE USER                            */}
      {/* ================================================================= */}
      <div
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto no-print"
      >
        <div className="bg-[#121212] rounded-2xl shadow-2xl max-w-4xl w-full my-auto overflow-hidden border border-zinc-800 flex flex-col max-h-[95vh]">
          {/* Modal Toolbar Header */}
          <div className="bg-[#0f0f0f] text-zinc-100 px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <ChefHat className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-zinc-100 flex items-center gap-2">
                  <span>PDF Cookbook: Format 2 Seksyen</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold px-2 py-0.5 rounded-full">
                    2 Halaman Dijamin
                  </span>
                </h3>
                <p className="text-[11px] text-zinc-400 hidden sm:block">
                  Seksyen 1 (Halaman 1) • Seksyen 2 (Halaman 2)
                </p>
              </div>
            </div>

            {/* Quick Jump Buttons (Seksyen 1 & 2) */}
            <div className="hidden md:flex items-center gap-1.5 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
              <button
                onClick={() => scrollToSection(1)}
                className="px-2.5 py-1 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white font-medium flex items-center gap-1 transition-colors"
                title="Lompat ke Seksyen 1 (Halaman 1)"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Seksyen 1 (Hlm 1)</span>
              </button>
              <div className="w-px h-3.5 bg-zinc-700" />
              <button
                onClick={() => scrollToSection(2)}
                className="px-2.5 py-1 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white font-medium flex items-center gap-1 transition-colors"
                title="Lompat ke Seksyen 2 (Halaman 2)"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Seksyen 2 (Hlm 2)</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Butang Utama: Muat Turun Fail PDF (2 Halaman) */}
              <button
                onClick={handleDownloadPdf}
                disabled={isGenerating}
                className={`font-bold px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer active:scale-95 ${
                  downloadSuccess
                    ? 'bg-emerald-600 text-white shadow-emerald-900/40'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
                } ${isGenerating ? 'opacity-80 cursor-wait' : ''}`}
                title="Jana dan muat turun fail PDF 2 halaman lengkap ke peranti"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Menjana 2 Halaman...</span>
                  </>
                ) : downloadSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>PDF Berjaya Dimuat Turun!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Muat Turun PDF (2 Halaman)</span>
                  </>
                )}
              </button>

              {/* Butang Tutup Modal */}
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
                title="Tutup Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Error Banner if direct PDF encounters device restriction */}
          {errorMessage && (
            <div className="bg-rose-950/80 border-b border-rose-800 px-4 py-2.5 text-xs text-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <div className="flex-grow">{errorMessage}</div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-rose-400 hover:text-white underline text-[11px]"
              >
                Tutup
              </button>
            </div>
          )}

          {/* Printable Document View Area */}
          <div
            ref={scrollContainerRef}
            className="p-3 sm:p-8 overflow-y-auto bg-[#0a0a0a] flex flex-col items-center gap-6"
          >
            {/* SEKSYEN 1 (HALAMAN 1) */}
            <div
              ref={page1Ref}
              className="bg-white w-full max-w-[210mm] p-6 sm:p-8 shadow-2xl rounded-2xl text-slate-800 font-sans border border-slate-200 flex flex-col justify-between"
              style={{ minHeight: '270mm' }}
            >
              {renderSeksyen1Content()}
            </div>

            {/* Visual Divider on Screen */}
            <div className="w-full max-w-[210mm] py-2 flex flex-col items-center justify-center gap-2 text-xs">
              <div className="w-full flex items-center gap-3">
                <div className="h-px bg-zinc-800 flex-grow" />
                <div className="px-4 py-1.5 bg-gradient-to-r from-indigo-950 via-zinc-900 to-indigo-950 text-indigo-300 rounded-full border border-indigo-500/30 text-[11px] font-bold flex items-center gap-2 shadow-lg">
                  <ChefHat className="w-3.5 h-3.5 text-indigo-400" />
                  <span>PEMISAH SEKSYEN (SEKSYEN 2 BERMULA DI HALAMAN 2)</span>
                </div>
                <div className="h-px bg-zinc-800 flex-grow" />
              </div>
              <p className="text-[11px] text-zinc-500 text-center">
                Seksyen 1 dicetak pada Muka Surat 1 • Seksyen 2 dicetak pada Muka Surat 2 (2 Halaman Lengkap)
              </p>
            </div>

            {/* SEKSYEN 2 (HALAMAN 2) */}
            <div
              ref={page2Ref}
              className="bg-white w-full max-w-[210mm] p-6 sm:p-8 shadow-2xl rounded-2xl text-slate-800 font-sans border border-slate-200 flex flex-col justify-between"
              style={{ minHeight: '270mm' }}
            >
              {renderSeksyen2Content()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
