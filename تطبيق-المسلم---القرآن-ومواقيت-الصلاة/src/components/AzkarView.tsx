import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Sparkles,
  RotateCcw,
  CheckCircle,
  Volume2,
  Layers,
  Heart,
  ChevronLeft
} from 'lucide-react';
import { AZKAR_CATEGORIES, ASMA_ALLAH } from '../data/azkarData';
import { ZikrItem } from '../types';

export const AzkarView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'morning' | 'evening' | 'post_prayer' | 'tasbeeh' | 'asma'>('morning');
  
  // State for Azkar counts
  const [categories, setCategories] = useState(AZKAR_CATEGORIES);

  // State for Digital Tasbeeh
  const [tasbeehCount, setTasbeehCount] = useState(0);
  const [tasbeehTarget, setTasbeehTarget] = useState<number | null>(33);
  const [selectedPhrase, setSelectedPhrase] = useState('سبحان الله وبحمده، سبحان الله العظيم');
  const [totalTasbeehSession, setTotalTasbeehSession] = useState(0);

  const phrases = [
    'سبحان الله وبحمده، سبحان الله العظيم',
    'أستغفر الله واتوب إليه',
    'لا إله إلا الله وحده لا شريك له',
    'اللهم صلِّ وسلم على نبينا محمد',
    'لا حول ولا قوة إلا بالله العلي العظيم',
    'سبحان الله (33) • الحمد لله (33) • الله أكبر (33)'
  ];

  // Arabic numbers helper
  const arabicDigits = (str: string | number) =>
    str.toString().replace(/\d/g, (d) => ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'][parseInt(d, 10)]);

  // Handle incrementing Zikr count
  const handleZikrClick = (categoryId: string, itemId: string, max: number) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          items: cat.items.map((item) => {
            if (item.id !== itemId) return item;
            if (item.currentCount >= max) return item;
            return { ...item, currentCount: item.currentCount + 1 };
          }),
        };
      })
    );
  };

  // Reset a category
  const handleResetCategory = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          items: cat.items.map((item) => ({ ...item, currentCount: 0 })),
        };
      })
    );
  };

  const activeCategory = categories.find((c) => c.id === activeTab);

  // Handle Tasbeeh Click
  const handleTasbeehClick = () => {
    const next = tasbeehCount + 1;
    setTasbeehCount(next);
    setTotalTasbeehSession((prev) => prev + 1);

    // Vibration feedback if supported on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Azkar Sub-Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('morning')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeTab === 'morning'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sun className="w-4 h-4" />
          <span>أذكار الصباح</span>
        </button>

        <button
          onClick={() => setActiveTab('evening')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeTab === 'evening'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Moon className="w-4 h-4" />
          <span>أذكار المساء</span>
        </button>

        <button
          onClick={() => setActiveTab('post_prayer')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeTab === 'post_prayer'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>أذكار الصلاة</span>
        </button>

        <button
          onClick={() => setActiveTab('tasbeeh')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeTab === 'tasbeeh'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>المسبحة الإلكترونية</span>
        </button>

        <button
          onClick={() => setActiveTab('asma')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeTab === 'asma'
              ? 'bg-emerald-800 text-white shadow-md shadow-emerald-800/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Heart className="w-4 h-4 text-amber-400" />
          <span>أسماء الله الحسنى</span>
        </button>
      </div>

      {/* Azkar Items Tab */}
      {activeCategory && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-bold font-cairo text-slate-800 dark:text-slate-100">
                {activeCategory.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-tajawal">
                {activeCategory.description}
              </p>
            </div>

            <button
              onClick={() => handleResetCategory(activeCategory.id)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة ضبط العدادات</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {activeCategory.items.map((item) => {
              const isCompleted = item.currentCount >= item.countNeeded;
              const remaining = item.countNeeded - item.currentCount;

              return (
                <div
                  key={item.id}
                  onClick={() => handleZikrClick(activeCategory.id, item.id, item.countNeeded)}
                  className={`p-6 rounded-3xl border cursor-pointer transition-all duration-200 relative overflow-hidden select-none ${
                    isCompleted
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/80'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-400'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Zikr Text */}
                    <p className="font-amiri text-xl sm:text-2xl text-slate-900 dark:text-slate-100 leading-relaxed text-right">
                      "{item.text}"
                    </p>

                    {item.reward && (
                      <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 rounded-xl text-amber-900 dark:text-amber-300 text-xs font-tajawal">
                        ✨ <span className="font-bold">الفضل:</span> {item.reward}
                      </div>
                    )}

                    {/* Progress Bar & Click Counter */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                            <CheckCircle className="w-4 h-4" />
                            <span>تم إكمال الذكر ({arabicDigits(item.countNeeded)})</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            المتبقي: <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{arabicDigits(remaining)}</span> من {arabicDigits(item.countNeeded)}
                          </span>
                        )}
                      </div>

                      <div className={`px-5 py-2 rounded-2xl font-black text-sm sm:text-base transition-all ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                      }`}>
                        {arabicDigits(item.currentCount)} / {arabicDigits(item.countNeeded)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Digital Tasbeeh Tab */}
      {activeTab === 'tasbeeh' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-md max-w-2xl mx-auto space-y-8 text-center">
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold font-cairo text-emerald-800 dark:text-emerald-300">
              المسبحة الإلكترونية الذكية
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              اذكر الله وتتبع عدد التسبيحات مع التغذية الصوتية والاهتزاز الذكي
            </p>
          </div>

          {/* Phrase Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block text-right">
              اختر صيغة الذكر والتسبيح:
            </label>
            <select
              value={selectedPhrase}
              onChange={(e) => setSelectedPhrase(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-amiri text-lg font-bold focus:outline-none"
            >
              {phrases.map((p, i) => (
                <option key={i} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Target Preset Selector */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-bold text-slate-500">الهدف:</span>
            {[33, 100, null].map((target, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTasbeehTarget(target);
                  setTasbeehCount(0);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  tasbeehTarget === target
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {target ? `${arabicDigits(target)} مرة` : 'عداد حر'}
              </button>
            ))}
          </div>

          {/* Large Clickable Digital Tasbeeh Button */}
          <div className="flex flex-col items-center justify-center py-6">
            <button
              onClick={handleTasbeehClick}
              className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 hover:from-emerald-800 hover:to-teal-600 text-white shadow-2xl shadow-emerald-600/30 flex flex-col items-center justify-center border-8 border-emerald-100 dark:border-slate-800 transition-transform active:scale-95 group cursor-pointer"
            >
              <span className="text-5xl sm:text-6xl font-black font-tajawal drop-shadow-md">
                {arabicDigits(tasbeehCount)}
              </span>
              <span className="text-xs text-emerald-100 font-bold mt-2 group-hover:underline">
                اضغط للتسبيح
              </span>
            </button>
          </div>

          {/* Session Stats & Reset */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              إجمالي تسبيحات الجلسة: <span className="font-bold text-emerald-700 dark:text-emerald-400">{arabicDigits(totalTasbeehSession)}</span>
            </span>

            <button
              onClick={() => setTasbeehCount(0)}
              className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold hover:underline"
            >
              <RotateCcw className="w-4 h-4" />
              <span>تصفير العداد</span>
            </button>
          </div>

        </div>
      )}

      {/* Asma Allah al-Husna Tab */}
      {activeTab === 'asma' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-6 rounded-3xl shadow-md text-center space-y-2">
            <h3 className="text-2xl font-extrabold font-cairo">
              أسماء الله الحسنى ومعانيها
            </h3>
            <p className="text-emerald-100/90 text-xs sm:text-sm font-tajawal max-w-lg mx-auto">
              "وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ فَادْعُوهُ بِهَا" — تأمل أسماء الله الحسنى ومعانيها العظيمة
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {ASMA_ALLAH.map((item, idx) => (
              <div
                key={idx}
                className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 hover:border-emerald-500 transition-colors shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center">
                    {arabicDigits(idx + 1)}
                  </span>
                  <h4 className="font-amiri text-2xl font-bold text-emerald-800 dark:text-emerald-300">
                    {item.name}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-tajawal leading-relaxed">
                  {item.meaning}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
