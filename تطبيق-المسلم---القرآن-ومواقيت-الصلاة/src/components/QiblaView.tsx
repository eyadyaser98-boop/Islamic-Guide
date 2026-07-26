import React, { useState, useEffect } from 'react';
import { Compass, Navigation, MapPin, Calendar, Sparkles, Heart } from 'lucide-react';
import { EgyptCity } from '../types';
import { calculateQiblaBearing, getDistanceToMeccaKm } from '../utils/qiblaCalc';
import { ISLAMIC_EVENTS } from '../data/islamicEvents';

interface QiblaViewProps {
  city: EgyptCity;
}

export const QiblaView: React.FC<QiblaViewProps> = ({ city }) => {
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  
  const qiblaBearing = calculateQiblaBearing(city.lat, city.lng);
  const meccaDistance = getDistanceToMeccaKm(city.lat, city.lng);

  // Arabic numbers helper
  const arabicDigits = (str: string | number) =>
    str.toString().replace(/\d/g, (d) => ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'][parseInt(d, 10)]);

  // Listen to DeviceOrientation API on supported mobile browsers
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      let heading = e.alpha; // 0 to 360
      if (typeof (e as any).webkitCompassHeading !== 'undefined') {
        heading = (e as any).webkitCompassHeading;
      }
      if (heading !== null && heading !== undefined) {
        setDeviceHeading(heading);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
    return () => {
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, []);

  // Compute rotation angle for needle
  const needleRotation = deviceHeading !== null ? qiblaBearing - deviceHeading : qiblaBearing;

  return (
    <div className="space-y-8">
      
      {/* Qibla Direction Compass Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-md max-w-3xl mx-auto space-y-6">
        
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200/60 dark:border-slate-700">
            <Compass className="w-4 h-4" />
            <span>بوصلة القبلة المشرفة</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-cairo text-slate-800 dark:text-slate-100">
            اتجاه القبلة من مدينة {city.nameAr}
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-tajawal max-w-md mx-auto">
            زاوية الانحراف نحو الكعبة المشرفة بمكة المكرمة: <span className="font-bold text-emerald-600 dark:text-emerald-400">{arabicDigits(qiblaBearing)}°</span> (جنوب شرق)
          </p>
        </div>

        {/* Visual Compass Graphic */}
        <div className="flex flex-col items-center justify-center py-6">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-8 border-emerald-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center shadow-inner">
            
            {/* Cardinal directions */}
            <span className="absolute top-3 font-bold text-xs text-slate-400">شمال</span>
            <span className="absolute bottom-3 font-bold text-xs text-slate-400">جنوب</span>
            <span className="absolute right-4 font-bold text-xs text-slate-400">شرق</span>
            <span className="absolute left-4 font-bold text-xs text-slate-400">غرب</span>

            {/* Compass Dial Rose */}
            <div className="w-48 h-48 rounded-full border border-dashed border-emerald-300 dark:border-slate-700 flex items-center justify-center">
              
              {/* Rotating Qibla Pointer */}
              <div
                className="w-full h-full flex items-center justify-center transition-transform duration-500"
                style={{ transform: `rotate(${needleRotation}deg)` }}
              >
                <div className="flex flex-col items-center -mt-24">
                  {/* Kaaba Icon at head */}
                  <div className="w-10 h-10 bg-slate-900 text-amber-400 rounded-xl flex items-center justify-center font-bold text-xs shadow-lg ring-2 ring-amber-400 border border-slate-700 animate-bounce">
                    🕋
                  </div>
                  {/* Pointer Needle line */}
                  <div className="w-1.5 h-16 bg-gradient-to-b from-amber-400 to-emerald-600 rounded-full shadow-md"></div>
                </div>
              </div>

            </div>

            {/* Center Pivot */}
            <div className="w-5 h-5 rounded-full bg-emerald-600 border-2 border-white dark:border-slate-900 shadow-md absolute"></div>
          </div>
        </div>

        {/* Info stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <div className="p-4 bg-emerald-50/60 dark:bg-slate-800/60 rounded-2xl border border-emerald-100 dark:border-slate-700">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block">المسافة إلى مكة المكرمة</span>
            <span className="text-xl font-extrabold text-emerald-800 dark:text-emerald-300 font-tajawal">
              {arabicDigits(meccaDistance)} كم
            </span>
          </div>

          <div className="p-4 bg-emerald-50/60 dark:bg-slate-800/60 rounded-2xl border border-emerald-100 dark:border-slate-700">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block">درجة انحراف القبلة</span>
            <span className="text-xl font-extrabold text-emerald-800 dark:text-emerald-300 font-tajawal">
              {arabicDigits(qiblaBearing)} درجة
            </span>
          </div>
        </div>

      </div>

      {/* Islamic Events & Hijri Calendar Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-xl font-bold font-cairo text-slate-800 dark:text-slate-100">
            أبرز المناسبات والأعياد الإسلامية
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ISLAMIC_EVENTS.map((event) => (
            <div
              key={event.id}
              className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 hover:border-emerald-500 transition-colors shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold font-tajawal">
                  {event.hijriDate}
                </span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>

              <div>
                <h4 className="font-bold font-cairo text-base text-slate-800 dark:text-slate-100">
                  {event.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  {event.gregorianEstimate}
                </p>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 font-tajawal leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-2">
                {event.description}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
