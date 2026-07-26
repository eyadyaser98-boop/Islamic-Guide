import React from 'react';
import { Clock, BookOpen, Heart, Compass, Sparkles } from 'lucide-react';

export type NavTab = 'prayers' | 'quran' | 'azkar' | 'qibla' | 'ai';

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'prayers' as NavTab, label: 'مواقيت الصلاة', icon: Clock },
    { id: 'quran' as NavTab, label: 'القرآن الكريم', icon: BookOpen },
    { id: 'azkar' as NavTab, label: 'الأذكار والمسبحة', icon: Heart },
    { id: 'qibla' as NavTab, label: 'القبلة والتقويم', icon: Compass },
    { id: 'ai' as NavTab, label: 'مساعد التفسير', icon: Sparkles },
  ];

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-2 sm:px-6">
        <div className="flex items-center justify-around sm:justify-start gap-1 sm:gap-2 overflow-x-auto py-2 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 ring-1 ring-emerald-500'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
