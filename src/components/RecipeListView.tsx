import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  X,
  Clock,
  ChevronRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ResepiMaster } from '../types';

interface RecipeListViewProps {
  onSelectRecipe: (recipe: ResepiMaster) => void;
  initialCategoryFilter?: string;
}

export const RecipeListView: React.FC<RecipeListViewProps> = ({
  onSelectRecipe,
  initialCategoryFilter,
}) => {
  const { recipes, bahanList, masterData } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKategori, setSelectedKategori] = useState<string>(
    initialCategoryFilter || ''
  );
  const [selectedEtnik, setSelectedEtnik] = useState<string>('');
  const [selectedNegeri, setSelectedNegeri] = useState<string>('');
  const [selectedJenis, setSelectedJenis] = useState<string>('');
  const [selectedKesukaran, setSelectedKesukaran] = useState<string>('');

  useEffect(() => {
    if (initialCategoryFilter) {
      setSelectedKategori(initialCategoryFilter);
    }
  }, [initialCategoryFilter]);

  // Filter recipes (only published recipes for standard gallery view)
  const publishedRecipes = recipes.filter((r) => r.Status === 'Diterbitkan');

  const filteredRecipes = publishedRecipes.filter((recipe) => {
    // Search match
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const nameMatch = recipe.Nama_Resepi.toLowerCase().includes(term);
      const descMatch = recipe.Deskripsi.toLowerCase().includes(term);

      // Search in ingredients
      const recipeBahan = bahanList.filter((b) => b.ID_Resepi === recipe.ID_Resepi);
      const bahanMatch = recipeBahan.some((b) =>
        b.Nama_Bahan.toLowerCase().includes(term)
      );

      if (!nameMatch && !descMatch && !bahanMatch) return false;
    }

    if (selectedKategori && recipe.Kategori_Masakan !== selectedKategori) {
      return false;
    }
    if (selectedEtnik && recipe.Etnik_Kaum !== selectedEtnik) {
      return false;
    }
    if (selectedNegeri && recipe.Negeri_Asal !== selectedNegeri) {
      return false;
    }
    if (selectedJenis && recipe.Jenis_Hidangan !== selectedJenis) {
      return false;
    }
    if (selectedKesukaran && recipe.Tahap_Kesukaran !== selectedKesukaran) {
      return false;
    }

    return true;
  });

  const hasActiveFilters =
    searchTerm ||
    selectedKategori ||
    selectedEtnik ||
    selectedNegeri ||
    selectedJenis ||
    selectedKesukaran;

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedKategori('');
    setSelectedEtnik('');
    setSelectedNegeri('');
    setSelectedJenis('');
    setSelectedKesukaran('');
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Title Header */}
      <div>
        <h2 className="text-xl font-extrabold text-zinc-100 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-400" />
          Senarai Resepi Warisan (Gallery View)
        </h2>
        <p className="text-xs text-zinc-400">
          Koleksi masakan yang telah disemak dan diterbitkan oleh Unit PKK KEMAS Perlis
        </p>
      </div>

      {/* Search Bar & Dropdown Filters Container */}
      <div className="bg-[#121212] p-4 rounded-xl border border-zinc-800 shadow-sm space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-3 text-zinc-500" />
          <input
            type="text"
            placeholder="Cari nama resepi, deskripsi, atau ramuan (cth: Daging, Laksa, Santan)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#1a1a1a] border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-zinc-100 placeholder-zinc-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown Selectors Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {/* Kategori Masakan Ref */}
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 mb-1">
              Kategori
            </label>
            <select
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
              className="w-full text-xs p-2 bg-[#1a1a1a] border border-zinc-800 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none text-zinc-200"
            >
              <option value="">Semua Kategori</option>
              {masterData.Kategori_Masakan.filter((k) => k.Aktif).map((k) => (
                <option key={k.Nama} value={k.Nama}>
                  {k.Nama}
                </option>
              ))}
            </select>
          </div>

          {/* Etnik Kaum Ref */}
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 mb-1">
              Etnik / Kaum
            </label>
            <select
              value={selectedEtnik}
              onChange={(e) => setSelectedEtnik(e.target.value)}
              className="w-full text-xs p-2 bg-[#1a1a1a] border border-zinc-800 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none text-zinc-200"
            >
              <option value="">Semua Etnik</option>
              {masterData.Etnik_Kaum.filter((e) => e.Aktif).map((e) => (
                <option key={e.Nama} value={e.Nama}>
                  {e.Nama}
                </option>
              ))}
            </select>
          </div>

          {/* Negeri Asal Ref */}
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 mb-1">
              Negeri Asal
            </label>
            <select
              value={selectedNegeri}
              onChange={(e) => setSelectedNegeri(e.target.value)}
              className="w-full text-xs p-2 bg-[#1a1a1a] border border-zinc-800 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none text-zinc-200"
            >
              <option value="">Semua Negeri</option>
              {masterData.Negeri_Asal.filter((n) => n.Aktif).map((n) => (
                <option key={n.Nama} value={n.Nama}>
                  {n.Nama}
                </option>
              ))}
            </select>
          </div>

          {/* Jenis Hidangan Ref */}
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 mb-1">
              Jenis Hidangan
            </label>
            <select
              value={selectedJenis}
              onChange={(e) => setSelectedJenis(e.target.value)}
              className="w-full text-xs p-2 bg-[#1a1a1a] border border-zinc-800 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none text-zinc-200"
            >
              <option value="">Semua Jenis</option>
              {masterData.Jenis_Hidangan.filter((j) => j.Aktif).map((j) => (
                <option key={j.Nama} value={j.Nama}>
                  {j.Nama}
                </option>
              ))}
            </select>
          </div>

          {/* Tahap Kesukaran */}
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 mb-1">
              Kesukaran
            </label>
            <select
              value={selectedKesukaran}
              onChange={(e) => setSelectedKesukaran(e.target.value)}
              className="w-full text-xs p-2 bg-[#1a1a1a] border border-zinc-800 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none text-zinc-200"
            >
              <option value="">Semua Kesukaran</option>
              <option value="Mudah">Mudah</option>
              <option value="Sederhana">Sederhana</option>
              <option value="Sukar">Sukar</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="flex justify-between items-center pt-2 border-t border-zinc-800 text-xs">
            <span className="text-zinc-400">
              Menunjukkan{' '}
              <strong className="text-zinc-100">{filteredRecipes.length}</strong>{' '}
              daripada {publishedRecipes.length} resepi
            </span>
            <button
              onClick={resetFilters}
              className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20"
            >
              <X className="w-3.5 h-3.5" /> Reset Penapis
            </button>
          </div>
        )}
      </div>

      {/* Gallery Cards Grid */}
      {filteredRecipes.length === 0 ? (
        <div className="bg-[#121212] p-12 text-center rounded-2xl border border-zinc-800 shadow-sm space-y-3">
          <Filter className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-zinc-300">
            Tiada Resepi Dijumpai
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Sila cuba kata kunci carian berlainan atau tekan "Reset Penapis" di atas.
          </p>
          <button
            onClick={resetFilters}
            className="text-xs font-medium bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-500"
          >
            Reset Semua Penapis
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.ID_Resepi}
              onClick={() => onSelectRecipe(recipe)}
              className="bg-[#121212] rounded-xl border border-zinc-800 hover:border-zinc-700 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden bg-zinc-900">
                  <img
                    src={recipe.Gambar_Utama}
                    alt={recipe.Nama_Resepi}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    <span className="bg-indigo-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm">
                      {recipe.Kategori_Masakan}
                    </span>
                    {recipe.Negeri_Asal && (
                      <span className="bg-amber-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm">
                        {recipe.Negeri_Asal}
                      </span>
                    )}
                  </div>

                  <span
                    className={`absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      recipe.Tahap_Kesukaran === 'Mudah'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : recipe.Tahap_Kesukaran === 'Sederhana'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {recipe.Tahap_Kesukaran}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-zinc-100 text-base group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {recipe.Nama_Resepi}
                  </h3>
                  <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed">
                    {recipe.Deskripsi}
                  </p>
                </div>
              </div>

              <div className="px-4 py-3 bg-[#1a1a1a] border-t border-zinc-800/80 flex items-center justify-between text-zinc-400 text-[11px]">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {(recipe.Masa_Penyediaan_Minit || 0) +
                      (recipe.Masa_Memasak_Minit || 0)}{' '}
                    minit • {recipe.Bilangan_Hidangan} hidangan
                  </span>
                </div>
                <span className="text-indigo-400 font-bold group-hover:underline flex items-center gap-0.5">
                  Butiran <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
