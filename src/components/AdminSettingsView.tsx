import React, { useState } from 'react';
import {
  Settings,
  CheckCircle2,
  ListPlus,
  Users,
  FileText,
  Plus,
  Power,
  ShieldCheck,
  Lock,
  ArrowRight,
  Sparkles,
  ChefHat,
  Printer,
  BookOpen,
  FileSpreadsheet,
  Code2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MasterDataState, RoleUser, ResepiMaster } from '../types';

interface AdminSettingsViewProps {
  onSelectRecipe: (recipe: ResepiMaster) => void;
  onOpenGasModal?: () => void;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({
  onSelectRecipe,
  onOpenGasModal,
}) => {
  const {
    recipes,
    masterData,
    users,
    isAdmin,
    approveRecipe,
    addMasterDataItem,
    toggleMasterDataItem,
    addUser,
    updateUserRole,
    setCurrentUserEmail,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<
    'kelulusan' | 'master' | 'peranan' | 'doc'
  >('kelulusan');

  const [activeMasterTable, setActiveMasterTable] = useState<
    keyof MasterDataState
  >('Kategori_Masakan');
  const [newMasterName, setNewMasterName] = useState('');

  // Add User Form State
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<RoleUser>('Penyumbang');
  const [newUserPassword, setNewUserPassword] = useState('kemas123');

  const draftRecipes = recipes.filter((r) => r.Status === 'Draf');

  // Restricted Access Guard
  if (!isAdmin) {
    const adminAccount = users.find((u) => u.Role === 'Admin');
    return (
      <div className="bg-[#121212] p-8 rounded-2xl border border-zinc-800 shadow-xl max-w-xl mx-auto text-center space-y-4 my-6 pb-20">
        <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto text-amber-400">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-extrabold text-zinc-100">
          Tetapan Pentadbir Dapur KEMAS
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Menu Tetapan (Master Data, Kelulusan Draf, & Role Pengguna) hanya boleh diakses oleh peranan <strong className="text-zinc-200">Admin</strong>.
        </p>

        {adminAccount && (
          <div className="pt-2">
            <button
              onClick={() => setCurrentUserEmail(adminAccount.Emel)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 mx-auto shadow-lg shadow-indigo-900/20 transition-all active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>Log Masuk sebagai Admin ({adminAccount.Emel})</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  const handleAddMasterItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMasterName.trim()) return;
    addMasterDataItem(activeMasterTable, newMasterName.trim());
    setNewMasterName('');
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail.trim() || !newUserName.trim()) return;
    addUser({
      Emel: newUserEmail.trim(),
      Nama: newUserName.trim(),
      Role: newUserRole,
      Aktif: true,
      Password: newUserPassword.trim() || 'kemas123',
    });
    setNewUserEmail('');
    setNewUserName('');
    setNewUserPassword('kemas123');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Title Header */}
      <div className="bg-[#121212] text-zinc-100 p-5 rounded-2xl shadow-xl border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Settings className="w-4 h-4" />
            <span>Dashboard Admin & Pengurusan Platform</span>
          </div>
          <h2 className="text-xl font-extrabold text-zinc-100 mt-1">
            Tetapan Pentadbir Dapur KEMAS
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {onOpenGasModal && (
            <button
              onClick={onOpenGasModal}
              className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-2 transition-all shadow-md"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Pangkalan Data GAS & XLSX</span>
            </button>
          )}

          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            Akses Admin Active
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveSubTab('kelulusan')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'kelulusan'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20'
              : 'bg-[#121212] text-zinc-400 border border-zinc-800 hover:bg-zinc-800/50 hover:text-zinc-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span>Kelulusan Draf</span>
          {draftRecipes.length > 0 && (
            <span className="bg-amber-500 text-zinc-950 font-black text-[10px] px-1.5 py-0.2 rounded-full">
              {draftRecipes.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('master')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'master'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20'
              : 'bg-[#121212] text-zinc-400 border border-zinc-800 hover:bg-zinc-800/50 hover:text-zinc-200'
          }`}
        >
          <ListPlus className="w-4 h-4 text-amber-400" />
          <span>Master Data Taksonomi</span>
        </button>

        <button
          onClick={() => setActiveSubTab('peranan')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'peranan'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20'
              : 'bg-[#121212] text-zinc-400 border border-zinc-800 hover:bg-zinc-800/50 hover:text-zinc-200'
          }`}
        >
          <Users className="w-4 h-4 text-amber-400" />
          <span>Akaun & Role Staf</span>
        </button>

        <button
          onClick={() => setActiveSubTab('doc')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'doc'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20'
              : 'bg-[#121212] text-zinc-400 border border-zinc-800 hover:bg-zinc-800/50 hover:text-zinc-200'
          }`}
        >
          <FileText className="w-4 h-4 text-amber-400" />
          <span>Spesifikasi & Nota</span>
        </button>
      </div>

      {/* Sub-Tab 1: Kelulusan Draf Resepi */}
      {activeSubTab === 'kelulusan' && (
        <div className="space-y-4">
          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-xs text-amber-300 flex items-center justify-between">
            <div>
              <strong className="block text-sm font-bold text-amber-400">
                Aliran Kerja Kelulusan Penerbitan Resepi
              </strong>
              <span>
                Menukar status kepada "Diterbitkan" membolehkan resepi dipaparkan kepada umum dan pengguna boleh menjana fail PDF secara terus pada bila-bila masa.
              </span>
            </div>
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold px-2.5 py-1 rounded-lg">
              {draftRecipes.length} Menunggu
            </span>
          </div>

          {draftRecipes.length === 0 ? (
            <div className="bg-[#121212] p-8 rounded-2xl border border-zinc-800 text-center text-zinc-400 text-xs space-y-2">
              <CheckCircle2 className="w-8 h-8 text-indigo-400 mx-auto" />
              <p className="font-bold text-zinc-100 text-sm">
                Tiada Resepi Draf Menunggu Semakan
              </p>
              <p>Semua resepi warisan telah disemak dan diterbitkan secara rasmi.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {draftRecipes.map((recipe) => (
                <div
                  key={recipe.ID_Resepi}
                  className="bg-[#121212] p-4 rounded-2xl border border-zinc-800 shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="bg-amber-500/10 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/20">
                        Status: Draf
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {recipe.ID_Resepi}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-zinc-100 text-sm">
                      {recipe.Nama_Resepi}
                    </h4>

                    <p className="text-xs text-zinc-400 line-clamp-2">
                      {recipe.Deskripsi}
                    </p>

                    <div className="text-[11px] text-zinc-400">
                      Dicipta oleh: <strong className="text-zinc-200">{recipe.Dicipta_Oleh}</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-800 flex items-center gap-2">
                    <button
                      onClick={() => onSelectRecipe(recipe)}
                      className="w-1/2 bg-[#1a1a1a] hover:bg-zinc-800 text-zinc-200 border border-zinc-800 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> Semak Detail
                    </button>

                    <button
                      onClick={() => {
                        approveRecipe(recipe.ID_Resepi);
                        alert(`Resepi "${recipe.Nama_Resepi}" berjaya diluluskan dan diterbitkan!`);
                      }}
                      className="w-1/2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Lulus & Terbitkan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 2: Master Data Taksonomi */}
      {activeSubTab === 'master' && (
        <div className="bg-[#121212] p-5 rounded-2xl border border-zinc-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-zinc-100">
              Pengurusan 4 Jadual Master Data Taksonomi
            </h3>
            <p className="text-xs text-zinc-400">
              Urus item rujukan Ref. Nyah-aktifkan (Aktif=FALSE) tanpa memadam rekod untuk mengelakkan ralat broken reference.
            </p>
          </div>

          {/* Table Switcher Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-[#1a1a1a] p-1.5 rounded-xl text-xs border border-zinc-800">
            {(
              [
                { key: 'Kategori_Masakan', label: 'Kategori Masakan' },
                { key: 'Etnik_Kaum', label: 'Etnik / Kaum' },
                { key: 'Negeri_Asal', label: 'Negeri Asal' },
                { key: 'Jenis_Hidangan', label: 'Jenis Hidangan' },
              ] as const
            ).map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveMasterTable(t.key)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeMasterTable === t.key
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Add Item Form */}
          <form onSubmit={handleAddMasterItem} className="flex gap-2">
            <input
              type="text"
              placeholder={`Tambah nilai baharu untuk ${activeMasterTable}...`}
              value={newMasterName}
              onChange={(e) => setNewMasterName(e.target.value)}
              className="flex-grow text-xs p-2.5 bg-[#1a1a1a] text-zinc-100 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1 shrink-0 shadow-md shadow-indigo-900/20"
            >
              <Plus className="w-4 h-4" /> Tambah
            </button>
          </form>

          {/* Items List Table */}
          <div className="divide-y divide-zinc-800 border border-zinc-800 rounded-xl overflow-hidden text-xs bg-[#1a1a1a]">
            {masterData[activeMasterTable].map((item) => (
              <div
                key={item.Nama}
                className="p-3 flex items-center justify-between hover:bg-[#121212]"
              >
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      item.Aktif ? 'bg-indigo-400' : 'bg-zinc-600'
                    }`}
                  />
                  <span
                    className={`font-semibold ${
                      item.Aktif ? 'text-zinc-200' : 'text-zinc-500 line-through'
                    }`}
                  >
                    {item.Nama}
                  </span>
                </div>

                <button
                  onClick={() => toggleMasterDataItem(activeMasterTable, item.Nama)}
                  className={`px-3 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 ${
                    item.Aktif
                      ? 'bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/20'
                      : 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/20'
                  }`}
                >
                  <Power className="w-3 h-3" />
                  {item.Aktif ? 'Nyah-aktifkan' : 'Aktifkan'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Accounts & Role Staf */}
      {activeSubTab === 'peranan' && (
        <div className="bg-[#121212] p-5 rounded-2xl border border-zinc-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-zinc-100">
              Pengurusan Akaun Staf & Kebenaran Akses (Role Matrix)
            </h3>
            <p className="text-xs text-zinc-400">
              Daftar akaun emel staf KEMAS dan tetapkan peranan (Admin, Penyumbang, Pengguna).
            </p>
          </div>

          {/* Add User Form */}
          <form
            onSubmit={handleAddUser}
            className="p-3.5 bg-[#1a1a1a] rounded-xl border border-zinc-800 space-y-3"
          >
            <h4 className="text-xs font-bold text-zinc-200">Daftar Staf Baharu</h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
              <input
                type="text"
                placeholder="Nama Penuh Staf"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="p-2 bg-[#121212] text-zinc-100 border border-zinc-800 rounded-lg focus:outline-none"
              />
              <input
                type="email"
                placeholder="Emel (@kemas.gov.my)"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="p-2 bg-[#121212] text-zinc-100 border border-zinc-800 rounded-lg focus:outline-none"
              />
              <input
                type="text"
                placeholder="Kata Laluan (Default: kemas123)"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                className="p-2 bg-[#121212] text-zinc-100 border border-zinc-800 rounded-lg focus:outline-none font-mono"
              />
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value as RoleUser)}
                className="p-2 bg-[#121212] text-zinc-100 border border-zinc-800 rounded-lg focus:outline-none"
              >
                <option value="Admin">Admin</option>
                <option value="Penyumbang">Penyumbang</option>
                <option value="Pengguna">Pengguna</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 shadow-md shadow-indigo-900/20"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Akaun Staf
            </button>
          </form>

          {/* Users List */}
          <div className="divide-y divide-zinc-800 border border-zinc-800 rounded-xl overflow-hidden text-xs bg-[#1a1a1a]">
            {users.map((u) => (
              <div
                key={u.Emel}
                className="p-3 flex flex-wrap items-center justify-between gap-2 hover:bg-[#121212]"
              >
                <div>
                  <div className="font-bold text-zinc-200">{u.Nama}</div>
                  <div className="text-zinc-500 font-mono text-[11px]">
                    {u.Emel}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    value={u.Role}
                    onChange={(e) =>
                      updateUserRole(u.Emel, e.target.value as RoleUser)
                    }
                    className="p-1.5 bg-[#121212] text-zinc-200 border border-zinc-800 rounded-lg font-bold text-xs"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Penyumbang">Penyumbang</option>
                    <option value="Pengguna">Pengguna</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Documentation Specs */}
      {activeSubTab === 'doc' && (
        <div className="bg-[#121212] p-5 rounded-2xl border border-zinc-800 shadow-sm space-y-4 text-xs leading-relaxed text-zinc-300">
          <div className="border-b border-zinc-800 pb-3">
            <h3 className="text-base font-extrabold text-zinc-100">
              Dokumentasi Spesifikasi Teknikal Dapur KEMAS
            </h3>
            <p className="text-zinc-400 text-[11px]">
              Unit Pembangunan Komuniti & Pendidikan Kemahiran (PKK), KEMAS Perlis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 bg-[#1a1a1a] rounded-xl border border-zinc-800 space-y-1">
              <strong className="text-zinc-100 block font-bold text-sm">
                📌 Polisi Penjanaan PDF & Notifikasi
              </strong>
              <p className="text-[11px] text-zinc-400">
                • <strong>Penjanaan PDF Terus (On-Demand)</strong>: Tiada lagi penjanaan automatik pada kelulusan. PDF cookbook lengkap dijana terus pada peranti apabila pengguna menekan butang 'Jana PDF' pada resepi terpilih.
              </p>
              <p className="text-[11px] text-zinc-400">
                • <strong>Bot Notifikasi (Bot 2)</strong>: Dicetuskan apabila Penyumbang menambah resepi draf baharu untuk semakan Admin.
              </p>
            </div>

            <div className="p-3.5 bg-[#1a1a1a] rounded-xl border border-zinc-800 space-y-1">
              <strong className="text-zinc-100 block font-bold text-sm">
                📊 Mitigasi Had Sel Google Sheets (NFR-01)
              </strong>
              <p className="text-[11px] text-zinc-400">
                Jadual Unbounded (Ulasan_Rating & Resepi_Kegemaran) dipisahkan untuk menjamin kapasiti data kekal jauh di bawah had 10 juta sel.
              </p>
            </div>
          </div>

          <div className="bg-indigo-600/10 p-4 rounded-xl border border-indigo-500/20 space-y-2">
            <strong className="text-indigo-300 font-bold text-sm block">
              💡 Ringkasan Matrix Kebenaran Akses (Section 5)
            </strong>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-indigo-500/30 text-indigo-300 font-bold">
                    <th className="py-1">Fungsi</th>
                    <th className="py-1">Admin</th>
                    <th className="py-1">Penyumbang</th>
                    <th className="py-1">Pengguna</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  <tr>
                    <td className="py-1">Lihat Resepi Diterbitkan</td>
                    <td>✅</td>
                    <td>✅</td>
                    <td>✅</td>
                  </tr>
                  <tr>
                    <td className="py-1">Tambah Resepi Draf Baharu</td>
                    <td>✅</td>
                    <td>✅</td>
                    <td>❌</td>
                  </tr>
                  <tr>
                    <td className="py-1">Kelulusan Penerbitan (Status=Diterbitkan)</td>
                    <td>✅</td>
                    <td>❌</td>
                    <td>❌</td>
                  </tr>
                  <tr>
                    <td className="py-1">Urus Master Data & Role Pengguna</td>
                    <td>✅</td>
                    <td>❌</td>
                    <td>❌</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
