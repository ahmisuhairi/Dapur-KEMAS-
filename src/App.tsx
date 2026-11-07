import React, { useState } from 'react';
import { Smartphone, Monitor, Sparkles } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { RecipeListView } from './components/RecipeListView';
import { AddEditRecipeForm } from './components/AddEditRecipeForm';
import { AdminSettingsView } from './components/AdminSettingsView';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { InfoSpecsModal } from './components/InfoSpecsModal';
import { GoogleAppsScriptModal } from './components/GoogleAppsScriptModal';
import { AboutModal } from './components/AboutModal';
import { AppDesignModal } from './components/AppDesignModal';
import { LoginPage } from './components/LoginPage';
import { PhoneMockupModal } from './components/PhoneMockupModal';
import { ResepiMaster } from './types';

function MainAppContent() {
  const { recipes, isAdmin, isLoggedIn } = useApp();

  const [activeTab, setActiveTab] = useState<TabType>('utama');
  const [selectedRecipe, setSelectedRecipe] = useState<ResepiMaster | null>(
    null
  );
  const [editingRecipe, setEditingRecipe] = useState<ResepiMaster | undefined>(
    undefined
  );
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(
    undefined
  );
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showGasModal, setShowGasModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showAppDesignModal, setShowAppDesignModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPhoneMockupModal, setShowPhoneMockupModal] = useState(false);
  const [isPhoneSimMode, setIsPhoneSimMode] = useState(false);
  const [guestAccessGranted, setGuestAccessGranted] = useState(false);

  const pendingDraftCount = recipes.filter((r) => r.Status === 'Draf').length;

  const handleNavigateToTab = (
    tab: 'utama' | 'senarai' | 'tambah' | 'tetapan',
    filterCategory?: string
  ) => {
    if (filterCategory) {
      setCategoryFilter(filterCategory);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRecipe = (recipe: ResepiMaster) => {
    setSelectedRecipe(recipe);
  };

  const handleEditRecipe = (recipe: ResepiMaster) => {
    setEditingRecipe(recipe);
    setActiveTab('tambah');
  };

  const handleFormSuccess = () => {
    setEditingRecipe(undefined);
    setActiveTab('senarai');
  };

  // Primary Gateway: User must log in or register to enter Dapur KEMAS
  if (!isLoggedIn && !guestAccessGranted) {
    return (
      <LoginPage
        onSuccessRedirect={() => setGuestAccessGranted(true)}
        onClose={() => setGuestAccessGranted(true)}
        isGatekeeper={true}
      />
    );
  }

  // Common modals reusable across both standard and phone mockup simulation modes
  const renderModals = () => (
    <>
      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onEdit={handleEditRecipe}
        />
      )}

      {/* Info & Specs Modal */}
      {showInfoModal && (
        <InfoSpecsModal onClose={() => setShowInfoModal(false)} />
      )}

      {/* Google Apps Script & XLSX Database Center Modal (Admin Only) */}
      {showGasModal && isAdmin && (
        <GoogleAppsScriptModal onClose={() => setShowGasModal(false)} />
      )}

      {/* About Page Modal */}
      {showAboutModal && (
        <AboutModal
          onClose={() => setShowAboutModal(false)}
          onOpenGasModal={isAdmin ? () => setShowGasModal(true) : undefined}
        />
      )}

      {/* App Design & Database Tables Modal */}
      {showAppDesignModal && (
        <AppDesignModal onClose={() => setShowAppDesignModal(false)} />
      )}

      {/* Login & Role Filter Modal */}
      {showLoginModal && (
        <LoginPage onClose={() => setShowLoginModal(false)} />
      )}

      {/* Phone Mockup Showcase & Specs Modal */}
      {showPhoneMockupModal && (
        <PhoneMockupModal
          onClose={() => setShowPhoneMockupModal(false)}
          onActivatePhoneSimulator={() => setIsPhoneSimMode(true)}
          isSimulatorActive={isPhoneSimMode}
        />
      )}
    </>
  );

  // App Body (Header, Main Tab Content, BottomNav)
  const renderAppContent = () => (
    <>
      {/* Header Bar with Hamburger Menu & About Modal */}
      <Header
        onOpenInfoModal={() => setShowInfoModal(true)}
        onOpenGasModal={isAdmin ? () => setShowGasModal(true) : undefined}
        onOpenAboutModal={() => setShowAboutModal(true)}
        onOpenAppDesignModal={() => setShowAppDesignModal(true)}
        onOpenLoginModal={() => setShowLoginModal(true)}
        onOpenPhoneMockupModal={() => setShowPhoneMockupModal(true)}
        isPhoneSimMode={isPhoneSimMode}
        onTogglePhoneSimMode={() => setIsPhoneSimMode(!isPhoneSimMode)}
        onNavigateToTab={handleNavigateToTab}
      />

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-20">
        {activeTab === 'utama' && (
          <DashboardView
            onSelectRecipe={handleSelectRecipe}
            onNavigateToTab={handleNavigateToTab}
          />
        )}

        {activeTab === 'senarai' && (
          <RecipeListView
            onSelectRecipe={handleSelectRecipe}
            initialCategoryFilter={categoryFilter}
          />
        )}

        {activeTab === 'tambah' && (
          <AddEditRecipeForm
            initialRecipe={editingRecipe}
            onSuccess={handleFormSuccess}
          />
        )}

        {activeTab === 'tetapan' && (
          <AdminSettingsView
            onSelectRecipe={handleSelectRecipe}
            onOpenGasModal={isAdmin ? () => setShowGasModal(true) : undefined}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab !== 'senarai') {
            setCategoryFilter(undefined);
          }
          if (tab === 'tambah' && editingRecipe) {
            setEditingRecipe(undefined);
          }
          setActiveTab(tab);
        }}
        pendingDraftCount={pendingDraftCount}
        isPhoneSimMode={isPhoneSimMode}
      />
    </>
  );

  // -------------------------------------------------------------
  // SIMULATION MODE: Realistic Phone Frame Mockup Workspace
  // -------------------------------------------------------------
  if (isPhoneSimMode) {
    return (
      <div className="min-h-screen bg-[#07070a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/25 via-[#090a0e] to-[#040406] text-zinc-100 flex flex-col items-center justify-start p-2 sm:p-4 selection:bg-indigo-500/30 selection:text-indigo-200">
        {/* Floating Top Control Toolbar for Simulator */}
        <div className="w-full max-w-2xl bg-[#121215]/95 backdrop-blur-md border border-zinc-800 rounded-2xl p-2.5 px-4 mb-4 flex items-center justify-between shadow-2xl z-30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/30">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white tracking-wide">
                  Mod Mockup Telefon Pintar
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Live iPhone 16 Pro (390×844)
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 hidden sm:block">
                Interaktif penuh: Skrol, semak tab resepi, tukar peranan, dan jana PDF terus di dalam telefon.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPhoneMockupModal(true)}
              className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Lihat Galeri Mockup HD"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Galeri Mockup</span>
            </button>

            <button
              onClick={() => setIsPhoneSimMode(false)}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-900/40 flex items-center gap-1.5 cursor-pointer"
              title="Keluar ke paparan skrin penuh"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Skrin Penuh</span>
            </button>
          </div>
        </div>

        {/* Realistic Mobile Device Frame */}
        <div className="relative my-auto pb-4">
          {/* Hardware Side Buttons */}
          <div className="hidden sm:block absolute -left-2.5 top-28 w-1 h-12 bg-zinc-700 rounded-l-sm shadow-md" />
          <div className="hidden sm:block absolute -left-2.5 top-44 w-1 h-12 bg-zinc-700 rounded-l-sm shadow-md" />
          <div className="hidden sm:block absolute -left-2.5 top-18 w-1 h-7 bg-amber-600/70 rounded-l-sm shadow-md" />
          <div className="hidden sm:block absolute -right-2.5 top-32 w-1 h-16 bg-zinc-700 rounded-r-sm shadow-md" />

          {/* Phone Shell */}
          <div className="w-[390px] sm:w-[412px] h-[850px] max-h-[88vh] bg-[#0a0a0a] rounded-[52px] border-[10px] border-[#22242a] shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.12)] flex flex-col overflow-hidden relative">
            {/* Dynamic Island and Status Bar */}
            <div className="shrink-0 bg-[#0d0d0d] pt-2 px-6 pb-1 select-none z-30 border-b border-zinc-900/60">
              <div className="flex items-center justify-between text-[11px] font-bold text-zinc-300">
                <span>9:41</span>

                {/* Dynamic Island Pill */}
                <div className="w-24 h-6 bg-black rounded-full flex items-center justify-between px-2.5 shadow-inner border border-zinc-800/80">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-indigo-950/80" />
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-zinc-400">5G</span>
                  <div className="w-4 h-2.5 border border-zinc-400 rounded-sm p-0.5 flex items-center">
                    <div className="h-full w-full bg-emerald-400 rounded-2xs" />
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable App Container Inside Phone */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
              {renderAppContent()}
            </div>

            {/* Home Bar Indicator at Bottom */}
            <div className="absolute bottom-1.5 left-0 right-0 h-4 flex items-center justify-center pointer-events-none z-30">
              <div className="w-32 h-1 bg-zinc-400 rounded-full opacity-60" />
            </div>
          </div>
        </div>

        {/* Global Modals rendered on top */}
        {renderModals()}
      </div>
    );
  }

  // -------------------------------------------------------------
  // STANDARD FULLSCREEN VIEW (Default)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {renderAppContent()}
      {renderModals()}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
