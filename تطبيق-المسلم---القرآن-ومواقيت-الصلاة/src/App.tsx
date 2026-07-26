import React, { useState, useEffect } from 'react';
import { DEFAULT_EGYPT_CITY } from './data/egyptCities';
import { EgyptCity, PrayerTimesData, NavTab } from './types';
import { getPrayerTimes, calculateLocalPrayerTimes, getPrayerList } from './utils/prayerCalc';
import { adhanSoundManager } from './utils/soundAlert';

import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { PrayerTimesView } from './components/PrayerTimesView';
import { QuranView } from './components/QuranView';
import { AzkarView } from './components/AzkarView';
import { QiblaView } from './components/QiblaView';
import { AITafsirModal } from './components/AITafsirModal';
import { CityModal } from './components/CityModal';
import { AdhanAlertModal } from './components/AdhanAlertModal';

export default function App() {
  // Saved City
  const [city, setCity] = useState<EgyptCity>(() => {
    const saved = localStorage.getItem('muslim_app_city');
    return saved ? JSON.parse(saved) : DEFAULT_EGYPT_CITY;
  });

  // Selected Date
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Prayer Times Data State
  const [prayerData, setPrayerData] = useState<PrayerTimesData>(() =>
    calculateLocalPrayerTimes(city, new Date())
  );

  // Nav Tab
  const [activeTab, setActiveTab] = useState<NavTab>('prayers');

  // Dark Mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('muslim_app_theme') === 'dark';
  });

  // Sound & Volume
  const [volume, setVolume] = useState<number>(() => {
    const saved = localStorage.getItem('muslim_app_volume');
    return saved ? parseFloat(saved) : 0.8;
  });

  const [soundEnabledMap, setSoundEnabledMap] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('muslim_app_prayer_sounds');
    return saved ? JSON.parse(saved) : { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true };
  });

  // Bookmark for Quran
  const [lastReadBookmark, setLastReadBookmark] = useState<{ surahNum: number; ayahNum: number; surahName: string } | null>(() => {
    const saved = localStorage.getItem('muslim_app_quran_bookmark');
    return saved ? JSON.parse(saved) : null;
  });

  // Modals state
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [aiTafsirModal, setAiTafsirModal] = useState<{ isOpen: boolean; surahName?: string; ayahNum?: number; ayahText?: string }>({
    isOpen: false,
  });

  const [adhanAlert, setAdhanAlert] = useState<{ isOpen: boolean; prayerName: string }>({
    isOpen: false,
    prayerName: '',
  });

  // Sync Dark Mode class on <html> element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('muslim_app_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('muslim_app_theme', 'light');
    }
  }, [darkMode]);

  // Sync City & fetch prayer times
  useEffect(() => {
    localStorage.setItem('muslim_app_city', JSON.stringify(city));
    getPrayerTimes(city, selectedDate).then((data) => {
      setPrayerData(data);
    });
  }, [city, selectedDate]);

  // Volume sync
  useEffect(() => {
    adhanSoundManager.setVolume(volume);
    localStorage.setItem('muslim_app_volume', volume.toString());
  }, [volume]);

  // Toggle Sound for individual prayer
  const handleTogglePrayerSound = (prayerId: string) => {
    setSoundEnabledMap((prev) => {
      const updated = { ...prev, [prayerId]: !prev[prayerId] };
      localStorage.setItem('muslim_app_prayer_sounds', JSON.stringify(updated));
      return updated;
    });
  };

  // Save Quran Bookmark
  const handleSaveBookmark = (surahNum: number, ayahNum: number, surahName: string) => {
    const mark = { surahNum, ayahNum, surahName };
    setLastReadBookmark(mark);
    localStorage.setItem('muslim_app_quran_bookmark', JSON.stringify(mark));
  };

  // Real-time prayer alarm check loop (every 10 seconds)
  useEffect(() => {
    let lastTriggeredKey = '';

    const interval = setInterval(() => {
      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMins = now.getMinutes().toString().padStart(2, '0');
      const timeStr = `${currentHours}:${currentMins}`;

      const prayers = [
        { id: 'fajr', name: 'الفجر', time: prayerData.fajr },
        { id: 'dhuhr', name: 'الظهر', time: prayerData.dhuhr },
        { id: 'asr', name: 'العصر', time: prayerData.asr },
        { id: 'maghrib', name: 'المغرب', time: prayerData.maghrib },
        { id: 'isha', name: 'العشاء', time: prayerData.isha },
      ];

      for (const p of prayers) {
        if (p.time === timeStr) {
          const triggerKey = `${p.id}_${timeStr}_${now.toDateString()}`;
          if (triggerKey !== lastTriggeredKey && soundEnabledMap[p.id] !== false) {
            lastTriggeredKey = triggerKey;

            // Trigger Adhan Sound & Notification
            adhanSoundManager.playAdhan(true);
            adhanSoundManager.triggerNotification(
              `حان الآن موعد أذان صلاة ${p.name}`,
              `توقيت صلاة ${p.name} حسب التوقيت المحلي لمدينة ${city.nameAr}`
            );

            setAdhanAlert({
              isOpen: true,
              prayerName: p.name,
            });
          }
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [prayerData, soundEnabledMap, city]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-cairo islamic-bg-pattern flex flex-col selection:bg-emerald-500 selection:text-white transition-colors duration-200">
      
      {/* Header Bar */}
      <Header
        city={city}
        onOpenCityModal={() => setIsCityModalOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        volume={volume}
        onVolumeChange={setVolume}
        dateGregorian={prayerData.dateGregorian}
        dateHijri={prayerData.dateHijri}
      />

      {/* Navigation Tabs */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'prayers' && (
          <PrayerTimesView
            city={city}
            prayerData={prayerData}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onOpenCityModal={() => setIsCityModalOpen(true)}
            soundEnabledMap={soundEnabledMap}
            onTogglePrayerSound={handleTogglePrayerSound}
          />
        )}

        {activeTab === 'quran' && (
          <QuranView
            onOpenAITafsir={(surahName, ayahNum, ayahText) => {
              setAiTafsirModal({
                isOpen: true,
                surahName,
                ayahNum,
                ayahText,
              });
            }}
            lastReadBookmark={lastReadBookmark}
            onSaveBookmark={handleSaveBookmark}
          />
        )}

        {activeTab === 'azkar' && <AzkarView />}

        {activeTab === 'qibla' && <QiblaView city={city} />}

        {activeTab === 'ai' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-6 rounded-3xl shadow-md space-y-2">
              <h2 className="text-2xl font-bold font-cairo">مساعد التفسير والذكاء الاصطناعي</h2>
              <p className="text-emerald-100/90 text-xs sm:text-sm font-tajawal">
                اسأل الذكاء الاصطناعي عن التفسير والخواطر التربوية لأي آية أو موضوع في القرآن الكريم.
              </p>
            </div>

            <AITafsirModal
              isOpen={true}
              onClose={() => setActiveTab('prayers')}
              surahName="الفاتحة"
              ayahNum={1}
              ayahText="بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ"
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
        <p className="font-bold text-slate-700 dark:text-slate-300">
          تطبيق المسلم — القرآن الكريم ومواقيت الصلاة بتوقيت جمهورية مصر العربية
        </p>
        <p className="text-[11px] font-tajawal">
          حُسبت المواعيد وفقاً للهيئة المصرية العامة للمساحة • تقبل الله منا ومنكم صالح الأعمال
        </p>
      </footer>

      {/* Modals */}
      <CityModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        selectedCity={city}
        onSelectCity={setCity}
      />

      {activeTab !== 'ai' && (
        <AITafsirModal
          isOpen={aiTafsirModal.isOpen}
          onClose={() => setAiTafsirModal({ isOpen: false })}
          surahName={aiTafsirModal.surahName}
          ayahNum={aiTafsirModal.ayahNum}
          ayahText={aiTafsirModal.ayahText}
        />
      )}

      <AdhanAlertModal
        isOpen={adhanAlert.isOpen}
        prayerName={adhanAlert.prayerName}
        cityName={city.nameAr}
        onClose={() => setAdhanAlert({ isOpen: false, prayerName: '' })}
      />

    </div>
  );
}
