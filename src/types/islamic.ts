export interface Speaker {
  id: string;
  name: string;
  banglaName: string;
  description: string;
  photoUrl?: string;
  youtubeUrl: string;
  category: 'Waz' | 'Tafsir' | 'Islamic Lecture' | 'Youth Guidance';
  featured: boolean;
  order: number;
  createdAt?: string;
}

export interface Imam {
  id: string;
  name: string;
  arabicName: string;
  title: string;
  mosque: string;
  photoUrl?: string;
  quranUrl?: string;
  khutbahUrl?: string;
  youtubeUrl?: string;
  featured: boolean;
  order: number;
}

export interface Khutbah {
  id: string;
  title: string;
  arabicTitle?: string;
  date: string;
  hijriDate?: string;
  language: 'Arabic' | 'English' | 'Urdu' | 'Bengali';
  audioUrl?: string;
  sourceUrl: string;
  featured: boolean;
  speaker: string;
  duration?: string;
  summary?: string;
  fullText?: string;
}

export interface Dua {
  id: string;
  arabic: string;
  banglaTranslation: string;
  englishTranslation: string;
  banglaTransliteration?: string;
  source: string;
  category: 'daily' | 'morning_evening' | 'forgiveness' | 'protection' | 'knowledge' | 'parents' | 'ramadan';
  featured?: boolean;
}

export interface Reminder {
  id: string;
  title: string;
  banglaTitle: string;
  content: string;
  banglaContent: string;
  category: 'namaz' | 'quran' | 'parents' | 'dhikr' | 'jummah' | 'akhlaq';
  active: boolean;
  date?: string;
}

export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  [key: string]: string;
}

export interface PrayerSettings {
  city: string;
  country: string;
  method: number; // 1: Karachi, 2: ISNA, 3: MWL, 4: Makkah, 5: Egypt, etc.
  madhab: 'shafi' | 'hanafi';
  timeFormat: '12h' | '24h';
  language: 'bn' | 'en' | 'ar';
}

export interface AdhanSettings {
  enabled: boolean;
  volume: number; // 0 to 1
  reciter: 'makkah' | 'madinah' | 'quds' | 'egypt';
  autoPlayAllowed: boolean;
  prayerAlerts: {
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
    jummah: boolean;
  };
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  banglaName: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface QuranReciter {
  id: string;
  name: string;
  arabicName: string;
  serverUrl: string; // Base URL pattern
}

export interface AppSettings {
  siteName: string;
  tagline: string;
  defaultCity: string;
  defaultCountry: string;
  adminEmail: string;
  ramadanActive: boolean;
  ramadanYear: number;
  announcement?: string;
}
