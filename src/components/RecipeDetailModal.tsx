import React, { useState } from 'react';
import {
  X,
  Clock,
  Edit,
  Trash2,
  CheckCircle2,
  ChefHat,
  Sparkles,
  Share2,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ResepiMaster } from '../types';
import { PdfCookbookModal } from './PdfCookbookModal';

interface RecipeDetailModalProps {
  recipe: ResepiMaster;
  onClose: () => void;
  onEdit: (recipe: ResepiMaster) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  onClose,
  onEdit,
}) => {
  const {
    recipes,
    bahanList,
    langkahList,
    canEditRecipe,
    isAdmin,
    approveRecipe,
    deleteRecipe,
  } = useApp();

  const [showPdfModal, setShowPdfModal] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<
    Record<string, boolean>
  >({});

  // Fetch current live state from AppProvider
  const currentLiveRecipe = recipes.find((r) => r.ID_Resepi === recipe.ID_Resepi) || recipe;
  const pdfFileUrl = currentLiveRecipe.Fail_PDF_Cookbook;
  const hasPdfUrl = Boolean(pdfFileUrl && pdfFileUrl.trim() !== '');

  const recipeBahan = bahanList.filter((b) => b.ID_Resepi === recipe.ID_Resepi);
  const recipeLangkah = langkahList
    .filter((l) => l.ID_Resepi === recipe.ID_Resepi)
    .sort((a, b) => a.Nombor_Langkah - b.Nombor_Langkah);

  // Group ingredients
  const groupedIngredients: Record<string, typeof recipeBahan> = {};
  recipeBahan.forEach((item) => {
    const group = item.Kumpulan_Bahan || 'Bahan Utama';
    if (!groupedIngredients[group]) {
      groupedIngredients[group] = [];
    }
    groupedIngredients[group].push(item);
  });

  const toggleCheck = (id: string) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const totalTime =
    (recipe.Masa_Penyediaan_Minit || 0) + (recipe.Masa_Memasak_Minit || 0);

  const handleDelete = () => {
    if (confirm(`Adakah anda pasti mahu memadam resepi "${recipe.Nama_Resepi}"?`)) {
      deleteRecipe(recipe.ID_Resepi);
      onClose();
    }
  };

  const handleApprove = () => {
    approveRecipe(recipe.ID_Resepi);
    alert(`Resepi "${recipe.Nama_Resepi}" telah diluluskan & diterbitkan! Pengguna kini boleh menjana PDF secara terus.`);
  };

  return (
    <>
      <div className="recipe-detail-overlay fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
        <div className="bg-[#121212] rounded-2xl shadow-2xl max-w-3xl w-full my-auto overflow-hidden border border-zinc-800 flex flex-col max-h-[92vh]">
          {/* Modal Header Toolbar */}
          <div className="bg-[#0f0f0f] border-b border-zinc-800 text-zinc-100 px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex flex-wrap items-center gap-2">
              <ChefHat className="w-5 h-5 text-indigo-400" />
              <span className="font-bold text-xs sm:text-sm text-zinc-100">
                Butiran Resepi Warisan
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  recipe.Status === 'Diterbitkan'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                {recipe.Status}
              </span>

              {/* Butang Atas: Jana PDF */}
              <button
                type="button"
                onClick={() => setShowPdfModal(true)}
                className="text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title="Jana & Papar PDF Cookbook"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Jana PDF</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              {canEditRecipe(recipe) && (
                <button
                  onClick={() => {
                    onClose();
                    onEdit(recipe);
                  }}
                  className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors"
                  title="Sunting Resepi"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}

              {isAdmin && (
                <button
                  onClick={handleDelete}
                  className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors"
                  title="Padam Resepi"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Content Scrollable */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-zinc-100">
            {/* Hero Image & Badges */}
            <div className="relative h-60 sm:h-72 rounded-2xl overflow-hidden bg-[#1a1a1a] shadow-sm border border-zinc-800">
              <img
                src={recipe.Gambar_Utama}
                alt={recipe.Nama_Resepi}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 text-white space-y-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="bg-indigo-600/90 backdrop-blur-md text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow">
                    {recipe.Kategori_Masakan}
                  </span>
                  {recipe.Negeri_Asal && (
                    <span className="bg-amber-600/90 backdrop-blur-md text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow">
                      {recipe.Negeri_Asal}
                    </span>
                  )}
                  {recipe.Etnik_Kaum && (
                    <span className="bg-zinc-800/90 backdrop-blur-md text-zinc-200 text-xs font-bold px-2.5 py-0.5 rounded-full shadow border border-zinc-700">
                      Etnik {recipe.Etnik_Kaum}
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-zinc-100 leading-tight drop-shadow-md">
                  {recipe.Nama_Resepi}
                </h2>
              </div>
            </div>

            {/* Approval Banner if Status === Draf */}
            {recipe.Status === 'Draf' && (
              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-center justify-between text-amber-300">
                <div className="flex items-center space-x-2 text-xs">
                  <FileCheck className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <strong className="block font-bold">
                      Resepi Ini Dalam Status Draf
                    </strong>
                    <span className="text-[11px] text-amber-400/80">
                      Dicipta oleh {recipe.Dicipta_Oleh}.
                    </span>
                  </div>
                </div>

                {isAdmin && (
                  <button
                    onClick={handleApprove}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow transition-all whitespace-nowrap"
                  >
                    Luluskan & Terbitkan
                  </button>
                )}
              </div>
            )}

            {/* Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#1a1a1a] p-3 rounded-xl border border-zinc-800/80 text-center text-xs">
              <div>
                <span className="text-zinc-400 text-[10px] block">Penyediaan</span>
                <strong className="text-zinc-200 text-sm">
                  {recipe.Masa_Penyediaan_Minit || 0} min
                </strong>
              </div>
              <div>
                <span className="text-zinc-400 text-[10px] block">Memasak</span>
                <strong className="text-zinc-200 text-sm">
                  {recipe.Masa_Memasak_Minit || 0} min
                </strong>
              </div>
              <div>
                <span className="text-zinc-400 text-[10px] block">Jumlah Masa</span>
                <strong className="text-indigo-400 text-sm font-black">
                  {totalTime} min
                </strong>
              </div>
              <div>
                <span className="text-zinc-400 text-[10px] block">Bil. Hidangan</span>
                <strong className="text-zinc-200 text-sm">
                  {recipe.Bilangan_Hidangan} orang
                </strong>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Pengenalan Masakan
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed bg-[#1a1a1a] p-3 rounded-xl border border-zinc-800 italic">
                "{recipe.Deskripsi}"
              </p>
            </div>

            {/* Ingredients Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Bahan-Bahan Ramuan ({recipeBahan.length})
                </h3>
                <span className="text-[11px] text-zinc-400">
                  Tandakan bahan yang telah disediakan
                </span>
              </div>

              {Object.keys(groupedIngredients).length === 0 ? (
                <p className="text-xs text-zinc-500 italic">Tiada ramuan direkodkan.</p>
              ) : (
                Object.keys(groupedIngredients).map((group) => (
                  <div key={group} className="space-y-1">
                    <h4 className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                      {group}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                      {groupedIngredients[group].map((b) => {
                        const isDone = checkedIngredients[b.ID_Bahan];
                        return (
                          <div
                            key={b.ID_Bahan}
                            onClick={() => toggleCheck(b.ID_Bahan)}
                            className={`p-2 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-all ${
                              isDone
                                ? 'bg-indigo-500/10 border-indigo-500/30 text-zinc-500 line-through'
                                : 'bg-[#1a1a1a] border-zinc-800 hover:border-zinc-700 text-zinc-200'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <CheckCircle2
                                className={`w-4 h-4 ${
                                   isDone ? 'text-indigo-400' : 'text-zinc-600'
                                }`}
                              />
                              <span>{b.Nama_Bahan}</span>
                            </span>
                            <span className="font-semibold text-zinc-100 whitespace-nowrap ml-2">
                              {b.Kuantiti} {b.Unit !== 'secukup rasa' ? b.Unit : ''}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Steps Section */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-zinc-100 border-b border-zinc-800 pb-2">
                Langkah-Langkah Penyediaan Bertajuk ({recipeLangkah.length})
              </h3>

              {recipeLangkah.length === 0 ? (
                <p className="text-xs text-zinc-500 italic">Tiada langkah direkodkan.</p>
              ) : (
                <div className="space-y-3">
                  {recipeLangkah.map((step) => (
                    <div
                      key={step.ID_Langkah}
                      className="p-3.5 rounded-xl bg-[#1a1a1a] border border-zinc-800 flex items-start space-x-3"
                    >
                      <span className="bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow">
                        {step.Nombor_Langkah}
                      </span>
                      <div className="space-y-1 text-xs">
                        <h4 className="font-bold text-zinc-100 text-sm">
                          {step.Tajuk_Langkah}
                        </h4>
                        <p className="text-zinc-300 leading-relaxed">
                          {step.Arahan}
                        </p>
                        {step.Masa_Minit && (
                          <span className="inline-block text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded font-medium">
                            Masa: {step.Masa_Minit} minit
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>


        </div>
      </div>

      {/* Pdf Cookbook Modal Trigger */}
      {showPdfModal && (
        <PdfCookbookModal
          recipe={recipe}
          ingredients={recipeBahan}
          steps={recipeLangkah}
          onClose={() => setShowPdfModal(false)}
        />
      )}
    </>
  );
};
