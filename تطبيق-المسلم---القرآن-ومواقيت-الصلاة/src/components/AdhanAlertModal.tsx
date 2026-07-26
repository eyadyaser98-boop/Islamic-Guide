import React from 'react';
import { Volume2, VolumeX, Sparkles, X, Check } from 'lucide-react';
import { adhanSoundManager } from '../utils/soundAlert';

interface AdhanAlertModalProps {
  isOpen: boolean;
  prayerName: string;
  cityName: string;
  onClose: () => void;
}

export const AdhanAlertModal: React.FC<AdhanAlertModalProps> = ({
  isOpen,
  prayerName,
  cityName,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleStopSound = () => {
    adhanSoundManager.stopAdhan();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-emerald-900 via-emerald-800 to-teal-950 text-white border border-emerald-500/40 rounded-3xl max-w-md w-full p-8 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-teal-500/20 rounded-full blur-2xl"></div>

        {/* Icon */}
        <div className="w-20 h-20 bg-emerald-600/60 rounded-full border-2 border-emerald-400/40 flex items-center justify-center mx-auto shadow-xl ring-4 ring-emerald-500/20 animate-pulse-ring">
          <Volume2 className="w-10 h-10 text-amber-300" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
            حان الآن موعد أذان
          </span>

          <h2 className="text-3xl font-black font-cairo text-white">
            صلاة {prayerName}
          </h2>

          <p className="text-emerald-100/90 text-sm font-tajawal">
            حسب التوقيت المحلي لمدينة {cityName} وضواحيها
          </p>
        </div>

        {/* Post Adhan Dua Box */}
        <div className="p-4 bg-emerald-950/80 border border-emerald-700/50 rounded-2xl text-right text-xs text-emerald-100 font-amiri leading-relaxed space-y-1">
          <p className="font-bold text-amber-300 text-center text-sm">دعاء ما بعد الأذان:</p>
          <p className="text-center">
            "اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلاَةِ القَائِمَةِ، آتِ مُحَمَّداً الوَسِيلَةَ وَالفَضِيلَةَ، وَابْعَثْهُ مَقَاماً مَحْمُوداً الَّذِي وَعَدْتَهُ"
          </p>
        </div>

        {/* Dismiss / Stop Sound Button */}
        <button
          onClick={handleStopSound}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-lg transition-all cursor-pointer"
        >
          <VolumeX className="w-5 h-5" />
          <span>إيقاف الأذان والتنبيه</span>
        </button>

      </div>
    </div>
  );
};
