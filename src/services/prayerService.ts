import { PrayerTimings, PrayerSettings } from '../types/islamic';

const PRAYER_CACHE_KEY = 'noor_prayer_cache';

export const CALCULATION_METHODS = [
  { id: 1, name: 'University of Islamic Sciences, Karachi', bangla: 'ইসলামিক সায়েন্সেস বিশ্ববিদ্যালয়, করাচি (হানাফী)' },
  { id: 2, name: 'Islamic Society of North America (ISNA)', bangla: 'ইসলামিক সোসাইটি অব নর্থ আমেরিকা (ISNA)' },
  { id: 3, name: 'Muslim World League (MWL)', bangla: 'মুসলিম ওয়ার্ল্ড লীগ (MWL)' },
  { id: 4, name: 'Umm al-Qura University, Makkah', bangla: 'উম্মুল কুরা বিশ্ববিদ্যালয়, মক্কা' },
  { id: 5, name: 'Egyptian General Authority of Survey', bangla: 'মিশরীয় জরিপ কর্তৃপক্ষ' },
  { id: 7, name: 'Institute of Geophysics, University of Tehran', bangla: 'তেহরান বিশ্ববিদ্যালয়' },
  { id: 8, name: 'Gulf Region', bangla: 'উপসাগরীয় অঞ্চল' },
  { id: 9, name: 'Kuwait', bangla: 'কুয়েত' },
  { id: 10, name: 'Qatar', bangla: 'কাতার' },
  { id: 11, name: 'Majlis Ugama Islam Singapura, Singapore', bangla: 'সিঙ্গাপুর মজলিস' },
];

export interface PrayerDayData {
  timings: PrayerTimings;
  date: {
    readable: string;
    timestamp: string;
    gregorian: {
      date: string;
      day: string;
      weekday: { en: string; bn?: string };
      month: { en: string; number: number };
      year: string;
    };
    hijri: {
      date: string;
      day: string;
      weekday: { en: string; ar: string };
      month: { en: string; ar: string; number: number };
      year: string;
      designation: { abbreviated: string };
    };
  };
  meta: {
    latitude: number;
    longitude: number;
    timezone: string;
    method: { id: number; name: string };
  };
}

export function toBengaliDigits(numStr: string | number): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return numStr.toString().replace(/[0-9]/g, d => bnDigits[parseInt(d, 10)]);
}

export async function fetchPrayerTimes(
  settings: PrayerSettings,
  targetDate?: Date
): Promise<PrayerDayData> {
  const d = targetDate || new Date();
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  const dateStr = `${day}-${month}-${year}`;

  const school = settings.madhab === 'hanafi' ? 1 : 0;
  const url = `https://api.aladhan.com/v1/timingsByCity/${dateStr}?city=${encodeURIComponent(
    settings.city
  )}&country=${encodeURIComponent(settings.country)}&method=${settings.method}&school=${school}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Prayer API responded with status ' + res.status);
    const json = await res.json();
    if (json.code === 200 && json.data) {
      // Cache successful response
      localStorage.setItem(PRAYER_CACHE_KEY, JSON.stringify(json.data));
      return json.data;
    }
    throw new Error('Invalid prayer data response');
  } catch (err) {
    console.warn('AlAdhan API error, checking cache or fallback:', err);
    const cached = localStorage.getItem(PRAYER_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
    // Static authentic fallback timings for Dhaka
    return getDhakaFallback(d);
  }
}

function getDhakaFallback(d: Date): PrayerDayData {
  return {
    timings: {
      Fajr: '04:42',
      Sunrise: '05:54',
      Dhuhr: '11:58',
      Asr: '16:15',
      Sunset: '18:02',
      Maghrib: '18:02',
      Isha: '19:15',
      Imsak: '04:32',
      Midnight: '23:58',
    },
    date: {
      readable: d.toDateString(),
      timestamp: String(Math.floor(d.getTime() / 1000)),
      gregorian: {
        date: `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`,
        day: String(d.getDate()),
        weekday: { en: d.toLocaleDateString('en-US', { weekday: 'long' }) },
        month: { en: d.toLocaleDateString('en-US', { month: 'long' }), number: d.getMonth() + 1 },
        year: String(d.getFullYear()),
      },
      hijri: {
        date: '20-03-1448',
        day: '20',
        weekday: { en: 'Al Juma\'a', ar: 'الجمعة' },
        month: { en: 'Rabi\' al-Awwal', ar: 'رَبِيع الأَوّل', number: 3 },
        year: '1448',
        designation: { abbreviated: 'AH' },
      },
    },
    meta: {
      latitude: 23.8103,
      longitude: 90.4125,
      timezone: 'Asia/Dhaka',
      method: { id: 1, name: 'Karachi' },
    },
  };
}

export interface NextPrayerInfo {
  currentPrayer: string;
  nextPrayer: string;
  nextPrayerBangla: string;
  nextPrayerTime: string;
  formattedCountdown: string;
  countdownMinutes: number;
  percentageRemaining: number;
}

export function calculateNextPrayer(timings: PrayerTimings, is12h = false): NextPrayerInfo {
  const prayerNames = [
    { key: 'Fajr', bn: 'ফজর' },
    { key: 'Sunrise', bn: 'সূর্যোদয়' },
    { key: 'Dhuhr', bn: 'যোহর' },
    { key: 'Asr', bn: 'আসর' },
    { key: 'Maghrib', bn: 'মাগরিব' },
    { key: 'Isha', bn: 'ইশা' },
  ];

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

  const prayerMinutesList = prayerNames.map(p => {
    const timeStr = timings[p.key] || '00:00';
    const [h, m] = timeStr.split(':').map(Number);
    return {
      ...p,
      timeStr,
      minutes: h * 60 + m,
    };
  });

  let currentIdx = -1;
  let nextIdx = -1;

  for (let i = 0; i < prayerMinutesList.length; i++) {
    if (currentMinutes < prayerMinutesList[i].minutes) {
      nextIdx = i;
      currentIdx = i === 0 ? prayerMinutesList.length - 1 : i - 1;
      break;
    }
  }

  // If past Isha, next prayer is tomorrow's Fajr
  let minutesUntilNext = 0;
  let intervalTotal = 0;

  if (nextIdx === -1) {
    nextIdx = 0; // Fajr next day
    currentIdx = prayerMinutesList.length - 1; // Isha
    const tomorrowFajr = prayerMinutesList[0].minutes + 24 * 60;
    minutesUntilNext = tomorrowFajr - currentMinutes;
    intervalTotal = tomorrowFajr - prayerMinutesList[currentIdx].minutes;
  } else {
    minutesUntilNext = prayerMinutesList[nextIdx].minutes - currentMinutes;
    const prevMinutes = currentIdx === prayerMinutesList.length - 1 
      ? prayerMinutesList[currentIdx].minutes - 24 * 60 
      : prayerMinutesList[currentIdx].minutes;
    intervalTotal = prayerMinutesList[nextIdx].minutes - prevMinutes;
  }

  if (intervalTotal <= 0) intervalTotal = 1;
  const percentageRemaining = Math.max(0, Math.min(100, (minutesUntilNext / intervalTotal) * 100));

  const hoursLeft = Math.floor(minutesUntilNext / 60);
  const minsLeft = Math.floor(minutesUntilNext % 60);

  const formattedCountdown = `${toBengaliDigits(hoursLeft)} ঘণ্টা ${toBengaliDigits(minsLeft)} মিনিট বাকি`;

  const targetPrayer = prayerMinutesList[nextIdx];
  const formattedTime = formatTimeDisplay(targetPrayer.timeStr, is12h);

  return {
    currentPrayer: prayerMinutesList[currentIdx].bn,
    nextPrayer: targetPrayer.key,
    nextPrayerBangla: targetPrayer.bn,
    nextPrayerTime: formattedTime,
    formattedCountdown,
    countdownMinutes: minutesUntilNext,
    percentageRemaining,
  };
}

export function formatTimeDisplay(time24: string, is12h: boolean): string {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr.padStart(2, '0');

  if (!is12h) {
    return `${h.toString().padStart(2, '0')}:${m}`;
  }

  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h.toString().padStart(2, '0')}:${m} ${ampm}`;
}
