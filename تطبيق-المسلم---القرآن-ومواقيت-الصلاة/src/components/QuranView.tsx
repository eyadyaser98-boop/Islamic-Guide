import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  BookOpen,
  Play,
  Pause,
  Volume2,
  Sparkles,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  CheckCircle,
  HelpCircle,
  X,
  RotateCcw
} from 'lucide-react';
import { QURAN_SURAHS } from '../data/quranSurahs';
import { RECITERS, getAyahAudioUrl, getSurahAudioUrl } from '../data/reciters';
import { SurahMeta, Ayah, Reciter } from '../types';

interface QuranViewProps {
  onOpenAITafsir: (surahName: string, ayahNum: number, ayahText: string) => void;
  lastReadBookmark: { surahNum: number; ayahNum: number; surahName: string } | null;
  onSaveBookmark: (surahNum: number, ayahNum: number, surahName: string) => void;
}

export const QuranView: React.FC<QuranViewProps> = ({
  onOpenAITafsir,
  lastReadBookmark,
  onSaveBookmark,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Meccan' | 'Medinan'>('all');
  const [selectedSurah, setSelectedSurah] = useState<SurahMeta | null>(null);
  
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loadingAyahs, setLoadingAyahs] = useState(false);
  
  const [selectedReciter, setSelectedReciter] = useState<Reciter>(RECITERS[0]);
  const [currentPlayingAyahIndex, setCurrentPlayingAyahIndex] = useState<number | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const [activeAyahModal, setActiveAyahModal] = useState<Ayah | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Arabic numbers helper
  const arabicDigits = (str: string | number) =>
    str.toString().replace(/\d/g, (d) => ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'][parseInt(d, 10)]);

  // Filter surahs
  const filteredSurahs = QURAN_SURAHS.filter((surah) => {
    const matchesSearch =
      surah.name.includes(searchQuery) ||
      surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.number.toString() === searchQuery;
    const matchesType = filterType === 'all' || surah.revelationType === filterType;
    return matchesSearch && matchesType;
  });

  // Fetch Ayahs when a Surah is selected
  useEffect(() => {
    if (!selectedSurah) return;

    setLoadingAyahs(true);
    setAyahs([]);
    setIsPlayingAudio(false);
    setCurrentPlayingAyahIndex(null);

    fetch(`https://api.alquran.cloud/v1/surah/${selectedSurah.number}/ar.alafasy`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data && data.data.ayahs) {
          const list: Ayah[] = data.data.ayahs.map((item: any) => ({
            number: item.number,
            text: item.text,
            numberInSurah: item.numberInSurah,
            juz: item.juz,
            manzil: item.manzil,
            page: item.page,
            ruku: item.ruku,
            hizbQuarter: item.hizbQuarter,
          }));
          setAyahs(list);
        }
      })
      .catch((err) => {
        console.error('Failed to load Surah ayahs:', err);
      })
      .finally(() => {
        setLoadingAyahs(false);
      });
  }, [selectedSurah]);

  // Audio Playback Handler
  const playAyahAudio = (index: number) => {
    if (!selectedSurah || ayahs.length === 0) return;
    const ayah = ayahs[index];
    if (!ayah) return;

    const url = getAyahAudioUrl(selectedSurah.number, ayah.numberInSurah, selectedReciter.subfolder);
    
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(url);
    audioRef.current = audio;

    setCurrentPlayingAyahIndex(index);
    setIsPlayingAudio(true);

    audio.play().catch((err) => {
      console.warn('Audio play failed:', err);
      setIsPlayingAudio(false);
    });

    audio.onended = () => {
      if (index + 1 < ayahs.length) {
        playAyahAudio(index + 1); // Auto play next verse
      } else {
        setIsPlayingAudio(false);
        setCurrentPlayingAyahIndex(null);
      }
    };
  };

  const togglePlaySurah = () => {
    if (isPlayingAudio) {
      if (audioRef.current) audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      const startIndex = currentPlayingAyahIndex ?? 0;
      playAyahAudio(startIndex);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Search Bar */}
      {!selectedSurah ? (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-cairo flex items-center gap-2">
                <BookOpen className="w-7 h-7 text-emerald-300" />
                <span>القرآن الكريم كاملاً</span>
              </h2>
              <p className="text-emerald-100/90 text-xs sm:text-sm font-tajawal max-w-xl">
                اقرأ واستمع لسور القرآن الكريم الـ ١١٤ مع الخاطرة والتفسير الميسر بصوت نخبة من كبار القراء.
              </p>

              {lastReadBookmark && (
                <div className="mt-3 inline-flex items-center gap-2 bg-emerald-950/70 border border-emerald-500/40 px-3.5 py-1.5 rounded-xl text-xs">
                  <Bookmark className="w-4 h-4 text-amber-400" />
                  <span>آخر قراءة: سورة {lastReadBookmark.surahName} (الآية {arabicDigits(lastReadBookmark.ayahNum)})</span>
                  <button
                    onClick={() => {
                      const found = QURAN_SURAHS.find((s) => s.number === lastReadBookmark.surahNum);
                      if (found) setSelectedSurah(found);
                    }}
                    className="underline text-emerald-300 font-bold mr-2 hover:text-white"
                  >
                    الانتقال للموضع
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-3" />
              <input
                type="text"
                placeholder="ابحث باسم السورة أو رقمها..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-11 pl-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl self-stretch sm:self-auto">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterType === 'all'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
                }`}
              >
                الكل (١١٤)
              </button>
              <button
                onClick={() => setFilterType('Meccan')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterType === 'Meccan'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
                }`}
              >
                مكية
              </button>
              <button
                onClick={() => setFilterType('Medinan')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterType === 'Medinan'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
                }`}
              >
                مدنية
              </button>
            </div>
          </div>

          {/* Grid of Surahs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredSurahs.map((surah) => (
              <div
                key={surah.number}
                onClick={() => setSelectedSurah(surah)}
                className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-md group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-200/50 dark:border-slate-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    {arabicDigits(surah.number)}
                  </div>
                  <div>
                    <h3 className="font-bold font-cairo text-base text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      سورة {surah.name}
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} • {arabicDigits(surah.numberOfAyahs)} آية
                    </p>
                  </div>
                </div>

                <div className="text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Selected Surah Reader View */
        <div className="space-y-6">
          
          {/* Surah Toolbar Header */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedSurah(null);
                    if (audioRef.current) audioRef.current.pause();
                    setIsPlayingAudio(false);
                  }}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                  title="العودة لقائمة السور"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div>
                  <h2 className="text-2xl font-black font-cairo text-emerald-800 dark:text-emerald-300">
                    سورة {selectedSurah.name}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-tajawal">
                    {selectedSurah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} • عدد آياتها: {arabicDigits(selectedSurah.numberOfAyahs)} • صفحة: {arabicDigits(selectedSurah.page)}
                  </p>
                </div>
              </div>

              {/* Reciter Selector & Play Control */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Reciter dropdown */}
                <select
                  value={selectedReciter.id}
                  onChange={(e) => {
                    const r = RECITERS.find((rec) => rec.id === e.target.value);
                    if (r) setSelectedReciter(r);
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold focus:outline-none"
                >
                  {RECITERS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nameAr}
                    </option>
                  ))}
                </select>

                <button
                  onClick={togglePlaySurah}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
                >
                  {isPlayingAudio ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>إيقاف تلاوة السورة</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>تلاوة السورة</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>

          {/* Verses Container */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-md space-y-8">
            
            {/* Bismillah Header (Except Surah At-Tawbah #9) */}
            {selectedSurah.number !== 9 && (
              <div className="text-center py-4 border-b border-emerald-100 dark:border-slate-800">
                <p className="font-quran text-2xl sm:text-3xl text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                </p>
              </div>
            )}

            {/* Loading Indicator */}
            {loadingAyahs ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-sm font-bold text-slate-500 font-tajawal">جاري تحميل الآيات الكريمة...</p>
              </div>
            ) : (
              /* Ayahs Paragraph Flow */
              <div className="leading-[2.8] text-right font-quran text-xl sm:text-2xl text-slate-900 dark:text-slate-100 selection:bg-emerald-200 dark:selection:bg-emerald-900">
                {ayahs.map((ayah, idx) => {
                  const isPlayingThis = currentPlayingAyahIndex === idx;
                  const isBookmarked =
                    lastReadBookmark?.surahNum === selectedSurah.number &&
                    lastReadBookmark?.ayahNum === ayah.numberInSurah;

                  return (
                    <span
                      key={ayah.number}
                      onClick={() => setActiveAyahModal(ayah)}
                      className={`cursor-pointer inline hover:bg-emerald-50 dark:hover:bg-slate-800/80 px-1 py-0.5 rounded-lg transition-colors duration-150 ${
                        isPlayingThis
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 font-bold ring-1 ring-emerald-500/40'
                          : ''
                      } ${isBookmarked ? 'border-b-2 border-amber-500' : ''}`}
                    >
                      {/* Clean Verse text */}
                      <span>{ayah.text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '')} </span>
                      
                      {/* Verse End Symbol */}
                      <span className="inline-flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-sans text-xs font-bold mx-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-slate-800 border border-emerald-200/80 dark:border-slate-700">
                        ﴿{arabicDigits(ayah.numberInSurah)}﴾
                      </span>
                    </span>
                  );
                })}
              </div>
            )}

          </div>

          {/* Ayah Actions Modal */}
          {activeAyahModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
                
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-lg font-bold font-cairo text-slate-800 dark:text-slate-100">
                    سورة {selectedSurah.name} - آية ({arabicDigits(activeAyahModal.numberInSurah)})
                  </h3>
                  <button
                    onClick={() => setActiveAyahModal(null)}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Ayah Text Display */}
                <div className="p-4 bg-emerald-50/60 dark:bg-slate-800/60 rounded-2xl border border-emerald-100 dark:border-slate-700 text-center font-quran text-xl text-emerald-950 dark:text-emerald-200 leading-relaxed">
                  "{activeAyahModal.text}"
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 gap-2.5">
                  {/* Play Verse Audio */}
                  <button
                    onClick={() => {
                      const idx = ayahs.findIndex((a) => a.numberInSurah === activeAyahModal.numberInSurah);
                      if (idx >= 0) playAyahAudio(idx);
                      setActiveAyahModal(null);
                    }}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>استماع لهذه الآية</span>
                  </button>

                  {/* AI Tafsir & Reflection */}
                  <button
                    onClick={() => {
                      onOpenAITafsir(selectedSurah.name, activeAyahModal.numberInSurah, activeAyahModal.text);
                      setActiveAyahModal(null);
                    }}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>تفسير وتأمل بالذكاء الاصطناعي</span>
                  </button>

                  {/* Save Bookmark */}
                  <button
                    onClick={() => {
                      onSaveBookmark(selectedSurah.number, activeAyahModal.numberInSurah, selectedSurah.name);
                      setActiveAyahModal(null);
                    }}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all"
                  >
                    <Bookmark className="w-4 h-4 text-amber-500" />
                    <span>حفظ كعلامة موضع القراءة</span>
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
