import { EgyptCity, PrayerTimeItem, PrayerTimesData } from '../types';

// Astronomical calculation helpers
function dtor(d: number): number {
  return (d * Math.PI) / 180.0;
}
function rtod(r: number): number {
  return (r * 180.0) / Math.PI;
}
function fixangle(a: number): number {
  a = a - 360.0 * Math.floor(a / 360.0);
  return a < 0 ? a + 360.0 : a;
}
function fixhour(a: number): number {
  a = a - 24.0 * Math.floor(a / 24.0);
  return a < 0 ? a + 24.0 : a;
}

// Compute Julian Date
function julianDate(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

// Sun position calculation
function sunPosition(jd: number) {
  const D = jd - 2451545.0;
  const g = fixangle(357.529 + 0.98560028 * D);
  const q = fixangle(280.459 + 0.98564736 * D);
  const L = fixangle(q + 1.915 * Math.sin(dtor(g)) + 0.020 * Math.sin(dtor(2 * g)));
  const e = 23.439 - 0.00000036 * D;
  const RA = rtod(Math.atan2(Math.cos(dtor(e)) * Math.sin(dtor(L)), Math.cos(dtor(L)))) / 15.0;
  const Decl = rtod(Math.asin(Math.sin(dtor(e)) * Math.sin(dtor(L))));
  const EqT = q / 15.0 - fixhour(RA);
  return { declination: Decl, equationOfTime: EqT };
}

// Calculate Sun Angle Time
function computeSunAngleTime(angle: number, lat: number, decl: number, direction: 'ccw' | 'cw'): number {
  const d = dtor(decl);
  const l = dtor(lat);
  const a = dtor(angle);
  const top = -Math.sin(a) - Math.sin(l) * Math.sin(d);
  const bottom = Math.cos(l) * Math.cos(d);
  let cosH = top / bottom;
  if (cosH > 1) cosH = 1;
  if (cosH < -1) cosH = -1;
  const H = rtod(Math.acos(cosH)) / 15.0;
  return direction === 'ccw' ? -H : H;
}

// Compute Asr Time (Shafi/Egyptian Standard: factor 1)
function computeAsrTime(lat: number, decl: number): number {
  const d = dtor(decl);
  const l = dtor(lat);
  const phi = Math.abs(l - d);
  const cotA = 1 + Math.tan(phi); // shadow ratio 1 for Shafi/Egyptian
  const angle = rtod(Math.atan(1 / cotA));
  const top = Math.sin(dtor(angle)) - Math.sin(l) * Math.sin(d);
  const bottom = Math.cos(l) * Math.cos(d);
  let cosH = top / bottom;
  if (cosH > 1) cosH = 1;
  if (cosH < -1) cosH = -1;
  return rtod(Math.acos(cosH)) / 15.0;
}

// Egyptian General Authority of Survey Astronomical Calculation
export function calculateLocalPrayerTimes(city: EgyptCity, date: Date = new Date()): PrayerTimesData {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const jd = julianDate(year, month, day);
  const sun = sunPosition(jd);

  // Timezone for Egypt: UTC+2 or UTC+3 depending on DST (Egypt currently uses UTC+3 in summer)
  // Determine Egypt offset dynamically
  const january = new Date(year, 0, 1);
  const july = new Date(year, 6, 1);
  const stdOffset = Math.max(-january.getTimezoneOffset(), -july.getTimezoneOffset()) / 60;
  const isEgyptSummerTime = date.getMonth() >= 3 && date.getMonth() <= 9; // Approx April-October DST in Egypt
  const timezone = isEgyptSummerTime ? 3 : 2; 

  const lngDiff = city.lng / 15.0 - timezone;
  const noon = fixhour(12 - sun.equationOfTime - lngDiff);

  // Egyptian General Authority of Survey: Fajr angle = 19.5°, Isha angle = 17.5°
  const fajrHour = noon + computeSunAngleTime(19.5, city.lat, sun.declination, 'ccw');
  const sunriseHour = noon + computeSunAngleTime(0.833, city.lat, sun.declination, 'ccw');
  const dhuhrHour = noon + 0.033; // ~2 mins safety after solar noon
  const asrHour = noon + computeAsrTime(city.lat, sun.declination);
  const maghribHour = noon + computeSunAngleTime(0.833, city.lat, sun.declination, 'cw');
  const ishaHour = noon + computeSunAngleTime(17.5, city.lat, sun.declination, 'cw');

  function formatTime(hourFloat: number): string {
    let h = Math.floor(hourFloat);
    let m = Math.floor((hourFloat - h) * 60);
    let s = Math.round(((hourFloat - h) * 60 - m) * 60);
    if (s >= 60) {
      m += 1;
      s = 0;
    }
    if (m >= 60) {
      h += 1;
      m = 0;
    }
    h = (h + 24) % 24;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  // Format Hijri Date rough estimation
  const hijriFormatter = new Intl.DateTimeFormat('ar-TN-u-ca-islamic', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const gregFormatter = new Intl.DateTimeFormat('ar-EG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return {
    fajr: formatTime(fajrHour),
    sunrise: formatTime(sunriseHour),
    dhuhr: formatTime(dhuhrHour),
    asr: formatTime(asrHour),
    maghrib: formatTime(maghribHour),
    isha: formatTime(ishaHour),
    dateGregorian: gregFormatter.format(date),
    dateHijri: hijriFormatter.format(date),
    city
  };
}

// Async function to fetch official timings from Aladhan API with Egyptian Method (method=5)
// and fallback gracefully to offline calculation if offline or slow!
export async function getPrayerTimes(city: EgyptCity, date: Date = new Date()): Promise<PrayerTimesData> {
  const dayStr = date.getDate().toString().padStart(2, '0');
  const monthStr = (date.getMonth() + 1).toString().padStart(2, '0');
  const yearStr = date.getFullYear();
  const dateFormatted = `${dayStr}-${monthStr}-${yearStr}`;

  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/timings/${dateFormatted}?latitude=${city.lat}&longitude=${city.lng}&method=5`,
      { cache: 'force-cache' }
    );
    if (response.ok) {
      const json = await response.json();
      if (json && json.data && json.data.timings) {
        const t = json.data.timings;
        const hData = json.data.date.hijri;
        const hijriStr = `${hData.day} ${hData.month.ar} ${hData.year} هـ`;
        
        const gregFormatter = new Intl.DateTimeFormat('ar-EG', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });

        // Clean time strings e.g. "04:32 (EET)" -> "04:32"
        const cleanTime = (s: string) => s.split(' ')[0];

        return {
          fajr: cleanTime(t.Fajr),
          sunrise: cleanTime(t.Sunrise),
          dhuhr: cleanTime(t.Dhuhr),
          asr: cleanTime(t.Asr),
          maghrib: cleanTime(t.Maghrib),
          isha: cleanTime(t.Isha),
          dateGregorian: gregFormatter.format(date),
          dateHijri: hijriStr,
          city
        };
      }
    }
  } catch (err) {
    console.warn('Aladhan API fetch error, using local astronomical calculation engine:', err);
  }

  // Fallback to local calculation
  return calculateLocalPrayerTimes(city, date);
}

// Convert 24-hour time "14:30" to 12-hour Arabic time "02:30 م"
export function formatTo12HourArabic(time24: string): string {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const period = h >= 12 ? 'م' : 'ص';
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  const arabicDigits = (str: string) =>
    str.replace(/\d/g, (d) => ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'][parseInt(d, 10)]);

  return `${arabicDigits(h.toString().padStart(2, '0'))}:${arabicDigits(mStr)} ${period}`;
}

// Parse "HH:MM" into timestamp for a specific Date
export function getPrayerTimestamp(time24: string, date: Date = new Date()): number {
  if (!time24) return Date.now();
  const [h, m] = time24.split(':').map((v) => parseInt(v, 10));
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return d.getTime();
}

// Calculate next prayer and status
export function getPrayerList(data: PrayerTimesData, currentDate: Date = new Date(), soundEnabledMap: Record<string, boolean> = {}): {
  items: PrayerTimeItem[];
  nextPrayer: PrayerTimeItem | null;
  currentPrayer: PrayerTimeItem | null;
  remainingMs: number;
} {
  const now = currentDate.getTime();

  const rawList = [
    { id: 'fajr', nameAr: 'الفجر', nameEn: 'Fajr', time24: data.fajr },
    { id: 'sunrise', nameAr: 'الشروق', nameEn: 'Sunrise', time24: data.sunrise, isSunrise: true },
    { id: 'dhuhr', nameAr: 'الظهر', nameEn: 'Dhuhr', time24: data.dhuhr },
    { id: 'asr', nameAr: 'العصر', nameEn: 'Asr', time24: data.asr },
    { id: 'maghrib', nameAr: 'المغرب', nameEn: 'Maghrib', time24: data.maghrib },
    { id: 'isha', nameAr: 'العشاء', nameEn: 'Isha', time24: data.isha },
  ];

  let nextPrayer: PrayerTimeItem | null = null;
  let currentPrayer: PrayerTimeItem | null = null;
  let remainingMs = 0;

  const items: PrayerTimeItem[] = rawList.map((item) => {
    const timestamp = getPrayerTimestamp(item.time24, currentDate);
    return {
      ...item,
      time12: formatTo12HourArabic(item.time24),
      timestamp,
      isNext: false,
      isCurrent: false,
      enabled: soundEnabledMap[item.id] !== false // default true
    };
  });

  // Find next prayer today
  for (let i = 0; i < items.length; i++) {
    if (items[i].timestamp > now) {
      nextPrayer = items[i];
      nextPrayer.isNext = true;
      remainingMs = nextPrayer.timestamp - now;
      if (i > 0) {
        currentPrayer = items[i - 1];
        currentPrayer.isCurrent = true;
      } else {
        // Current is last prayer from yesterday (Isha)
        currentPrayer = items[items.length - 1];
      }
      break;
    }
  }

  // If all prayers today passed, next prayer is Fajr tomorrow
  if (!nextPrayer) {
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowFajrTs = getPrayerTimestamp(data.fajr, tomorrow);
    
    nextPrayer = {
      ...items[0],
      timestamp: tomorrowFajrTs,
      isNext: true
    };
    remainingMs = tomorrowFajrTs - now;
    
    currentPrayer = items[items.length - 1]; // Isha
    currentPrayer.isCurrent = true;
  }

  return { items, nextPrayer, currentPrayer, remainingMs };
}
