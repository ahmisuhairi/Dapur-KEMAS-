import React from 'react';
import {
  BookOpen,
  FolderHeart,
  Clock,
  Sparkles,
  ChevronRight,
  PlusCircle,
  ShieldAlert,
  Flame,
  Award,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { ResepiMaster } from '../types';

interface DashboardViewProps {
  onSelectRecipe: (recipe: ResepiMaster) => void;
  onNavigateToTab: (tab: 'senarai' | 'tambah' | 'tetapan', categoryFilter?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectRecipe,
  onNavigateToTab,
}) => {
  const { recipes, masterData, isAdmin, currentUser } = useApp();

  const publishedRecipes = recipes.filter((r) => r.Status === 'Diterbitkan');
  const draftRecipes = recipes.filter((r) => r.Status === 'Draf');

  // Deck View: Top 5 recently published recipes
  const recentRecipes = [...publishedRecipes]
    .sort(
      (a, b) =>
        new Date(b.Tarikh_Kemaskini).getTime() -
        new Date(a.Tarikh_Kemaskini).getTime()
    )
    .slice(0, 5);

  // Category counts for Recharts Bar Chart
  const categoryCountsMap: Record<string, number> = {};
  masterData.Kategori_Masakan.forEach((cat) => {
    if (cat.Aktif) categoryCountsMap[cat.Nama] = 0;
  });

  publishedRecipes.forEach((r) => {
    if (categoryCountsMap[r.Kategori_Masakan] !== undefined) {
      categoryCountsMap[r.Kategori_Masakan] += 1;
    } else {
      categoryCountsMap[r.Kategori_Masakan] = 1;
    }
  });

  const chartData = Object.keys(categoryCountsMap).map((cat) => ({
    name: cat,
    jumlah: categoryCountsMap[cat],
  }));

  const COLORS = ['#27ae60', '#e67e22', '#2980b9', '#8e44ad', '#16a085', '#f39c12'];

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-900 via-[#121212] to-zinc-950 text-zinc-100 p-6 sm:p-8 shadow-2xl border border-zinc-800">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Unit PKK KEMAS Negeri Perlis</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-100 leading-snug">
            Sistem Resepi Masakan Digital Warisan Malaysia & Asia
          </h2>

          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
            Platform rasmi pendigitalan koleksi masakan tradisional warisan KEMAS Perlis.
            Cari, simpan, dan muat turun PDF Cookbook berformat profesional secara percuma.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigateToTab('senarai')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-md shadow-lg shadow-indigo-900/20 text-xs sm:text-sm flex items-center space-x-2 transition-all active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>Jelajah Senarai Resepi</span>
            </button>

            {isAdmin && draftRecipes.length > 0 && (
              <button
                onClick={() => onNavigateToTab('tetapan')}
                className="bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 font-medium px-4 py-2 rounded-md text-xs sm:text-sm flex items-center space-x-2 shadow-md border border-amber-500/30 animate-pulse"
              >
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>{draftRecipes.length} Resepi Draf Memerlukan Semakan</span>
              </button>
            )}
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
          <Flame className="w-72 h-72 text-indigo-400" />
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[#121212] p-4 rounded-xl border border-zinc-800 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-light tracking-tighter text-zinc-100">
              {publishedRecipes.length}
            </div>
            <div className="text-[11px] text-zinc-400 font-medium">
              Resepi Diterbitkan
            </div>
          </div>
        </div>

        <div className="bg-[#121212] p-4 rounded-xl border border-zinc-800 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <FolderHeart className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-light tracking-tighter text-zinc-100">
              {masterData.Kategori_Masakan.filter((k) => k.Aktif).length}
            </div>
            <div className="text-[11px] text-zinc-400 font-medium">
              Kategori Active
            </div>
          </div>
        </div>

        <div className="bg-[#121212] p-4 rounded-xl border border-zinc-800 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-light tracking-tighter text-zinc-100">
              {masterData.Negeri_Asal.filter((n) => n.Aktif).length}
            </div>
            <div className="text-[11px] text-zinc-400 font-medium">
              Negeri/Etnik
            </div>
          </div>
        </div>

        <div className="bg-[#121212] p-4 rounded-xl border border-zinc-800 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-light tracking-tighter text-zinc-100">
              {draftRecipes.length}
            </div>
            <div className="text-[11px] text-zinc-400 font-medium">
              Resepi Draf
            </div>
          </div>
        </div>
      </div>

      {/* Deck View: Resepi Terkini (Limit 5) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              Resepi Terkini (Deck View)
            </h3>
            <p className="text-xs text-zinc-400">
              5 masakan warisan terbaharu diterbitkan oleh Unit PKK KEMAS
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('senarai')}
            className="text-xs text-indigo-400 font-medium hover:underline flex items-center gap-0.5"
          >
            Lihat Semua <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentRecipes.map((recipe) => (
            <div
              key={recipe.ID_Resepi}
              onClick={() => onSelectRecipe(recipe)}
              className="bg-[#121212] rounded-xl border border-zinc-800 hover:border-zinc-700 shadow-sm transition-all cursor-pointer overflow-hidden group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-40 overflow-hidden bg-zinc-900">
                  <img
                    src={recipe.Gambar_Utama}
                    alt={recipe.Nama_Resepi}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute top-2 left-2 flex gap-1">
                    <span className="bg-indigo-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm">
                      {recipe.Kategori_Masakan}
                    </span>
                    <span className="bg-amber-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm">
                      {recipe.Negeri_Asal || 'Perlis'}
                    </span>
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

                <div className="p-3.5 space-y-1.5">
                  <h4 className="font-bold text-zinc-100 text-sm group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {recipe.Nama_Resepi}
                  </h4>
                  <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed">
                    {recipe.Deskripsi}
                  </p>
                </div>
              </div>

              <div className="px-3.5 py-2.5 bg-[#1a1a1a] border-t border-zinc-800/80 flex items-center justify-between text-zinc-400 text-[11px]">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {(recipe.Masa_Penyediaan_Minit || 0) +
                      (recipe.Masa_Memasak_Minit || 0)}{' '}
                    minit
                  </span>
                </div>
                <span className="text-indigo-400 font-medium text-[11px] group-hover:underline flex items-center gap-0.5">
                  Buka Resepi <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart: Kategori Popular */}
      <div className="bg-[#121212] p-5 rounded-xl border border-zinc-800 shadow-sm space-y-3">
        <div>
          <h3 className="text-base font-bold text-zinc-100">
            Kategori Popular (Taburan Masakan)
          </h3>
          <p className="text-xs text-zinc-400">
            Analisis bilangan resepi diterbitkan mengikut kategori masakan
          </p>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
            >
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: '#a1a1aa' }}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis tick={{ fontSize: 10, fill: '#a1a1aa' }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  borderColor: '#27272a',
                  borderRadius: '8px',
                  color: '#f4f4f5',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="jumlah" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Master Categories Quick Filter Buttons */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-zinc-200">
          Kategori Masakan Master Data
        </h3>
        <div className="flex flex-wrap gap-2">
          {masterData.Kategori_Masakan.filter((c) => c.Aktif).map((cat) => (
            <button
              key={cat.Nama}
              onClick={() => onNavigateToTab('senarai', cat.Nama)}
              className="bg-[#1a1a1a] hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            >
              {cat.Nama}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
