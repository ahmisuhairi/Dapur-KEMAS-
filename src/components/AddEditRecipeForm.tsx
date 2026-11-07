import React, { useState } from 'react';
import {
  PlusCircle,
  Trash2,
  Save,
  AlertCircle,
  Clock,
  Sparkles,
  ChefHat,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  ResepiMaster,
  BahanResepi,
  LangkahResepi,
  TahapKesukaran,
  UnitBahan,
} from '../types';

interface AddEditRecipeFormProps {
  initialRecipe?: ResepiMaster;
  onSuccess: () => void;
}

const UNIT_OPTIONS: UnitBahan[] = [
  'gram',
  'kg',
  'ml',
  'liter',
  'biji',
  'ulas',
  'sudu besar',
  'sudu teh',
  'cawan',
  'secukup rasa',
];

export const AddEditRecipeForm: React.FC<AddEditRecipeFormProps> = ({
  initialRecipe,
  onSuccess,
}) => {
  const {
    masterData,
    saveRecipe,
    canAddRecipe,
    isAdmin,
    currentUser,
    setCurrentUserEmail,
    users,
    bahanList,
    langkahList,
  } = useApp();

  // Pre-fill initial values if editing
  const initialBahan = initialRecipe
    ? bahanList.filter((b) => b.ID_Resepi === initialRecipe.ID_Resepi)
    : [
        {
          ID_Bahan: 'BHN-1',
          ID_Resepi: '',
          Kumpulan_Bahan: 'Bahan Utama',
          Nama_Bahan: '',
          Kuantiti: '1',
          Unit: 'secukup rasa' as UnitBahan,
          Turutan: 1,
        },
      ];

  const initialLangkah = initialRecipe
    ? langkahList.filter((l) => l.ID_Resepi === initialRecipe.ID_Resepi)
    : [
        {
          ID_Langkah: 'LKG-1',
          ID_Resepi: '',
          Nombor_Langkah: 1,
          Tajuk_Langkah: '',
          Arahan: '',
          Masa_Minit: 10,
        },
      ];

  // Active Master Data Filter (Valid_If formula check)
  const activeCategories = masterData.Kategori_Masakan.filter((k) => k.Aktif);
  const activeEthnik = masterData.Etnik_Kaum.filter((e) => e.Aktif);
  const activeNegeri = masterData.Negeri_Asal.filter((n) => n.Aktif);
  const activeJenis = masterData.Jenis_Hidangan.filter((j) => j.Aktif);

  // Form State
  const [namaResepi, setNamaResepi] = useState(
    initialRecipe?.Nama_Resepi || ''
  );
  const [kategori, setKategori] = useState(
    initialRecipe?.Kategori_Masakan || activeCategories[0]?.Nama || ''
  );
  const [etnik, setEtnik] = useState(
    initialRecipe?.Etnik_Kaum || activeEthnik[0]?.Nama || ''
  );
  const [negeri, setNegeri] = useState(
    initialRecipe?.Negeri_Asal || activeNegeri[0]?.Nama || ''
  );
  const [jenis, setJenis] = useState(
    initialRecipe?.Jenis_Hidangan || activeJenis[0]?.Nama || ''
  );
  const [kesukaran, setKesukaran] = useState<TahapKesukaran>(
    initialRecipe?.Tahap_Kesukaran || 'Sederhana'
  );
  const [masaPrep, setMasaPrep] = useState<number>(
    initialRecipe?.Masa_Penyediaan_Minit || 20
  );
  const [masaCook, setMasaCook] = useState<number>(
    initialRecipe?.Masa_Memasak_Minit || 30
  );
  const [bilHidangan, setBilHidangan] = useState<number>(
    initialRecipe?.Bilangan_Hidangan || 4
  );
  const [deskripsi, setDeskripsi] = useState(initialRecipe?.Deskripsi || '');
  const [gambarUtama, setGambarUtama] = useState(
    initialRecipe?.Gambar_Utama ||
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'
  );
  const [status, setStatus] = useState<'Draf' | 'Diterbitkan'>(
    initialRecipe?.Status === 'Diterbitkan' ? 'Diterbitkan' : 'Draf'
  );

  // Dynamic lists
  const [ingredients, setIngredients] = useState<Partial<BahanResepi>[]>(
    initialBahan
  );
  const [steps, setSteps] = useState<Partial<LangkahResepi>[]>(initialLangkah);

  // Field validation error state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Show_If Check
  if (!canAddRecipe) {
    const penyumbangUser = users.find((u) => u.Role === 'Penyumbang');
    const adminUser = users.find((u) => u.Role === 'Admin');

    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-xl mx-auto text-center space-y-4 my-6">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-700">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-extrabold text-slate-800">
          Capaian Borang Terhad (Show_If)
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Mengikut matriks kebenaran akses Dapur KEMAS, peranan{' '}
          <strong className="text-slate-900">Pengguna (Akses Read-Only)</strong>{' '}
          tidak dibenarkan menambah resepi baharu.
        </p>
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 text-left space-y-2">
          <strong>Uji Borang Tambah Resepi:</strong>
          <p className="text-[11px] text-amber-800">
            Tukar peranan anda kepada Penyumbang atau Admin untuk menguji kemasukan borang ini.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {penyumbangUser && (
              <button
                onClick={() => setCurrentUserEmail(penyumbangUser.Emel)}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow-sm"
              >
                Log Masuk sebagai Penyumbang <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {adminUser && (
              <button
                onClick={() => setCurrentUserEmail(adminUser.Emel)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow-sm"
              >
                Log Masuk sebagai Admin <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Handle Add / Remove Ingredients
  const addIngredientRow = () => {
    setIngredients((prev) => [
      ...prev,
      {
        ID_Bahan: `BHN-${Date.now()}`,
        Kumpulan_Bahan: prev[prev.length - 1]?.Kumpulan_Bahan || 'Bahan Utama',
        Nama_Bahan: '',
        Kuantiti: '1',
        Unit: 'secukup rasa',
        Turutan: prev.length + 1,
      },
    ]);
  };

  const removeIngredientRow = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const updateIngredientRow = (
    index: number,
    field: keyof BahanResepi,
    value: string
  ) => {
    setIngredients((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Handle Add / Remove Steps
  const addStepRow = () => {
    setSteps((prev) => [
      ...prev,
      {
        ID_Langkah: `LKG-${Date.now()}`,
        Nombor_Langkah: prev.length + 1,
        Tajuk_Langkah: '',
        Arahan: '',
        Masa_Minit: 10,
      },
    ]);
  };

  const removeStepRow = (index: number) => {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  };

  const updateStepRow = (
    index: number,
    field: keyof LangkahResepi,
    value: any
  ) => {
    setSteps((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Validation Check (Section 19 Matrix Test)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!namaResepi.trim()) {
      newErrors.namaResepi = 'Nama Resepi adalah medan wajib (Required)';
    }

    // Check step titles
    steps.forEach((step, idx) => {
      if (!step.Tajuk_Langkah || !step.Tajuk_Langkah.trim()) {
        newErrors[`step_title_${idx}`] = `Tajuk Langkah ${
          idx + 1
        } adalah wajib diisi`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    saveRecipe(
      {
        ID_Resepi: initialRecipe?.ID_Resepi,
        Nama_Resepi: namaResepi,
        Kategori_Masakan: kategori,
        Etnik_Kaum: etnik,
        Negeri_Asal: negeri,
        Jenis_Hidangan: jenis,
        Tahap_Kesukaran: kesukaran,
        Masa_Penyediaan_Minit: Number(masaPrep),
        Masa_Memasak_Minit: Number(masaCook),
        Bilangan_Hidangan: Number(bilHidangan),
        Deskripsi: deskripsi,
        Gambar_Utama: gambarUtama,
        Status: isAdmin ? status : 'Draf',
        Tarikh_Cipta: initialRecipe?.Tarikh_Cipta,
        Dicipta_Oleh: initialRecipe?.Dicipta_Oleh || currentUser.Emel,
      },
      ingredients,
      steps
    );

    alert(
      !isAdmin
        ? 'Resepi baharu telah disimpan sebagai Draf! Notifikasi automatik (Bot 2) dikirimkan kepada Admin untuk semakan kelulusan.'
        : 'Resepi berjaya disimpan!'
    );

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Title Header */}
      <div className="bg-[#121212] text-zinc-100 p-5 rounded-2xl shadow-xl border border-zinc-800 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <ChefHat className="w-4 h-4" />
            <span>
              {initialRecipe ? 'Kemaskini Resepi' : 'Tambah Resepi Baharu'}
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-zinc-100 mt-1">
            Borang Pendaftaran Resepi Warisan
          </h2>
        </div>

        <div className="text-right">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              isAdmin ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
            }`}
          >
            Sesi: {currentUser.Role}
          </span>
        </div>
      </div>

      {/* Required Validation Notice */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl text-rose-300 text-xs space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-sm text-rose-400">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            Sila betulkan ralat borang sebelum menyimpan:
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-rose-300">
            {Object.values(errors).map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Section 1: Maklumat Utama Resepi */}
      <div className="bg-[#121212] p-5 sm:p-6 rounded-2xl border border-zinc-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-zinc-100 border-b border-zinc-800 pb-2 uppercase tracking-wide flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" /> 1. Maklumat Utama Resepi
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nama Resepi (Req) */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-zinc-300 mb-1">
              Nama Resepi <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="cth: Rendang Daging Warisan Perlis"
              value={namaResepi}
              onChange={(e) => setNamaResepi(e.target.value)}
              className={`w-full text-xs sm:text-sm p-2.5 bg-[#1a1a1a] text-zinc-100 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                errors.namaResepi
                  ? 'border-rose-500 bg-rose-500/10'
                  : 'border-zinc-800'
              }`}
            />
            {errors.namaResepi && (
              <p className="text-[11px] text-rose-400 font-semibold mt-1">
                {errors.namaResepi}
              </p>
            )}
          </div>

          {/* Kategori Masakan (Ref) */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">
              Kategori Masakan (Ref) <span className="text-rose-400">*</span>
            </label>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="w-full text-xs p-2.5 bg-[#1a1a1a] text-zinc-100 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {activeCategories.map((c) => (
                <option key={c.Nama} value={c.Nama}>
                  {c.Nama}
                </option>
              ))}
            </select>
          </div>

          {/* Etnik Kaum (Ref) */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">
              Etnik / Kaum (Ref)
            </label>
            <select
              value={etnik}
              onChange={(e) => setEtnik(e.target.value)}
              className="w-full text-xs p-2.5 bg-[#1a1a1a] text-zinc-100 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {activeEthnik.map((e) => (
                <option key={e.Nama} value={e.Nama}>
                  {e.Nama}
                </option>
              ))}
            </select>
          </div>

          {/* Negeri Asal (Ref) */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">
              Negeri Asal (Ref)
            </label>
            <select
              value={negeri}
              onChange={(e) => setNegeri(e.target.value)}
              className="w-full text-xs p-2.5 bg-[#1a1a1a] text-zinc-100 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {activeNegeri.map((n) => (
                <option key={n.Nama} value={n.Nama}>
                  {n.Nama}
                </option>
              ))}
            </select>
          </div>

          {/* Jenis Hidangan (Ref) */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">
              Jenis Hidangan (Ref) <span className="text-rose-400">*</span>
            </label>
            <select
              value={jenis}
              onChange={(e) => setJenis(e.target.value)}
              className="w-full text-xs p-2.5 bg-[#1a1a1a] text-zinc-100 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {activeJenis.map((j) => (
                <option key={j.Nama} value={j.Nama}>
                  {j.Nama}
                </option>
              ))}
            </select>
          </div>

          {/* Tahap Kesukaran */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">
              Tahap Kesukaran <span className="text-rose-400">*</span>
            </label>
            <select
              value={kesukaran}
              onChange={(e) => setKesukaran(e.target.value as TahapKesukaran)}
              className="w-full text-xs p-2.5 bg-[#1a1a1a] text-zinc-100 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="Mudah">Mudah</option>
              <option value="Sederhana">Sederhana</option>
              <option value="Sukar">Sukar</option>
            </select>
          </div>

          {/* Bilangan Hidangan */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">
              Bilangan Hidangan (Orang)
            </label>
            <input
              type="number"
              min={1}
              value={bilHidangan}
              onChange={(e) => setBilHidangan(Number(e.target.value))}
              className="w-full text-xs p-2.5 bg-[#1a1a1a] text-zinc-100 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Masa Penyediaan & Memasak */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">
              Masa Penyediaan (Minit)
            </label>
            <input
              type="number"
              min={0}
              value={masaPrep}
              onChange={(e) => setMasaPrep(Number(e.target.value))}
              className="w-full text-xs p-2.5 bg-[#1a1a1a] text-zinc-100 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">
              Masa Memasak (Minit)
            </label>
            <input
              type="number"
              min={0}
              value={masaCook}
              onChange={(e) => setMasaCook(Number(e.target.value))}
              className="w-full text-xs p-2.5 bg-[#1a1a1a] text-zinc-100 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Gambar Utama URL */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-zinc-300 mb-1">
              Gambar Utama URL (Gambar Hero)
            </label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={gambarUtama}
              onChange={(e) => setGambarUtama(e.target.value)}
              className="w-full text-xs p-2.5 bg-[#1a1a1a] text-zinc-100 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Deskripsi */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-zinc-300 mb-1">
              Deskripsi / Pengenalan Resepi
            </label>
            <textarea
              rows={3}
              placeholder="Tulis ringkasan asal-usul atau keistimewaan hidangan warisan ini..."
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="w-full text-xs p-2.5 bg-[#1a1a1a] text-zinc-100 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Status Selection (Editable_If Admin) */}
          {isAdmin && (
            <div className="sm:col-span-2 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
              <label className="block text-xs font-bold text-amber-400 mb-1">
                Status Kelulusan Resepi (Editable_If Admin)
              </label>
              <div className="flex gap-4 text-xs font-semibold">
                <label className="flex items-center space-x-1.5 cursor-pointer text-zinc-300">
                  <input
                    type="radio"
                    name="status"
                    value="Draf"
                    checked={status === 'Draf'}
                    onChange={() => setStatus('Draf')}
                    className="text-amber-500 focus:ring-amber-500"
                  />
                  <span>Simpan Sebagai Draf</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="Diterbitkan"
                    checked={status === 'Diterbitkan'}
                    onChange={() => setStatus('Diterbitkan')}
                    className="text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-emerald-400 font-bold">
                    Luluskan & Terbitkan
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Bahan-Bahan Ramuan (One-to-Many) */}
      <div className="bg-[#121212] p-5 sm:p-6 rounded-2xl border border-zinc-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wide flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> 2. Pengurusan Ramuan (Bahan_Resepi)
          </h3>
          <button
            type="button"
            onClick={addIngredientRow}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-md shadow-indigo-900/20"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Tambah Baris Bahan
          </button>
        </div>

        <div className="space-y-2">
          {ingredients.map((ing, idx) => (
            <div
              key={ing.ID_Bahan || idx}
              className="grid grid-cols-12 gap-2 bg-[#1a1a1a] p-2.5 rounded-xl border border-zinc-800/80 items-center text-xs"
            >
              {/* Kumpulan Bahan */}
              <div className="col-span-12 sm:col-span-3">
                <input
                  type="text"
                  placeholder="Kumpulan (cth: Bahan Utama)"
                  value={ing.Kumpulan_Bahan || ''}
                  onChange={(e) =>
                    updateIngredientRow(idx, 'Kumpulan_Bahan', e.target.value)
                  }
                  className="w-full text-xs p-2 bg-[#121212] text-zinc-100 border border-zinc-800 rounded-lg focus:outline-none"
                />
              </div>

              {/* Nama Bahan */}
              <div className="col-span-12 sm:col-span-4">
                <input
                  type="text"
                  placeholder="Nama Bahan (cth: Daging Pejal)"
                  value={ing.Nama_Bahan || ''}
                  onChange={(e) =>
                    updateIngredientRow(idx, 'Nama_Bahan', e.target.value)
                  }
                  className="w-full text-xs p-2 bg-[#121212] text-zinc-100 border border-zinc-800 rounded-lg focus:outline-none"
                />
              </div>

              {/* Kuantiti */}
              <div className="col-span-6 sm:col-span-2">
                <input
                  type="text"
                  placeholder="Kuantiti"
                  value={ing.Kuantiti || ''}
                  onChange={(e) =>
                    updateIngredientRow(idx, 'Kuantiti', e.target.value)
                  }
                  className="w-full text-xs p-2 bg-[#121212] text-zinc-100 border border-zinc-800 rounded-lg focus:outline-none"
                />
              </div>

              {/* Unit Enum */}
              <div className="col-span-5 sm:col-span-2">
                <select
                  value={ing.Unit || 'secukup rasa'}
                  onChange={(e) =>
                    updateIngredientRow(idx, 'Unit', e.target.value)
                  }
                  className="w-full text-xs p-2 bg-[#121212] text-zinc-100 border border-zinc-800 rounded-lg focus:outline-none"
                >
                  {UNIT_OPTIONS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              {/* Delete */}
              <div className="col-span-1 text-center">
                <button
                  type="button"
                  onClick={() => removeIngredientRow(idx)}
                  className="text-rose-400 hover:text-rose-300 p-1"
                  title="Padam baris"
                >
                  <Trash2 className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Langkah-Langkah Memasak (Tajuk Langkah) */}
      <div className="bg-[#121212] p-5 sm:p-6 rounded-2xl border border-zinc-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <div>
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> 3. Langkah Memasak
            </h3>
            <p className="text-[11px] text-zinc-400">
              Setiap langkah wajib mempunyai Tajuk Langkah ringkas untuk susunan teratur
            </p>
          </div>
          <button
            type="button"
            onClick={addStepRow}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-md shadow-indigo-900/20 shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Tambah Langkah
          </button>
        </div>

        <div className="space-y-3">
          {steps.map((step, idx) => (
            <div
              key={step.ID_Langkah || idx}
              className="bg-[#1a1a1a] p-3.5 rounded-xl border border-zinc-800 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-md">
                  Langkah #{idx + 1}
                </span>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <span className="text-[10px] text-zinc-400">Masa (min):</span>
                    <input
                      type="number"
                      min={0}
                      value={step.Masa_Minit || 10}
                      onChange={(e) =>
                        updateStepRow(idx, 'Masa_Minit', Number(e.target.value))
                      }
                      className="w-16 text-xs p-1 bg-[#121212] text-zinc-100 border border-zinc-800 rounded focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeStepRow(idx)}
                    className="text-rose-400 hover:text-rose-300 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tajuk Langkah */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                  Tajuk Langkah <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="cth: Penyediaan Bahan & Kisar Rempah"
                  value={step.Tajuk_Langkah || ''}
                  onChange={(e) =>
                    updateStepRow(idx, 'Tajuk_Langkah', e.target.value)
                  }
                  className={`w-full text-xs p-2 bg-[#121212] text-zinc-100 border rounded-lg focus:outline-none ${
                    errors[`step_title_${idx}`]
                      ? 'border-rose-500 bg-rose-500/10'
                      : 'border-zinc-800'
                  }`}
                />
                {errors[`step_title_${idx}`] && (
                  <p className="text-[10px] text-rose-400 font-semibold mt-0.5">
                    {errors[`step_title_${idx}`]}
                  </p>
                )}
              </div>

              {/* Arahan Penuh */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                  Arahan Penuh
                </label>
                <textarea
                  rows={2}
                  placeholder="Huraian terperinci arahan memasak..."
                  value={step.Arahan || ''}
                  onChange={(e) => updateStepRow(idx, 'Arahan', e.target.value)}
                  className="w-full text-xs p-2 bg-[#121212] text-zinc-100 border border-zinc-800 rounded-lg focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Action Toolbar */}
      <div className="bg-[#121212] p-4 rounded-2xl border border-zinc-800 shadow-xl flex items-center justify-between gap-3">
        <div className="text-xs text-zinc-400">
          Status Simpanan: <strong className="text-zinc-200">{isAdmin ? status : 'Draf'}</strong>
        </div>

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-900/20 transition-all active:scale-95"
        >
          <Save className="w-4 h-4 text-amber-400" />
          <span>Simpan Resepi ({isAdmin ? status : 'Draf (Bot 2)'})</span>
        </button>
      </div>
    </form>
  );
};
