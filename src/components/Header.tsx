import React, { useState } from 'react';
import {
  ChefHat,
  UserCheck,
  Bell,
  Check,
  RefreshCw,
  Info,
  ShieldAlert,
  ChevronDown,
  FileSpreadsheet,
  Menu,
  X,
  Home,
  BookOpen,
  PlusCircle,
  Settings,
  Sparkles,
  Zap,
  Workflow,
  Compass,
  Palette,
  KeyRound,
  LogIn,
  Table2,
  Smartphone,
  Monitor,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onOpenInfoModal: () => void;
  onOpenGasModal?: () => void;
  onOpenAboutModal: () => void;
  onOpenAppDesignModal?: () => void;
  onOpenLoginModal?: () => void;
  onOpenPhoneMockupModal?: () => void;
  isPhoneSimMode?: boolean;
  onTogglePhoneSimMode?: () => void;
  onNavigateToTab?: (tab: 'utama' | 'senarai' | 'tambah' | 'tetapan') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenInfoModal,
  onOpenGasModal,
  onOpenAboutModal,
  onOpenAppDesignModal,
  onOpenLoginModal,
  onOpenPhoneMockupModal,
  isPhoneSimMode = false,
  onTogglePhoneSimMode,
  onNavigateToTab,
}) => {
  const {
    currentUser,
    setCurrentUserEmail,
    users,
    notifications,
    markNotificationRead,
    clearNotifications,
    resetToDefaultData,
    isAdmin,
    canAddRecipe,
  } = useApp();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showHamburgerDrawer, setShowHamburgerDrawer] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read);

  const handleNavClick = (tab: 'utama' | 'senarai' | 'tambah' | 'tetapan') => {
    setShowHamburgerDrawer(false);
    if (onNavigateToTab) {
      onNavigateToTab(tab);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0d0d0d] text-zinc-100 shadow-xl border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Hamburger Menu & Brand Logo */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            {/* Hamburger Menu Button */}
            <button
              onClick={() => setShowHamburgerDrawer(true)}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-all flex items-center justify-center cursor-pointer active:scale-95"
              title="Buka Menu Navigasi & Tentang Dapur KEMAS"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5 text-indigo-400" />
            </button>

            {/* Brand Logo & Name */}
            <div className="flex items-center space-x-2.5">
              <div className="bg-indigo-600 p-2 rounded-xl text-white font-bold shadow-lg shadow-indigo-900/30 flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-xl font-extrabold tracking-tight text-zinc-100 leading-tight flex items-center gap-2">
                  <span>Dapur KEMAS</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    V1.00
                  </span>
                </h1>
                <p className="text-[11px] text-zinc-400 hidden sm:block">
                  Unit PKK KEMAS Negeri Perlis • Warisan Digital V1.00
                </p>
              </div>
            </div>
          </div>

          {/* Right Section: Notifications & Role Switcher */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Phone Mockup / Simulator Trigger */}
            {onOpenPhoneMockupModal && (
              <button
                onClick={onOpenPhoneMockupModal}
                className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isPhoneSimMode
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-900/40'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border-zinc-800'
                }`}
                title="Lihat Mockup Peranti Telefon & Mod Simulasi Mudah Alih"
              >
                <Smartphone className="w-4 h-4 text-indigo-400" />
                <span className="hidden sm:inline">Mockup Telefon</span>
                {isPhoneSimMode && (
                  <span className="hidden lg:inline text-[9px] bg-indigo-500/30 text-indigo-200 px-1.5 py-0.2 rounded-full border border-indigo-400/30">
                    Aktif
                  </span>
                )}
              </button>
            )}

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifDropdown(!showNotifDropdown);
                  setShowRoleDropdown(false);
                }}
                className="p-2 rounded-lg hover:bg-zinc-800 transition-colors relative text-zinc-300 cursor-pointer"
                title="Notifikasi Bot Automasi"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 bg-amber-500 text-zinc-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#121212] text-zinc-100 rounded-xl shadow-2xl border border-zinc-800 z-50 overflow-hidden">
                  <div className="bg-[#1a1a1a] text-zinc-200 border-b border-zinc-800 p-3 flex justify-between items-center text-xs font-semibold">
                    <span className="flex items-center gap-1 text-indigo-400">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Notifikasi Sistem
                    </span>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearNotifications}
                        className="text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors"
                      >
                        Padam Semua
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-zinc-800/60">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-zinc-500 text-xs">
                        Tiada notifikasi baharu.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-3 text-xs transition-colors cursor-pointer ${
                            n.read
                              ? 'bg-[#121212] opacity-60'
                              : 'bg-indigo-950/20 hover:bg-indigo-950/30'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <span className="font-semibold text-zinc-200">
                              {n.title}
                            </span>
                            <span className="text-[10px] text-zinc-500 shrink-0">
                              {new Date(n.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-zinc-400 mt-1 text-[11px] leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowRoleDropdown(!showRoleDropdown);
                  setShowNotifDropdown(false);
                }}
                className="flex items-center space-x-2 bg-zinc-900 hover:bg-zinc-800 px-2.5 sm:px-3 py-1.5 rounded-lg border border-zinc-800 text-xs text-zinc-200 transition-all cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-indigo-400" />
                <div className="text-left hidden md:block">
                  <div className="font-semibold text-zinc-100 truncate max-w-[120px]">
                    {currentUser.Nama}
                  </div>
                  <div className="text-[10px] text-indigo-400 font-medium">
                    {currentUser.Role}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-[#121212] text-zinc-100 rounded-xl shadow-2xl border border-zinc-800 z-50 overflow-hidden">
                  <div className="p-3 bg-[#1a1a1a] border-b border-zinc-800">
                    <div className="text-xs font-bold text-zinc-200">
                      Tukar Peranan Pengguna (Demo)
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Pilih peranan untuk menguji matriks kebenaran akses.
                    </div>
                  </div>

                  <div className="p-1 max-h-60 overflow-y-auto">
                    {users.map((u) => {
                      const isSelected = u.Emel === currentUser.Emel;
                      return (
                        <button
                          key={u.Emel}
                          onClick={() => {
                            setCurrentUserEmail(u.Emel);
                            setShowRoleDropdown(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between text-xs transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30'
                              : 'hover:bg-zinc-800/60 text-zinc-300'
                          }`}
                        >
                          <div className="truncate">
                            <div className="truncate text-zinc-100">{u.Nama}</div>
                            <div className="text-[10px] text-zinc-500 font-mono truncate">
                              {u.Emel}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                                u.Role === 'Admin'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  : u.Role === 'Penyumbang'
                                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                              }`}
                            >
                              {u.Role}
                            </span>
                            {isSelected && (
                              <Check className="w-4 h-4 text-emerald-400" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {onOpenLoginModal && (
                    <div className="p-2 border-t border-zinc-800 bg-[#141414]">
                      <button
                        onClick={() => {
                          setShowRoleDropdown(false);
                          onOpenLoginModal();
                        }}
                        className="w-full py-1.5 px-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-bold text-[11px] flex items-center justify-center gap-1.5 border border-indigo-500/30 transition-colors cursor-pointer"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                        <span>Buka Halaman Log Masuk Lengkap</span>
                      </button>
                    </div>
                  )}

                  <div className="p-2 border-t border-zinc-800 bg-[#1a1a1a] flex items-center justify-between text-[11px]">
                    <button
                      onClick={() => {
                        if (confirm('Sahkan untuk set semula data ke paparan asal?')) {
                          resetToDefaultData();
                          setShowRoleDropdown(false);
                        }
                      }}
                      className="text-rose-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" /> Set Semula Data
                    </button>
                    <button
                      onClick={() => {
                        onOpenInfoModal();
                        setShowRoleDropdown(false);
                      }}
                      className="text-indigo-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <Info className="w-3 h-3" /> Info Specs
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* HAMBURGER SLIDE-OVER DRAWER MENU                         */}
      {/* ========================================================= */}
      {showHamburgerDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            onClick={() => setShowHamburgerDrawer(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fadeIn cursor-pointer"
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <div className="w-screen max-w-sm bg-[#121212] border-r border-zinc-800 shadow-2xl flex flex-col justify-between overflow-y-auto">
              {/* Drawer Top Content */}
              <div>
                {/* Header branding in drawer */}
                <div className="p-4 bg-[#0e0e0e] border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="bg-indigo-600 p-2 rounded-xl text-white font-bold shadow-md shadow-indigo-900/30">
                      <ChefHat className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-extrabold text-zinc-100">
                        Dapur KEMAS
                      </h2>
                      <p className="text-[11px] text-zinc-400">
                        KEMAS Negeri Perlis
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowHamburgerDrawer(false)}
                    className="p-2 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    title="Tutup Menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Primary Spotlight: PAGE ABOUT */}
                <div className="p-3">
                  <button
                    onClick={() => {
                      setShowHamburgerDrawer(false);
                      onOpenAboutModal();
                    }}
                    className="w-full text-left p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-indigo-900/40 to-purple-950/40 border border-indigo-500/40 hover:border-indigo-400 transition-all shadow-lg group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="flex items-center gap-1.5 text-xs font-black text-indigo-300 uppercase tracking-wide">
                        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                        Page About Rasmi
                      </span>
                      <span className="text-[10px] bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 font-bold px-2 py-0.5 rounded-full">
                        Eksklusif
                      </span>
                    </div>
                    <div className="font-extrabold text-sm text-white group-hover:text-indigo-200 transition-colors">
                      Tentang Dapur KEMAS
                    </div>
                    <p className="text-[11px] text-zinc-300 mt-1 leading-relaxed">
                      Misi & Visi KEMAS Perlis, Vibe Coding, Google Workspace (Sheets, AppSheet & Canvas), serta AI-SDLC.
                    </p>
                    <div className="mt-2.5 flex items-center text-[11px] font-bold text-amber-400 gap-1">
                      <span>Buka Halaman Penuh</span>
                      <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                    </div>
                  </button>

                  {/* SPOTLIGHT 2: APP DESIGN & SCHEMAS */}
                  {onOpenAppDesignModal && (
                    <button
                      onClick={() => {
                        setShowHamburgerDrawer(false);
                        onOpenAppDesignModal();
                      }}
                      className="w-full text-left p-3 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-zinc-900 to-teal-950/40 border border-emerald-500/30 hover:border-emerald-400 transition-all shadow-md group cursor-pointer mt-2"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="flex items-center gap-1.5 text-xs font-black text-emerald-300 uppercase tracking-wide">
                          <Palette className="w-3.5 h-3.5 text-emerald-400" />
                          App Design & Skema
                        </span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                          Lengkap
                        </span>
                      </div>
                      <div className="font-bold text-xs text-zinc-100 group-hover:text-emerald-200 transition-colors">
                        Seni Bina Reka Bentuk & Jadual Data
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">
                        Galeri tangkapan skrin UI, skema 8 jadual pangkalan data & design tokens.
                      </p>
                    </button>
                  )}

                  {/* SPOTLIGHT 3: LOG IN & ROLE FILTER */}
                  {onOpenLoginModal && (
                    <button
                      onClick={() => {
                        setShowHamburgerDrawer(false);
                        onOpenLoginModal();
                      }}
                      className="w-full text-left p-3 rounded-2xl bg-[#161616] hover:bg-[#1c1c1c] border border-zinc-800 hover:border-indigo-500/40 transition-all shadow-sm group cursor-pointer mt-2"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-200">
                          <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                          Log Masuk / Filter Staf
                        </span>
                        <span className="text-[10px] bg-zinc-800 text-zinc-400 font-mono px-2 py-0.5 rounded">
                          kemas123
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-1">
                        Tukar akaun atau log masuk menggunakan emel dan kata laluan berdaftar.
                      </p>
                    </button>
                  )}

                  {/* SPOTLIGHT 4: PHONE MOCKUP & SIMULATOR */}
                  {onOpenPhoneMockupModal && (
                    <button
                      onClick={() => {
                        setShowHamburgerDrawer(false);
                        onOpenPhoneMockupModal();
                      }}
                      className="w-full text-left p-3 rounded-2xl bg-gradient-to-r from-purple-950/60 via-zinc-900 to-indigo-950/50 border border-purple-500/30 hover:border-purple-400 transition-all shadow-md group cursor-pointer mt-2"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="flex items-center gap-1.5 text-xs font-black text-purple-300 uppercase tracking-wide">
                          <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                          Mockup Telefon Pintar
                        </span>
                        <span className="text-[10px] bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded-full">
                          HD & Simulasi
                        </span>
                      </div>
                      <div className="font-bold text-xs text-zinc-100 group-hover:text-purple-200 transition-colors">
                        Visual Mockup Peranti Telefon
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">
                        Mockup iPhone 16 Pro, paparan ergonomik mudah alih & mod simulator langsung.
                      </p>
                    </button>
                  )}
                </div>

                {/* Navigation Links */}
                <div className="px-3 py-2 space-y-1">
                  <div className="px-3 py-1 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                    Navigasi Aplikasi
                  </div>

                  <button
                    onClick={() => handleNavClick('utama')}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-800/70 text-zinc-200 text-xs font-semibold transition-colors cursor-pointer text-left"
                  >
                    <Home className="w-4 h-4 text-indigo-400" />
                    <span>Papan Pemuka (Utama)</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('senarai')}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-800/70 text-zinc-200 text-xs font-semibold transition-colors cursor-pointer text-left"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span>Koleksi Resepi Warisan</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('tambah')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                      canAddRecipe
                        ? 'hover:bg-zinc-800/70 text-zinc-200'
                        : 'opacity-50 text-zinc-500 hover:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <PlusCircle className="w-4 h-4 text-amber-400" />
                      <span>Pendaftaran Resepi Baharu</span>
                    </div>
                    {!canAddRecipe && (
                      <span className="text-[10px] text-zinc-500">Khas Admin/Penyumbang</span>
                    )}
                  </button>

                  <button
                    onClick={() => handleNavClick('tetapan')}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-800/70 text-zinc-200 text-xs font-semibold transition-colors cursor-pointer text-left"
                  >
                    <Settings className="w-4 h-4 text-purple-400" />
                    <span>Pengurusan & Kelulusan Admin</span>
                  </button>
                </div>

                {/* Database & Specs Section - STRICT ADMIN GUARD FOR GAS */}
                <div className="px-3 py-2 space-y-1 border-t border-zinc-800/60 mt-2">
                  <div className="px-3 py-1 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                    Pusat Data & Integrasi
                  </div>

                  {isAdmin && onOpenGasModal && (
                    <button
                      onClick={() => {
                        setShowHamburgerDrawer(false);
                        onOpenGasModal();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-800/70 text-zinc-200 text-xs font-semibold transition-colors cursor-pointer text-left"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                      <span>Pusat Fail GAS & XLSX (Admin Sahaja)</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setShowHamburgerDrawer(false);
                      onOpenInfoModal();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-800/70 text-zinc-200 text-xs font-semibold transition-colors cursor-pointer text-left"
                  >
                    <Info className="w-4 h-4 text-indigo-400" />
                    <span>Matriks Spesifikasi Sistem & Had NFR-01</span>
                  </button>
                </div>
              </div>

              {/* Drawer Bottom User Status */}
              <div className="p-3 bg-[#0e0e0e] border-t border-zinc-800 space-y-2">
                <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
                  <div className="truncate">
                    <div className="font-bold text-zinc-100 truncate">
                      {currentUser.Nama}
                    </div>
                    <div className="text-[10px] text-zinc-400 truncate">
                      {currentUser.Emel}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                      isAdmin
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}
                  >
                    {currentUser.Role}
                  </span>
                </div>
                <p className="text-[10px] text-center text-zinc-500">
                  Unit PKK KEMAS Negeri Perlis • Warisan Digital
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
