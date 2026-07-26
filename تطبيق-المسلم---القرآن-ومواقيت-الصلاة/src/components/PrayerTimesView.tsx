import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellOff,
  Volume2,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Info,
  MapPin,
  Sparkles,
  Play,
  RotateCcw
} from 'lucide-react';
import { EgyptCity, PrayerTimeItem, PrayerTimesData } from '../types';
import { getPrayerList, formatTo12HourArabic } from '../utils/prayerCalc';
import { adhanSoundManager } from '../utils/soundAlert';

interface PrayerTimesViewProps {
  city: EgyptCity;
  prayerData: PrayerTimesData;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onOpenCityModal: () => void;
  soundEnabledMap: Record<string, boolean>;
  onTogglePrayerSound: (prayerId: string) => void;
}

export const PrayerTimesView: React.FC<PrayerTimesViewProps> = ({
  city,
  prayerData,
  selectedDate,
  onDateChange,
  onOpenCityModal,
  soundEnabledMap,
  onTogglePrayerSound,
}) => {
  const [now, setNow] = useState(new Date());
  const [isPlayingTestAdhan, setIsPlayingTestAdhan] = useState(false);

  // Tick clock every second
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const prayerInfo = getPrayerList(prayerData, now, soundEnabledMap);
  const nextPrayer = prayerInfo.nextPrayer;
  const remainingMs = Math.max(0, prayerInfo.remainingMs);

  // Format countdown string
  const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
  const remainingMins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
  const remainingSecs = Math.floor((remainingMs % (1000 * 60)) / 1000);

  const pad = (n: number) => n.toString().padStart(2, '0');
  const arabicDigits = (str: string) =>
    str.replace(/\d/g, (d) => ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'][parseInt(d, 10)]);

  // Handle date navigation
  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    onDateChange(d);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    onDateChange(d);
  };

  const handleResetToday = () => {
    onDateChange(new Date());
  };

  const isToday =
    selectedDate.toDateString() === new Date().toDateString();

  const handleTestAdhan = () => {
    if (isPlayingTestAdhan) {
      adhanSoundManager.stopAdhan();
      setIsPlayingTestAdhan(false);
    } else {
      setIsPlayingTestAdhan(true);
      adhanSoundManager.playAdhan(false).then(() => {
        setIsPlayingTestAdhan(false);
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Location & Date Control */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        {/* Decorative Islamic Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Location details */}
          <div className="space-y-2 text-center md:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 backdrop-blur-xs text-emerald-200 text-xs font-bold border border-emerald-500/30">
              <MapPin className="w-3.5 h-3.5" />
              <span>جمهورية مصر العربية - محافظة {city.governorate}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-cairo flex items-center justify-center md:justify-start gap-3">
              <span>مواقيت الصلاة في {city.nameAr}</span>
              <button
                onClick={onOpenCityModal}
                className="text-xs bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-lg transition-all"
              >
                تغيير
              </button>
            </h2>

            <p className="text-emerald-100/90 text-xs sm:text-sm max-w-xl font-tajawal">
              {prayerData.dateHijri} | {prayerData.dateGregorian}
            </p>
          </div>

          {/* Date Picker Controls */}
          <div className="flex items-center gap-2 bg-emerald-950/60 backdrop-blur-md p-2 rounded-2xl border border-emerald-700/50">
            <button
              onClick={handlePrevDay}
              className="p-2 rounded-xl bg-emerald-800/60 hover:bg-emerald-700 text-white transition-colors"
              title="اليوم السابق"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={handleResetToday}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isToday
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800'
              }`}
            >
              {isToday ? 'اليوم الحالي' : 'العودة لليوم'}
            </button>

            <button
              onClick={handleNextDay}
              className="p-2 rounded-xl bg-emerald-800/60 hover:bg-emerald-700 text-white transition-colors"
              title="اليوم التالي"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>

      {/* Countdown Card for Next Prayer */}
      {nextPrayer && isToday && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-emerald-100 dark:border-slate-800 shadow-md relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-right">
            
            <div className="space-y-1">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                الصلاة القادمة
              </span>
              <h3 className="text-3xl font-black font-cairo text-emerald-700 dark:text-emerald-400">
                صلاة {nextPrayer.nameAr}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                تأذّن في تمام الساعة <span className="font-bold text-slate-800 dark:text-slate-200">{nextPrayer.time12}</span>
              </p>
            </div>

            {/* Big Digit Countdown Timer */}
            <div className="flex items-center justify-center gap-3 dir-ltr">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 dark:bg-slate-800 border-2 border-emerald-500/30 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400 shadow-inner">
                  {arabicDigits(pad(remainingHours))}
                </div>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1">ساعة</span>
              </div>

              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">:</span>

              <div className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 dark:bg-slate-800 border-2 border-emerald-500/30 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400 shadow-inner">
                  {arabicDigits(pad(remainingMins))}
                </div>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1">دقيقة</span>
              </div>

              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">:</span>

              <div className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-600 text-white rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black shadow-md shadow-emerald-600/30">
                  {arabicDigits(pad(remainingSecs))}
                </div>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1">ثانية</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Dynamic Time Change Notice */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 flex items-start gap-3 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-tajawal">
        <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">ملاحظة حركة الشمس ومواقيت الصلاة المتغيرة في مصر:</p>
          <p className="text-amber-800 dark:text-amber-300 mt-0.5">
            تتغير مواقيت الصلاة يومياً بمقدار دقيقة زيادة أو نقصاناً وفق الموقع الفلكي للشمس والهيئة المصرية العامة للمساحة. يمكنك التنقل بين الأيام في الأعلى لمعاينة تغير المواعيد القادمة.
          </p>
        </div>
      </div>

      {/* Grid of Prayer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {prayerInfo.items.map((item) => {
          const isNext = item.isNext && isToday;
          const isCurrent = item.isCurrent && isToday;
          const isEnabled = soundEnabledMap[item.id] !== false;

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                isNext
                  ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/60 dark:to-slate-900 border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-slate-700 shadow-sm'
              }`}
            >
              {isNext && (
                <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-xs">
                  الصلاة القادمة
                </div>
              )}

              <div className="flex items-center justify-between">
                
                <div className="space-y-1">
                  <h4 className="text-xl font-bold font-cairo text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <span>صلاة {item.nameAr}</span>
                    {item.isSunrise && (
                      <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-sans font-bold">
                        وقت الشروق
                      </span>
                    )}
                  </h4>
                  <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-tajawal">
                    {item.time12}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-sans dir-ltr text-right">
                    {item.time24}
                  </p>
                </div>

                {/* Alarm Sound Toggle */}
                {!item.isSunrise && (
                  <button
                    onClick={() => onTogglePrayerSound(item.id)}
                    className={`p-3 rounded-2xl transition-all ${
                      isEnabled
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200'
                    }`}
                    title={isEnabled ? 'التنبيه مفعل لصلوات هذه الأوقات' : 'التنبيه معطل'}
                  >
                    {isEnabled ? (
                      <Bell className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <BellOff className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                )}

              </div>
            </div>
          );
        })}
      </div>

      {/* Adhan Test & Sound Control Box */}
      <div className="bg-slate-100 dark:bg-slate-800/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 text-right">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              اختبار صوت الأذان والتنبيهات
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              تأكد من سماع صوت التكبير عند حراسة مواقيت الصلاة في متصفحك
            </p>
          </div>
        </div>

        <button
          onClick={handleTestAdhan}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm ${
            isPlayingTestAdhan
              ? 'bg-rose-600 text-white hover:bg-rose-700'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          {isPlayingTestAdhan ? (
            <>
              <RotateCcw className="w-4 h-4 animate-spin" />
              <span>إيقاف الصوت</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>تشغيل أذان تجريبي</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
