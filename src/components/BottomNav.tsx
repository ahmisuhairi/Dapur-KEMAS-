import React from 'react';
import { Home, BookOpen, PlusCircle, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';

export type TabType = 'utama' | 'senarai' | 'tambah' | 'tetapan';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  pendingDraftCount: number;
  isPhoneSimMode?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  pendingDraftCount,
  isPhoneSimMode = false,
}) => {
  const { isAdmin, canAddRecipe } = useApp();

  const navItems = [
    {
      id: 'utama' as TabType,
      label: 'Utama',
      icon: Home,
      badge: null,
    },
    {
      id: 'senarai' as TabType,
      label: 'Senarai Resepi',
      icon: BookOpen,
      badge: null,
    },
    {
      id: 'tambah' as TabType,
      label: 'Tambah',
      icon: PlusCircle,
      badge: canAddRecipe ? null : '🔒',
    },
    {
      id: 'tetapan' as TabType,
      label: 'Tetapan',
      icon: Settings,
      badge: pendingDraftCount > 0 ? pendingDraftCount : null,
    },
  ];

  return (
    <nav
      className={`${
        isPhoneSimMode
          ? 'sticky bottom-0 z-40'
          : 'fixed bottom-0 left-0 right-0 z-40'
      } bg-[#121212] border-t border-zinc-800 shadow-2xl`}
    >
      <div className="max-w-md mx-auto px-2 flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${
                isActive
                  ? 'text-indigo-400 font-bold scale-105'
                  : 'text-zinc-500 hover:text-zinc-300 font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'text-indigo-400 stroke-[2.5]' : 'stroke-[1.75]'
                  }`}
                />
                {item.badge !== null && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      typeof item.badge === 'number'
                        ? 'bg-amber-500 text-zinc-950 animate-pulse'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] truncate">{item.label}</span>
              {isActive && (
                <div className="w-6 h-1 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
