import React from 'react';
import { Moon, Sun, Volume2, VolumeX, MapPin, Compass } from 'lucide-react';
import { EgyptCity } from '../types';

interface HeaderProps {
  city: EgyptCity;
  onOpenCityModal: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  volume: number;
  onVolumeChange: (v: number) => void;
  dateGregorian: string;
  dateHijri: string;
}

export const Header: React.FC<HeaderProps> = ({
  city,
  onOpenCityModal,
  darkMode,
  onToggleDarkMode,
  volume,
  onVolumeChange,
  dateGregorian,
  dateHijri,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-emerald-100 dark:border-slate-800 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 ring-2 ring-emerald-500/20">
            <Compass className="w-6 h-6 animate-pulse-ring" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-cairo bg-gradient-to-l from-emerald-800 via-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
              تطبيق المسلم
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              القرآن الكريم ومواقيت الصلاة بتوقيت جمهورية مصر العربية
            </p>
          </div>
        </div>

        {/* Center: Dates */}
        <div className="hidden md:flex flex-col items-center text-center px-3 py-1 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-xl border border-emerald-100/80 dark:border-emerald-800/40">
          <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 font-tajawal">
            {dateHijri}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {dateGregorian}
          </span>
        </div>

        {/* Actions & Settings */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* City Selector Button */}
          <button
            onClick={onOpenCityModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-slate-700 text-xs sm:text-sm font-bold transition-all shadow-xs"
            title="تغيير المحافظة / المدينة"
          >
            <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{city.nameAr}</span>
          </button>

          {/* Volume Control Button */}
          <div className="relative group">
            <button
              onClick={() => onVolumeChange(volume > 0 ? 0 : 0.8)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              title={volume > 0 ? "كتم صوت الأذان" : "تشغيل صوت الأذان"}
            >
              {volume > 0 ? (
                <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-rose-500" />
              )}
            </button>
          </div>

          {/* Dark Mode Switcher */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            title={darkMode ? "الوضع المضيء" : "الوضع الداكن"}
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
