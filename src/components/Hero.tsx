import React, { useState, useEffect } from 'react';
import { Clock, Volume2, ArrowRight, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { toBengaliDigits } from '../services/prayerService';

interface HeroProps {
  onScrollToPrayer: () => void;
  onOpenAdhanModal: () => void;
  hijriDateStr?: string;
}

export const Hero: React.FC<HeroProps> = ({
  onScrollToPrayer,
  onOpenAdhanModal,
  hijriDateStr = '১৫ রবিউল আউয়াল ১৪৪৮ হিজরি',
}) => {
  const [time, setTime] = useState(new Date());
  const [is12h, setIs12h] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatClock = () => {
    let hours = time.getHours();
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    let ampm = '';

    if (is12h) {
      ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      if (hours === 0) hours = 12;
    }

    const hoursStr = hours.toString().padStart(2, '0');

    return {
      hours: toBengaliDigits(hoursStr),
      minutes: toBengaliDigits(minutes),
      seconds: toBengaliDigits(seconds),
      ampm,
    };
  };

  const clock = formatClock();

  const weekdayBengali = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'][time.getDay()];
  const monthBengali = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'][time.getMonth()];
  const gregorianDateBengali = `${toBengaliDigits(time.getDate())} ${monthBengali}, ${toBengaliDigits(time.getFullYear())}`;

  return (
    <section id="home" className="relative pt-6 pb-12 sm:pt-10 sm:pb-16 lg:pt-14 lg:pb-24 overflow-hidden">
      {/* Decorative Radial Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-[#17C98B]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-5 sm:right-10 w-56 sm:w-72 h-56 sm:h-72 bg-[#E7BD68]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading & Description */}
          <div className="lg:col-span-7 text-center lg:text-left">
            
            {/* Arabic Bismillah with Gold Calligraphic Styling */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#17C98B]/10 border border-[#17C98B]/20 mb-4 sm:mb-6 backdrop-blur-sm max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-[#E7BD68] shrink-0" />
              <p className="font-arabic text-lg sm:text-2xl text-[#E7BD68] tracking-wider leading-relaxed truncate sm:overflow-visible">
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
              </p>
              <Sparkles className="w-3.5 h-3.5 text-[#E7BD68] shrink-0" />
            </div>

            {/* Main Bengali Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F5FFF9] leading-tight font-bengali">
              আল্লাহর স্মরণে <br className="hidden xs:inline" />
              <span className="text-emerald-gradient">শান্তির জীবন</span>
            </h1>

            {/* English Subtitle */}
            <div className="mt-2.5 sm:mt-3 flex items-center justify-center lg:justify-start gap-2">
              <span className="h-px w-6 sm:w-8 bg-[#E7BD68]/40" />
              <span className="text-xs sm:text-sm md:text-base font-semibold text-[#E7BD68] tracking-widest uppercase">
                Your Daily Islamic Companion
              </span>
              <span className="h-px w-6 sm:w-8 bg-[#E7BD68]/40" />
            </div>

            {/* Description in Bengali */}
            <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-[#A7BEB3] max-w-2xl leading-relaxed font-bengali px-2 sm:px-0">
              নামাজের সময়, আজান, কুরআন, জুমার খুতবা, ওয়াজ, কিবলা, তাসবিহ এবং প্রতিদিনের ইসলামিক রিমাইন্ডার— সব এক জায়গায়।
            </p>

            {/* Action Buttons */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={onScrollToPrayer}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#17C98B] to-[#0E9F70] text-[#06130F] font-bold text-sm sm:text-base shadow-lg shadow-[#17C98B]/20 hover:shadow-[#17C98B]/35 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 group"
              >
                <span>নামাজের সময়</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenAdhanModal}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#081A14] border border-[#E7BD68]/30 hover:border-[#E7BD68] text-[#E7BD68] font-semibold text-sm sm:text-base shadow-sm hover:shadow-[#E7BD68]/15 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 group"
              >
                <Volume2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>আজান চালু করুন</span>
              </button>
            </div>

            {/* Quick Micro-stats / Highlights */}
            <div className="mt-8 sm:mt-10 grid grid-cols-3 gap-2 sm:gap-4 border-t border-[#17C98B]/15 pt-5 sm:pt-6 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <span className="text-base sm:text-xl font-bold text-[#F5FFF9] block">১১৪টি</span>
                <p className="text-[11px] sm:text-xs text-[#A7BEB3]">সম্পূর্ণ সুরা অডিও</p>
              </div>
              <div className="text-center lg:text-left border-x border-[#17C98B]/15 lg:border-x-0 px-2 lg:px-0">
                <span className="text-base sm:text-xl font-bold text-[#E7BD68] block">৫ জন</span>
                <p className="text-[11px] sm:text-xs text-[#A7BEB3]">হারামের সম্মানিত ইমাম</p>
              </div>
              <div className="text-center lg:text-left">
                <span className="text-base sm:text-xl font-bold text-[#17C98B] block">১০০%</span>
                <p className="text-[11px] sm:text-xs text-[#A7BEB3]">বিজ্ঞাপনমুক্ত ও ইন-অ্যাপ</p>
              </div>
            </div>

          </div>

          {/* Right Column: Premium Live Clock & Islamic Date Card */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <div className="w-full max-w-sm sm:max-w-md relative">
              
              {/* Outer Decorative Ring */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#17C98B]/30 via-[#E7BD68]/25 to-[#0E9F70]/30 rounded-3xl blur-md opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

              {/* Glass Clock Card */}
              <div className="relative glass-card-gold rounded-3xl p-5 sm:p-7 md:p-8 overflow-hidden shadow-2xl">
                
                {/* Islamic Geometric Watermark */}
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-44 h-44 opacity-10 pointer-events-none">
                  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#E7BD68] w-full h-full">
                    <polygon points="50,0 100,50 50,100 0,50" />
                    <polygon points="50,10 90,50 50,90 10,50" />
                    <circle cx="50" cy="50" r="25" />
                  </svg>
                </div>

                {/* Card Header: Live Status & Format Toggle */}
                <div className="flex items-center justify-between pb-3.5 sm:pb-4 border-b border-[#17C98B]/20">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#17C98B] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-[#17C98B]"></span>
                    </span>
                    <span className="text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-[#17C98B]">
                      লাইভ ক্লক
                    </span>
                  </div>

                  <button
                    onClick={() => setIs12h(!is12h)}
                    className="text-[11px] sm:text-xs px-2.5 py-1 rounded-lg bg-[#17C98B]/10 hover:bg-[#17C98B]/20 text-[#A7BEB3] hover:text-[#F5FFF9] border border-[#17C98B]/20 transition-colors cursor-pointer"
                  >
                    {is12h ? '১২ ঘণ্টা' : '২৪ ঘণ্টা'}
                  </button>
                </div>

                {/* Clock Display */}
                <div className="my-5 sm:my-6 text-center">
                  <div className="flex items-baseline justify-center gap-1 sm:gap-2">
                    <div className="p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl bg-[#06130F]/90 border border-[#17C98B]/20 shadow-inner min-w-[62px] sm:min-w-[76px] md:min-w-[84px]">
                      <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F5FFF9] tracking-tight">
                        {clock.hours}
                      </span>
                      <span className="block text-[9px] sm:text-[10px] text-[#A7BEB3] uppercase mt-0.5 sm:mt-1">ঘণ্টা</span>
                    </div>

                    <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#E7BD68] animate-pulse">:</span>

                    <div className="p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl bg-[#06130F]/90 border border-[#17C98B]/20 shadow-inner min-w-[62px] sm:min-w-[76px] md:min-w-[84px]">
                      <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F5FFF9] tracking-tight">
                        {clock.minutes}
                      </span>
                      <span className="block text-[9px] sm:text-[10px] text-[#A7BEB3] uppercase mt-0.5 sm:mt-1">মিনিট</span>
                    </div>

                    <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#E7BD68] animate-pulse">:</span>

                    <div className="p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl bg-[#06130F]/90 border border-[#E7BD68]/30 shadow-inner min-w-[62px] sm:min-w-[76px] md:min-w-[84px]">
                      <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#E7BD68] tracking-tight">
                        {clock.seconds}
                      </span>
                      <span className="block text-[9px] sm:text-[10px] text-[#E7BD68]/80 uppercase mt-0.5 sm:mt-1">সেকেন্ড</span>
                    </div>
                  </div>

                  {clock.ampm && (
                    <div className="mt-2 text-xs font-bold text-[#E7BD68] uppercase tracking-wider">
                      {clock.ampm}
                    </div>
                  )}
                </div>

                {/* Dates Section */}
                <div className="space-y-2.5 sm:space-y-3 pt-3.5 sm:pt-4 border-t border-[#17C98B]/20">
                  {/* Hijri Date */}
                  <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-[#06130F]/60 border border-[#E7BD68]/20">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-[#E7BD68]">
                      <CalendarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                      <span className="text-[11px] sm:text-xs">হিজরি তারিখ</span>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-[#F5FFF9] font-bengali text-right">
                      {hijriDateStr}
                    </span>
                  </div>

                  {/* Gregorian Date & Weekday */}
                  <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-[#06130F]/60 border border-[#17C98B]/15">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-[#17C98B]">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                      <span className="text-[11px] sm:text-xs">{weekdayBengali}</span>
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-[#A7BEB3] font-bengali text-right">
                      {gregorianDateBengali}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
