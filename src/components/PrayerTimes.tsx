import React, { useState } from 'react';
import { 
  Sun, Sunset, Sunrise, Moon, CloudSun, Clock, MapPin, 
  Settings2, RefreshCw, AlertCircle, Compass, ChevronRight 
} from 'lucide-react';
import { PrayerDayData, NextPrayerInfo, toBengaliDigits, formatTimeDisplay } from '../services/prayerService';
import { PrayerSettings } from '../types/islamic';

interface PrayerTimesProps {
  prayerData: PrayerDayData | null;
  nextPrayer: NextPrayerInfo | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  settings: PrayerSettings;
  onOpenSettings: () => void;
  onOpenAdhanModal: () => void;
}

export const PrayerTimes: React.FC<PrayerTimesProps> = ({
  prayerData,
  nextPrayer,
  loading,
  error,
  onRetry,
  settings,
  onOpenSettings,
  onOpenAdhanModal,
}) => {
  const [activeTab, setActiveTab] = useState<'main' | 'all'>('main');

  const prayerIcons: Record<string, any> = {
    Fajr: Sunrise,
    Sunrise: Sun,
    Dhuhr: Sun,
    Asr: CloudSun,
    Sunset: Sunset,
    Maghrib: Sunset,
    Isha: Moon,
    Imsak: Sunrise,
    Midnight: Moon,
  };

  const prayerBanglaNames: Record<string, string> = {
    Fajr: 'ফজর',
    Sunrise: 'সূর্যোদয়',
    Dhuhr: 'যোহর',
    Asr: 'আসর',
    Sunset: 'সূর্যাস্ত',
    Maghrib: 'মাগরিব',
    Isha: 'ইশা',
    Imsak: 'ইমসাক (সেহরি শেষ)',
    Midnight: 'মধ্যরাত / তাহাজ্জুদ',
  };

  const prayerCardsOrder = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Sunset', 'Maghrib', 'Isha', 'Midnight'];

  const is12h = settings.timeFormat === '12h';

  return (
    <section id="prayer" className="py-12 lg:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17C98B]/10 border border-[#17C98B]/20 text-[#17C98B] text-xs font-semibold uppercase tracking-wider mb-2">
              <Clock className="w-3.5 h-3.5" />
              <span>দৈনিক সালাত ড্যাশবোর্ড</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#F5FFF9] font-bengali">
              নামাজের সময়সূচি
            </h2>
            <div className="flex items-center gap-2 mt-2 text-sm text-[#A7BEB3]">
              <MapPin className="w-4 h-4 text-[#E7BD68]" />
              <span className="font-medium text-[#F5FFF9]">
                {settings.city}, {settings.country}
              </span>
              <span className="text-xs bg-[#17C98B]/10 text-[#17C98B] px-2 py-0.5 rounded">
                {settings.madhab === 'hanafi' ? 'হানাফী' : 'শাফেয়ী'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenSettings}
              className="px-3.5 py-2 rounded-xl bg-[#081A14] border border-[#17C98B]/20 hover:border-[#17C98B] text-xs font-semibold text-[#A7BEB3] hover:text-[#F5FFF9] flex items-center gap-2 transition-all cursor-pointer"
            >
              <Settings2 className="w-4 h-4 text-[#17C98B]" />
              <span>স্থান বা মেথড পরিবর্তন</span>
            </button>

            <button
              onClick={onRetry}
              disabled={loading}
              title="তথ্য রিফ্রেশ করুন"
              className="p-2 rounded-xl bg-[#081A14] border border-[#17C98B]/20 hover:border-[#17C98B] text-[#A7BEB3] hover:text-[#17C98B] transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-200">
                  দুঃখিত, তথ্য লোড করা যাচ্ছে না। কিছুক্ষণ পরে আবার চেষ্টা করুন।
                </p>
                <p className="text-xs text-red-300/70 mt-0.5">
                  অফলাইনে ক্যাশকৃত সময় প্রদর্শিত হচ্ছে।
                </p>
              </div>
            </div>
            <button
              onClick={onRetry}
              className="px-3 py-1.5 rounded-lg bg-red-800/40 hover:bg-red-800/60 text-xs font-semibold text-red-100 transition-colors shrink-0"
            >
              পুনরায় চেষ্টা করুন
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && !prayerData && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
            <div className="lg:col-span-5 h-64 rounded-2xl bg-[#081A14] border border-[#17C98B]/10"></div>
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="h-28 rounded-xl bg-[#081A14] border border-[#17C98B]/10"></div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        {prayerData && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Highlight Card: Next Prayer (পরবর্তী নামাজ) */}
            <div className="lg:col-span-5">
              <div className="relative glass-card-gold rounded-3xl p-6 sm:p-8 h-full flex flex-col justify-between overflow-hidden shadow-xl border border-[#E7BD68]/30">
                
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#E7BD68]/10 rounded-full blur-2xl pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#E7BD68] px-3 py-1 rounded-full bg-[#E7BD68]/15 border border-[#E7BD68]/30">
                      পরবর্তী নামাজ
                    </span>
                    <button
                      onClick={onOpenAdhanModal}
                      className="text-xs text-[#17C98B] hover:text-[#E7BD68] transition-colors flex items-center gap-1 font-semibold"
                    >
                      <span>আজান সেটিংস</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {nextPrayer ? (
                    <>
                      <div className="mt-4">
                        <span className="text-4xl sm:text-5xl font-black text-[#F5FFF9] font-bengali">
                          {nextPrayer.nextPrayerBangla}
                        </span>
                        <div className="mt-2 text-2xl sm:text-3xl font-bold text-[#E7BD68] font-sans">
                          {nextPrayer.nextPrayerTime}
                        </div>
                      </div>

                      {/* Countdown badge */}
                      <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#06130F]/80 border border-[#17C98B]/20">
                        <Clock className="w-4 h-4 text-[#17C98B]" />
                        <span className="text-sm font-semibold text-[#F5FFF9] font-bengali">
                          {nextPrayer.formattedCountdown}
                        </span>
                      </div>

                      {/* Dynamic Progress Bar */}
                      <div className="mt-6 space-y-2">
                        <div className="flex items-center justify-between text-xs text-[#A7BEB3]">
                          <span>পূর্ববর্তী: {nextPrayer.currentPrayer}</span>
                          <span>পরবর্তী: {nextPrayer.nextPrayerBangla}</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-[#06130F] overflow-hidden p-0.5 border border-[#17C98B]/20">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-[#17C98B] via-[#E7BD68] to-[#17C98B] transition-all duration-1000"
                            style={{ width: `${100 - (nextPrayer.percentageRemaining || 0)}%` }}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-[#A7BEB3]">নামাজের হিসাব গণনা করা হচ্ছে...</p>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-[#17C98B]/20 flex items-center justify-between text-xs text-[#A7BEB3]">
                  <span>গণনা পদ্ধতি: {prayerData.meta.method.name}</span>
                  <span className="text-[#17C98B] font-semibold">আল-আযান এপিআই</span>
                </div>

              </div>
            </div>

            {/* Right Column: 8 Prayer Times Grid Cards */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {prayerCardsOrder.map((key) => {
                const time24 = prayerData.timings[key];
                const displayTime = formatTimeDisplay(time24, is12h);
                const Icon = prayerIcons[key] || Clock;
                const banglaName = prayerBanglaNames[key] || key;
                const isNext = nextPrayer?.nextPrayer === key;

                return (
                  <div
                    key={key}
                    className={`relative p-4 rounded-2xl transition-all duration-300 flex flex-col justify-between group ${
                      isNext
                        ? 'bg-gradient-to-b from-[#122D22] to-[#081A14] border-2 border-[#E7BD68] shadow-lg shadow-[#E7BD68]/15 scale-[1.02]'
                        : 'glass-card border border-[#17C98B]/15 hover:border-[#17C98B]/40 hover:-translate-y-0.5'
                    }`}
                  >
                    {isNext && (
                      <span className="absolute -top-2.5 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E7BD68] text-[#06130F] uppercase shadow-sm">
                        আসন্ন
                      </span>
                    )}

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-[#F5FFF9] font-bengali">
                        {banglaName}
                      </span>
                      <div className={`p-1.5 rounded-lg ${
                        isNext ? 'bg-[#E7BD68]/20 text-[#E7BD68]' : 'bg-[#17C98B]/10 text-[#17C98B] group-hover:text-[#E7BD68]'
                      } transition-colors`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <div>
                      <div className={`text-base sm:text-lg font-extrabold tracking-tight ${
                        isNext ? 'text-[#E7BD68]' : 'text-[#F5FFF9]'
                      }`}>
                        {displayTime}
                      </div>
                      <span className="text-[10px] text-[#A7BEB3] uppercase">
                        {key}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
