import React, { useState } from 'react';
import {
  User,
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChefHat,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  Sparkles,
  ArrowRight,
  KeyRound,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RoleUser } from '../types';

interface LoginPageProps {
  onClose?: () => void;
  onSuccessRedirect?: () => void;
  isGatekeeper?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onClose,
  onSuccessRedirect,
  isGatekeeper = false,
}) => {
  const {
    users,
    login,
    registerUser,
    isLoggedIn,
    currentUser,
    logout,
    isAdmin,
    isPenyumbang,
  } = useApp();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form States
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerRole, setRegisterRole] = useState<RoleUser>('Pengguna');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showForgotTip, setShowForgotTip] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!loginEmail.trim()) {
      setErrorMessage('Sila masukkan alamat emel anda.');
      return;
    }
    if (!loginPassword) {
      setErrorMessage('Sila masukkan kata laluan.');
      return;
    }

    const res = login(loginEmail.trim(), loginPassword);
    if (res.success) {
      setSuccessMessage('Log masuk berjaya! Membuka Dapur KEMAS...');
      setTimeout(() => {
        if (onSuccessRedirect) onSuccessRedirect();
        else if (onClose) onClose();
      }, 700);
    } else {
      setErrorMessage(res.error || 'Emel atau kata laluan tidak sah.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!registerName.trim()) {
      setErrorMessage('Sila masukkan nama penuh anda.');
      return;
    }
    if (!registerEmail.trim()) {
      setErrorMessage('Sila masukkan alamat emel.');
      return;
    }
    if (!registerPassword || registerPassword.length < 4) {
      setErrorMessage('Kata laluan sekurang-kurangnya 4 aksara.');
      return;
    }
    if (registerPassword !== confirmPassword) {
      setErrorMessage('Kata laluan dan pengesahan kata laluan tidak sepadan.');
      return;
    }

    const res = registerUser(
      registerName.trim(),
      registerEmail.trim(),
      registerPassword,
      registerRole
    );

    if (res.success) {
      setSuccessMessage('Akaun berjaya didaftarkan! Selamat datang ke Dapur KEMAS.');
      setTimeout(() => {
        if (onSuccessRedirect) onSuccessRedirect();
        else if (onClose) onClose();
      }, 700);
    } else {
      setErrorMessage(res.error || 'Pendaftaran gagal. Sila cuba lagi.');
    }
  };

  // Quick 1-click test login for examiners / staff testing
  const handleQuickRole = (role: RoleUser) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    const target = users.find((u) => u.Role === role) || users[0];
    if (target) {
      setLoginEmail(target.Emel);
      const pwd = target.Password || 'kemas123';
      setLoginPassword(pwd);
      const res = login(target.Emel, pwd);
      if (res.success) {
        setSuccessMessage(`Berjaya log masuk sebagai ${target.Nama} (${role})`);
        setTimeout(() => {
          if (onSuccessRedirect) onSuccessRedirect();
          else if (onClose) onClose();
        }, 600);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-[#121212] border border-zinc-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[96vh]">
        {/* Top Branding Bar */}
        <div className="bg-[#0c0c0c] px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2.5 rounded-2xl text-white font-bold shadow-md shadow-indigo-900/30">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-zinc-100 flex items-center gap-2">
                Dapur KEMAS
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold px-2 py-0.5 rounded-full">
                  Gerbang Akses Rasmi
                </span>
              </h1>
              <p className="text-[11px] text-zinc-400">
                Unit Pembangunan Komuniti & Pendidikan Kemahiran (PKK) • KEMAS Negeri Perlis
              </p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Tutup Paparan"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Dual Mode Switcher Tabs */}
        <div className="bg-[#161616] p-2 border-b border-zinc-800 flex items-center justify-center">
          <div className="grid grid-cols-2 max-w-sm w-full bg-[#0e0e0e] p-1 rounded-2xl border border-zinc-800">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Log Masuk (Login)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Daftar Akaun (Register)</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto">
          {/* Active Logged In Badge (if user is currently logged in) */}
          {isLoggedIn && (
            <div className="mb-6 p-4 rounded-2xl bg-[#181818] border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-zinc-400">Sesi Aktif Semasa:</div>
                  <div className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                    <span>{currentUser.Nama}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        isAdmin
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : isPenyumbang
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      {currentUser.Role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={logout}
                  className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-rose-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Log Keluar
                </button>
                {onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Teruskan ke Dapur KEMAS
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-rose-950/70 border border-rose-500/40 rounded-2xl text-rose-200 text-xs flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 bg-emerald-950/70 border border-emerald-500/40 rounded-2xl text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ========================================================= */}
          {/* 1. LOGIN VIEW (Mirrors IMG_1201 Left Side)                */}
          {/* ========================================================= */}
          {authMode === 'login' && (
            <div className="max-w-md mx-auto space-y-6 animate-fade-in">
              {/* Blue Circular Avatar */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-900/30 ring-4 ring-blue-500/20">
                  <User className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-black text-white tracking-tight">
                  Welcome Back!
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Login to your account
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email Field */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="Email"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-[#181818] border border-zinc-700/80 rounded-xl text-zinc-100 placeholder-zinc-500 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Password"
                      required
                      className="w-full pl-10 pr-10 py-3 bg-[#181818] border border-zinc-700/80 rounded-xl text-zinc-100 placeholder-zinc-500 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-200 cursor-pointer"
                    >
                      {showLoginPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded bg-zinc-800 border-zinc-700 text-blue-600 focus:ring-0 w-3.5 h-3.5"
                    />
                    <span>Remember Me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowForgotTip(!showForgotTip)}
                    className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>

                {showForgotTip && (
                  <div className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-xl text-blue-200 text-xs flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      Kata laluan lalai untuk semua akaun staf KEMAS adalah:{' '}
                      <strong className="text-amber-300 font-mono">kemas123</strong>
                    </span>
                  </div>
                )}

                {/* LOGIN Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm tracking-wide uppercase shadow-lg shadow-blue-900/40 transition-all active:scale-[0.99] cursor-pointer"
                >
                  LOGIN
                </button>
              </form>

              {/* Switch to Register */}
              <div className="text-center text-xs text-zinc-400 pt-1">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-blue-400 hover:text-blue-300 font-bold underline cursor-pointer"
                >
                  Register
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. REGISTER VIEW (Mirrors IMG_1201 Right Side)             */}
          {/* ========================================================= */}
          {authMode === 'register' && (
            <div className="max-w-md mx-auto space-y-6 animate-fade-in">
              {/* Green Circular Avatar with Plus */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-900/30 ring-4 ring-emerald-500/20">
                  <UserPlus className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-black text-white tracking-tight">
                  Create Account
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Register a new account
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Full Name Field */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      placeholder="Full Name"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-[#181818] border border-zinc-700/80 rounded-xl text-zinc-100 placeholder-zinc-500 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      placeholder="Email (@kemas.gov.my atau emel awam)"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-[#181818] border border-zinc-700/80 rounded-xl text-zinc-100 placeholder-zinc-500 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                    Jenis Akaun / Peranan:
                  </label>
                  <select
                    value={registerRole}
                    onChange={(e) => setRegisterRole(e.target.value as RoleUser)}
                    className="w-full px-3.5 py-2.5 bg-[#181818] border border-zinc-700/80 rounded-xl text-zinc-100 text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Pengguna">Pengguna Awam (Carian & PDF Cookbook)</option>
                    <option value="Penyumbang">Penyumbang (Pemaju Masyarakat KEMAS)</option>
                    <option value="Admin">Pentadbir (Admin Unit PKK KEMAS)</option>
                  </select>
                </div>

                {/* Password Field */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder="Password"
                      required
                      className="w-full pl-10 pr-10 py-3 bg-[#181818] border border-zinc-700/80 rounded-xl text-zinc-100 placeholder-zinc-500 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-200 cursor-pointer"
                    >
                      {showRegPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm Password"
                      required
                      className="w-full pl-10 pr-10 py-3 bg-[#181818] border border-zinc-700/80 rounded-xl text-zinc-100 placeholder-zinc-500 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-200 cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* REGISTER Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm tracking-wide uppercase shadow-lg shadow-emerald-900/40 transition-all active:scale-[0.99] cursor-pointer"
                >
                  REGISTER
                </button>
              </form>

              {/* Switch to Login */}
              <div className="text-center text-xs text-zinc-400 pt-1">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer"
                >
                  Login
                </button>
              </div>
            </div>
          )}

          {/* Quick Filter & Role Demo Selector */}
          <div className="mt-8 pt-6 border-t border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Ujian Pantas Hak Akses (1-Click Test Role):
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                Kata laluan: kemas123
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickRole('Admin')}
                className="p-3 rounded-xl bg-[#161616] hover:bg-amber-950/30 border border-zinc-800 hover:border-amber-500/40 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    Admin
                  </span>
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-xs font-bold text-zinc-200 group-hover:text-amber-300 mt-1 truncate">
                  admin.pkk@kemas.gov.my
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">
                  Akses Penuh: GAS, XLSX, Kelulusan
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole('Penyumbang')}
                className="p-3 rounded-xl bg-[#161616] hover:bg-indigo-950/30 border border-zinc-800 hover:border-indigo-500/40 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    Penyumbang
                  </span>
                  <ChefHat className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div className="text-xs font-bold text-zinc-200 group-hover:text-indigo-300 mt-1 truncate">
                  pm.masakan@kemas.gov.my
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">
                  Daftar Resepi, Draf Kulinari
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole('Pengguna')}
                className="p-3 rounded-xl bg-[#161616] hover:bg-blue-950/30 border border-zinc-800 hover:border-blue-500/40 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                    Pengguna
                  </span>
                  <User className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="text-xs font-bold text-zinc-200 group-hover:text-blue-300 mt-1 truncate">
                  staf.kemas@kemas.gov.my
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">
                  Lihat Resepi & Jana PDF Sahaja
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer: Guest mode / Return */}
        <div className="bg-[#0c0c0c] px-6 py-3.5 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <span className="text-[11px] text-zinc-400">
            Unit PKK KEMAS Negeri Perlis • Hak Cipta Terpelihara
          </span>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-zinc-300 hover:text-white font-bold flex items-center gap-1.5 cursor-pointer bg-zinc-800/80 hover:bg-zinc-700 px-3.5 py-1.5 rounded-xl transition-colors"
            >
              <span>Masuk Sebagai Tetamu (Awam)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
