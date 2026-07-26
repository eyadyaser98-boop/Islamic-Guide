import { EgyptCity } from '../types';

export const EGYPT_CITIES: EgyptCity[] = [
  { id: 'cairo', nameAr: 'القاهرة', nameEn: 'Cairo', governorate: 'القاهرة', lat: 30.0444, lng: 31.2357 },
  { id: 'alexandria', nameAr: 'الإسكندرية', nameEn: 'Alexandria', governorate: 'الإسكندرية', lat: 31.2001, lng: 29.9187 },
  { id: 'giza', nameAr: 'الجيزة', nameEn: 'Giza', governorate: 'الجيزة', lat: 30.0131, lng: 31.2089 },
  { id: 'shubra_el_kheima', nameAr: 'شبرا الخيمة', nameEn: 'Shubra El Kheima', governorate: 'القليوبية', lat: 30.1286, lng: 31.2422 },
  { id: 'port_said', nameAr: 'بورسعيد', nameEn: 'Port Said', governorate: 'بورسعيد', lat: 31.2653, lng: 32.3019 },
  { id: 'suez', nameAr: 'السويس', nameEn: 'Suez', governorate: 'السويس', lat: 29.9668, lng: 32.5498 },
  { id: 'mansoura', nameAr: 'المنصورة', nameEn: 'Mansoura', governorate: 'الدقهلية', lat: 31.0409, lng: 31.3785 },
  { id: 'tanta', nameAr: 'طنطا', nameEn: 'Tanta', governorate: 'الغربية', lat: 30.7865, lng: 31.0004 },
  { id: 'asyut', nameAr: 'أسيوط', nameEn: 'Asyut', governorate: 'أسيوط', lat: 27.1783, lng: 31.1859 },
  { id: 'fayoum', nameAr: 'الفيوم', nameEn: 'Fayoum', governorate: 'الفيوم', lat: 29.3084, lng: 30.8428 },
  { id: 'zagazig', nameAr: 'الزقازيق', nameEn: 'Zagazig', governorate: 'الشرقية', lat: 30.5877, lng: 31.5020 },
  { id: 'ismailia', nameAr: 'الإسماعيلية', nameEn: 'Ismailia', governorate: 'الإسماعيلية', lat: 30.5965, lng: 32.2715 },
  { id: 'aswan', nameAr: 'أسوان', nameEn: 'Aswan', governorate: 'أسوان', lat: 24.0889, lng: 32.8998 },
  { id: 'damietta', nameAr: 'دمياط', nameEn: 'Damietta', governorate: 'دمياط', lat: 31.4175, lng: 31.8144 },
  { id: 'damanhour', nameAr: 'دمنهور', nameEn: 'Damanhour', governorate: 'البحيرة', lat: 31.0414, lng: 30.4700 },
  { id: 'minya', nameAr: 'المنيا', nameEn: 'Minya', governorate: 'المنيا', lat: 28.1099, lng: 30.7503 },
  { id: 'beni_suef', nameAr: 'بني سويف', nameEn: 'Beni Suef', governorate: 'بني سويف', lat: 29.0661, lng: 31.0994 },
  { id: 'qena', nameAr: 'قنا', nameEn: 'Qena', governorate: 'قنا', lat: 26.1551, lng: 32.7160 },
  { id: 'sohag', nameAr: 'سوهاج', nameEn: 'Sohag', governorate: 'سوهاج', lat: 26.5570, lng: 31.6948 },
  { id: 'hurghada', nameAr: 'الغردقة', nameEn: 'Hurghada', governorate: 'البحر الأحمر', lat: 27.2579, lng: 33.8116 },
  { id: 'shibin_el_kom', nameAr: 'شبين الكوم', nameEn: 'Shibin El Kom', governorate: 'المنوفية', lat: 30.5503, lng: 31.0106 },
  { id: 'banha', nameAr: 'بنها', nameEn: 'Banha', governorate: 'القليوبية', lat: 30.4660, lng: 31.1851 },
  { id: 'kafr_el_sheikh', nameAr: 'كفر الشيخ', nameEn: 'Kafr El Sheikh', governorate: 'كفر الشيخ', lat: 31.1107, lng: 30.9388 },
  { id: 'matrouh', nameAr: 'مرسى مطروح', nameEn: 'Marsa Matruh', governorate: 'مطروح', lat: 31.3543, lng: 27.2373 },
  { id: 'el_arish', nameAr: 'العريش', nameEn: 'El Arish', governorate: 'شمال سيناء', lat: 31.1316, lng: 33.8032 },
  { id: 'luxor', nameAr: 'الأقصر', nameEn: 'Luxor', governorate: 'الأقصر', lat: 25.6872, lng: 32.6396 },
  { id: 'sharm_el_sheikh', nameAr: 'شرم الشيخ', nameEn: 'Sharm El Sheikh', governorate: 'جنوب سيناء', lat: 27.9158, lng: 34.3299 },
  { id: 'october_city', nameAr: '6 أكتوبر', nameEn: '6th of October', governorate: 'الجيزة', lat: 29.9723, lng: 30.9507 },
  { id: 'tenth_ramadan', nameAr: 'العاشر من رمضان', nameEn: '10th of Ramadan', governorate: 'الشرقية', lat: 30.3012, lng: 31.7416 },
  { id: 'el_mahalla', nameAr: 'المحلة الكبرى', nameEn: 'El Mahalla El Kubra', governorate: 'الغربية', lat: 30.9706, lng: 31.1669 }
];

export const DEFAULT_EGYPT_CITY = EGYPT_CITIES[0]; // Cairo
