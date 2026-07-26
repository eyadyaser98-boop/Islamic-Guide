export interface EgyptCity {
  id: string;
  nameAr: string;
  nameEn: string;
  governorate: string;
  lat: number;
  lng: number;
}

export interface PrayerTimeItem {
  id: string;
  nameAr: string;
  nameEn: string;
  time24: string; // "04:30"
  time12: string; // "04:30 ص"
  timestamp: number; // milliseconds
  isNext: boolean;
  isCurrent: boolean;
  enabled: boolean;
  isSunrise?: boolean;
}

export interface PrayerTimesData {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  dateGregorian: string;
  dateHijri: string;
  city: EgyptCity;
}

export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  page: number;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  translation?: string;
  tafsir?: string;
  audioUrl?: string;
}

export interface Reciter {
  id: string;
  nameAr: string;
  nameEn: string;
  subfolder: string;
}

export interface ZikrItem {
  id: string;
  text: string;
  countNeeded: number;
  currentCount: number;
  reward?: string;
  source?: string;
}

export interface AzkarCategory {
  id: string;
  title: string;
  iconName: string;
  description: string;
  items: ZikrItem[];
}

export interface IslamicEvent {
  id: string;
  title: string;
  hijriDate: string;
  gregorianEstimate: string;
  description: string;
  icon: string;
}
