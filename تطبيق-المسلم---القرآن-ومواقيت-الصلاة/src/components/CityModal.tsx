import React, { useState } from 'react';
import { Search, MapPin, Navigation, X, Check } from 'lucide-react';
import { EGYPT_CITIES } from '../data/egyptCities';
import { EgyptCity } from '../types';

interface CityModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: EgyptCity;
  onSelectCity: (city: EgyptCity) => void;
}

export const CityModal: React.FC<CityModalProps> = ({
  isOpen,
  onClose,
  selectedCity,
  onSelectCity,
}) => {
  const [search, setSearch] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredCities = EGYPT_CITIES.filter(
    (c) =>
      c.nameAr.includes(search) ||
      c.governorate.includes(search) ||
      c.nameEn.toLowerCase().includes(search.toLowerCase())
  );

  const handleGPSLocation = () => {
    if (!('geolocation' in navigator)) {
      setGpsError('خدمة تحديد الموقع غير مدعومة في متصفحك.');
      return;
    }

    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;

        // Find nearest Egyptian city by Euclidean distance
        let nearest = EGYPT_CITIES[0];
        let minDistance = Infinity;

        EGYPT_CITIES.forEach((city) => {
          const dist = Math.hypot(city.lat - userLat, city.lng - userLng);
          if (dist < minDistance) {
            minDistance = dist;
            nearest = city;
          }
        });

        // Create custom city if exact coordinates
        const customCity: EgyptCity = {
          id: 'custom_gps',
          nameAr: nearest.nameAr + ' (موقعي الحقيقي)',
          nameEn: nearest.nameEn,
          governorate: nearest.governorate,
          lat: userLat,
          lng: userLng,
        };

        onSelectCity(customCity);
        setGpsLoading(false);
        onClose();
      },
      (err) => {
        console.warn('GPS Error:', err);
        setGpsError('تعذر تحديد الموقع الجغرافي. يرجى اختيار مدينتك يدوياً من القائمة.');
        setGpsLoading(false);
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-lg font-bold font-cairo text-slate-800 dark:text-slate-100">
              اختر المحافظة / المدينة في مصر
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Button & Search */}
        <div className="p-4 space-y-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
          <button
            onClick={handleGPSLocation}
            disabled={gpsLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
          >
            <Navigation className={`w-4 h-4 ${gpsLoading ? 'animate-spin' : ''}`} />
            <span>{gpsLoading ? 'جاري تحديد موقعك الجغرافي...' : 'استخدام موقعي الجغرافي الحالي (GPS)'}</span>
          </button>

          {gpsError && (
            <p className="text-xs text-rose-600 dark:text-rose-400 font-bold text-center">
              {gpsError}
            </p>
          )}

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            <input
              type="text"
              placeholder="ابحث باسم المدينة أو المحافظة..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-9 pl-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Cities List */}
        <div className="p-3 overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredCities.map((city) => {
            const isSelected = selectedCity.id === city.id;
            return (
              <div
                key={city.id}
                onClick={() => {
                  onSelectCity(city);
                  onClose();
                }}
                className={`p-3 rounded-xl cursor-pointer flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <h4 className="text-sm font-bold font-cairo">{city.nameAr}</h4>
                  <p className="text-[11px] text-slate-400">محافظة {city.governorate}</p>
                </div>

                {isSelected && (
                  <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
