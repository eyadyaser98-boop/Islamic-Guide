import { Reciter } from '../types';

export const RECITERS: Reciter[] = [
  { id: 'alafasy', nameAr: 'مشاري راشد العفاسي', nameEn: 'Mishary Rashid Alafasy', subfolder: 'Alafasy_128kbps' },
  { id: 'abdulbasit_murattal', nameAr: 'عبد الباسط عبد الصمد (مرتل)', nameEn: 'Abdul Basit (Murattal)', subfolder: 'Abdul_Basit_Murattal_192kbps' },
  { id: 'minshawi_murattal', nameAr: 'محمد صديق المنشاوي (مرتل)', nameEn: 'Minshawi (Murattal)', subfolder: 'Minshawy_Murattal_128kbps' },
  { id: 'husary', nameAr: 'محمود خليل الحصري', nameEn: 'Mahmoud Khalil Al-Husary', subfolder: 'Husary_128kbps' },
  { id: 'maher', nameAr: 'ماهر المعيقلي', nameEn: 'Maher Al Muaiqly', subfolder: 'MaherAlMuaiqly128kbps' },
  { id: 'shuraim', nameAr: 'سعود الشريم', nameEn: 'Saud Al-Shuraim', subfolder: 'Saood_ash-Shuraym_128kbps' }
];

export function getSurahAudioUrl(surahNumber: number, reciterSubfolder: string): string {
  const padNumber = surahNumber.toString().padStart(3, '0');
  return `https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/${surahNumber}.mp3`;
}

export function getAyahAudioUrl(surahNum: number, ayahNum: number, reciterSubfolder: string = 'Alafasy_128kbps'): string {
  const sPad = surahNum.toString().padStart(3, '0');
  const aPad = ayahNum.toString().padStart(3, '0');
  return `https://everyayah.com/data/${reciterSubfolder}/${sPad}${aPad}.mp3`;
}
