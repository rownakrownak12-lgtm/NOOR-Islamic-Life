import React, { useState, useEffect } from 'react';
import { MoonStar, Clock, Sparkles, HeartHandshake, Sun, Sunrise, Sunset } from 'lucide-react';
import { PrayerDayData, toBengaliDigits, formatTimeDisplay } from '../services/prayerService';

interface RamadanTrackerProps {
  prayerData: PrayerDayData | null;
  is12h?: boolean;
}

export const RamadanTracker: React.FC<RamadanTrackerProps> = ({ prayerData, is12h = false }) => {
  const hijri = prayerData?.date?.hijri;
  const isRamadan = hijri?.month?.number === 9;

  const [countdownStr, setCountdownStr] = useState('');
  const [countdownLabel, setCountdownLabel] = useState('ইফতারের সময় বাকি');

  const imsakTime = prayerData?.timings?.Imsak || prayerData?.timings?.Fajr || '04:42';
  const maghribTime = prayerData?.timings?.Maghrib || '18:02';

  // Calculate countdown to Sehri or Iftar
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const currentMin = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

      const [mH, mM] = maghribTime.split(':').map(Number);
      const maghribMin = mH * 60 + mM;

      const [sH, sM] = imsakTime.split(':').map(Number);
      const imsakMin = sH * 60 + sM;

      if (currentMin >= imsakMin && currentMin < maghribMin) {
        // Counting down to Iftar
        setCountdownLabel('ইফতারের সময় বাকি');
        const diff = maghribMin - currentMin;
        const h = Math.floor(diff / 60);
        const m = Math.floor(diff % 60);
        const s = Math.floor((diff * 60) % 60);
        setCountdownStr(`${toBengaliDigits(h)} ঘণ্টা ${toBengaliDigits(m)} মিনিট ${toBengaliDigits(s)} সেকেন্ড`);
      } else {
        // Counting down to Suhoor
        setCountdownLabel('সেহরির শেষ সময় বাকি');
        let diff = 0;
        if (currentMin >= maghribMin) {
          diff = (24 * 60 - currentMin) + imsakMin;
        } else {
          diff = imsakMin - currentMin;
        }
        const h = Math.floor(diff / 60);
        const m = Math.floor(diff % 60);
        const s = Math.floor((diff * 60) % 60);
        setCountdownStr(`${toBengaliDigits(h)} ঘণ্টা ${toBengaliDigits(m)} মিনিট ${toBengaliDigits(s)} সেকেন্ড`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [imsakTime, maghribTime]);

  return (
    <section id="ramadan" className="py-12 lg:py-20 relative bg-[#06130F]/40 border-t border-[#17C98B]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7BD68]/15 border border-[#E7BD68]/30 text-[#E7BD68] text-xs font-semibold uppercase tracking-wider mb-2">
            <MoonStar className="w-3.5 h-3.5" />
            <span>মাহে রমজান ও সিয়াম সাধনা</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#F5FFF9] font-bengali">
            🌙 রমজান ক্যালেন্ডার ও ইফতার-সেহরি
          </h2>
          <p className="mt-2 text-sm text-[#A7BEB3]">
            {isRamadan 
              ? `পবিত্র রমজানের ${toBengaliDigits(hijri?.day || '১')}ম রোজা`
              : 'রমজানুল মুবারক ও নফল রোজা পালনের সঠিক সেহরি ও ইফতারের সময়সূচি'}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="glass-card-gold rounded-3xl p-6 sm:p-10 border border-[#E7BD68]/30 shadow-2xl relative">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              {/* Sehri & Iftar Times */}
              <div className="space-y-4">
                {/* Suhoor End Card */}
                <div className="p-4 rounded-2xl bg-[#06130F]/90 border border-[#17C98B]/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#17C98B]/15 text-[#17C98B]">
                      <Sunrise className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-[#F5FFF9] font-bengali block">
                        সেহরির শেষ সময়
                      </span>
                      <span className="text-xs text-[#A7BEB3]">
                        ইমসাক / সুবহে সাদিক
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl sm:text-2xl font-black text-[#17C98B] font-sans">
                      {formatTimeDisplay(imsakTime, is12h)}
                    </span>
                  </div>
                </div>

                {/* Iftar Time Card */}
                <div className="p-4 rounded-2xl bg-[#06130F]/90 border border-[#E7BD68]/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#E7BD68]/15 text-[#E7BD68]">
                      <Sunset className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-[#F5FFF9] font-bengali block">
                        ইফতারের সময়
                      </span>
                      <span className="text-xs text-[#A7BEB3]">
                        মাগরিবের আজান
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl sm:text-2xl font-black text-[#E7BD68] font-sans">
                      {formatTimeDisplay(maghribTime, is12h)}
                    </span>
                  </div>
                </div>

                {/* Live Countdown Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#17C98B]/10 to-[#E7BD68]/10 border border-[#E7BD68]/20 text-center">
                  <span className="text-xs text-[#E7BD68] uppercase font-bold block mb-1">
                    {countdownLabel}
                  </span>
                  <span className="text-lg sm:text-xl font-black text-[#F5FFF9] font-sans tracking-wide">
                    {countdownStr}
                  </span>
                </div>
              </div>

              {/* Authentic Ramadan Duas */}
              <div className="space-y-4">
                {/* Iftar Dua */}
                <div className="p-4 rounded-2xl bg-[#06130F]/90 border border-[#E7BD68]/20">
                  <span className="text-xs font-bold text-[#E7BD68] uppercase block mb-1">
                    ইফতারের দোয়া (সহীহ হাদিস)
                  </span>
                  <p className="font-arabic text-lg text-[#E7BD68] leading-relaxed">
                    ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ
                  </p>
                  <p className="text-xs text-[#F5FFF9] font-bengali mt-1">
                    "পিপাসা দূর হলো, শিরা-উপশিরা সিক্ত হলো এবং ইনশাআল্লাহ প্রতিদান নির্ধারিত হলো।"
                  </p>
                  <span className="text-[10px] text-[#A7BEB3] block mt-1">
                    সূত্র: সুনান আবু দাউদ (২৩৫৭)
                  </span>
                </div>

                {/* Fasting Intent / Reminder */}
                <div className="p-4 rounded-2xl bg-[#06130F]/90 border border-[#17C98B]/20">
                  <span className="text-xs font-bold text-[#17C98B] uppercase block mb-1">
                    সিয়ামের সংকল্প
                  </span>
                  <p className="text-xs text-[#A7BEB3] font-bengali leading-relaxed">
                    মনে মনে আল্লাহর সন্তুষ্টির উদ্দেশ্যে সিয়াম পালনের দৃঢ় ইচ্ছা করাই নিয়ত। মুখে কোনো কৃত্রিম বাক্য উচ্চারণ বাধ্যতামূলক নয়।
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
