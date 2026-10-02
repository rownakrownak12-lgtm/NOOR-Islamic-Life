import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Moon, Sparkles, Compass } from 'lucide-react';
import { PrayerDayData, toBengaliDigits } from '../services/prayerService';

interface HijriCalendarProps {
  currentDayData: PrayerDayData | null;
  onNavigateDay: (offset: number) => void;
  dayOffset: number;
}

export const HijriCalendar: React.FC<HijriCalendarProps> = ({
  currentDayData,
  onNavigateDay,
  dayOffset,
}) => {
  const hijri = currentDayData?.date?.hijri;
  const gregorian = currentDayData?.date?.gregorian;

  // Islamic Important Months list for education
  const islamicMonths = [
    { num: 1, name: 'মুহররম (Muharram)', desc: 'পবিত্র মাস ও আশুরা' },
    { num: 2, name: 'সফর (Safar)', desc: 'দ্বিতীয় হিজরি মাস' },
    { num: 3, name: 'রবিউল আউয়াল (Rabi al-Awwal)', desc: 'রাসূল ﷺ এর জন্ম ও আগমন' },
    { num: 4, name: 'রবিউস সানি (Rabi al-Thani)', desc: 'চতুর্থ হিজরি মাস' },
    { num: 5, name: 'জমাদিউল আউয়াল (Jumada al-Awwal)', desc: 'পঞ্চম হিজরি মাস' },
    { num: 6, name: 'জমাদিউস সানি (Jumada al-Thani)', desc: 'ষষ্ঠ হিজরি মাস' },
    { num: 7, name: 'রজব (Rajab)', desc: 'পবিত্র মাস ও মিরাজ' },
    { num: 8, name: 'শাবান (Sha\'ban)', desc: 'রমজানের প্রস্তুতি ও শবে বরাত' },
    { num: 9, name: 'রমজান (Ramadan)', desc: 'সিয়াম সাধনা ও কুরআন নাজিল' },
    { num: 10, name: 'শাওয়াল (Shawwal)', desc: 'ঈদুল ফিতর ও ৬ রোজা' },
    { num: 11, name: 'জিলকদ (Dhul Qi\'dah)', desc: 'সম্মানিত হজের প্রস্তুতি মাস' },
    { num: 12, name: 'জিলহজ (Dhul Hijjah)', desc: 'পবিত্র হজ ও ঈদুল আজহা' },
  ];

  return (
    <section className="py-8 border-y border-[#17C98B]/15 bg-[#06130F]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Left: Navigation and Primary Date Display */}
          <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-start">
            <button
              onClick={() => onNavigateDay(-1)}
              className="p-2.5 rounded-xl bg-[#081A14] border border-[#17C98B]/20 hover:border-[#17C98B] text-[#A7BEB3] hover:text-[#F5FFF9] transition-all cursor-pointer"
              title="পূর্ববর্তী দিন"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-[#E7BD68]">
                <Moon className="w-3.5 h-3.5" />
                <span>ইসলামিক হিজরি ক্যালেন্ডার</span>
                {dayOffset !== 0 && (
                  <button
                    onClick={() => onNavigateDay(-dayOffset)}
                    className="ml-2 px-2 py-0.5 rounded bg-[#17C98B]/20 text-[#17C98B] text-[10px] font-bold hover:bg-[#17C98B]/30"
                  >
                    আজকে ফিরে যান
                  </button>
                )}
              </div>

              <div className="text-xl sm:text-2xl font-bold text-[#F5FFF9] font-bengali mt-0.5">
                {hijri ? (
                  <>
                    <span>{toBengaliDigits(hijri.day)} </span>
                    <span>{hijri.month.en} </span>
                    <span>{toBengaliDigits(hijri.year)} {hijri.designation.abbreviated}</span>
                  </>
                ) : (
                  'হিজরি তারিখ লোড হচ্ছে...'
                )}
              </div>

              <p className="text-xs text-[#A7BEB3] font-bengali">
                {gregorian ? (
                  <>
                    {gregorian.weekday.en}, {toBengaliDigits(gregorian.day)} {gregorian.month.en} {toBengaliDigits(gregorian.year)} ঈসায়ী
                  </>
                ) : (
                  'ইংরেজি তারিখ'
                )}
              </p>
            </div>

            <button
              onClick={() => onNavigateDay(1)}
              className="p-2.5 rounded-xl bg-[#081A14] border border-[#17C98B]/20 hover:border-[#17C98B] text-[#A7BEB3] hover:text-[#F5FFF9] transition-all cursor-pointer"
              title="পরবর্তী দিন"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right: Hijri Month Highlight Pill & Quick Facts */}
          <div className="flex items-center gap-3 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
            <div className="px-4 py-2 rounded-2xl bg-[#081A14] border border-[#E7BD68]/30 flex items-center gap-3 shrink-0">
              <span className="p-2 rounded-xl bg-[#E7BD68]/15 text-[#E7BD68]">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs font-bold text-[#E7BD68] block">
                  বর্তমান মাস: {hijri?.month.ar || 'الشهر الهجري'}
                </span>
                <span className="text-[11px] text-[#A7BEB3]">
                  {hijri?.month.en || 'Islamic Month'}
                </span>
              </div>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-[#081A14] border border-[#17C98B]/20 flex items-center gap-3 shrink-0">
              <span className="p-2 rounded-xl bg-[#17C98B]/15 text-[#17C98B]">
                <Calendar className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs font-bold text-[#F5FFF9] block">
                  চন্দ্রবর্ষ গণনা
                </span>
                <span className="text-[11px] text-[#A7BEB3]">
                  চাঁদ দেখার ওপর নির্ভরশীল
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
