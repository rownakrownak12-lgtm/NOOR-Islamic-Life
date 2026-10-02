import React, { useState, useEffect } from 'react';
import { RotateCcw, Volume2, VolumeX, Sparkles, CheckCircle2, Award } from 'lucide-react';
import { toBengaliDigits } from '../services/prayerService';

const TASBIH_STORAGE_KEY = 'noor_tasbih_data';

interface DhikrItem {
  id: string;
  arabic: string;
  transliteration: string;
  banglaMeaning: string;
}

const DHIKR_LIST: DhikrItem[] = [
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'সুবহানাল্লাহ',
    banglaMeaning: 'আল্লাহ মহাপবিত্র ও নিষ্কলুষ',
  },
  {
    id: 'alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'আলহামদুলিল্লাহ',
    banglaMeaning: 'সকল প্রশংসা আল্লাহর জন্য',
  },
  {
    id: 'allahuakbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'আল্লাহু আকবার',
    banglaMeaning: 'আল্লাহ সর্বশ্রেষ্ঠ ও মহান',
  },
  {
    id: 'lailaha',
    arabic: 'لَا إِلٰهَ إِلَّا اللَّهُ',
    transliteration: 'লা ইলাহা ইল্লাল্লাহ',
    banglaMeaning: 'আল্লাহ ছাড়া কোনো সত্য ইলাহ নেই',
  },
  {
    id: 'astaghfirullah',
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'আস্তাগফিরুল্লাহ',
    banglaMeaning: 'আমি আল্লাহর নিকট ক্ষমা প্রার্থনা করছি',
  },
  {
    id: 'salawat',
    arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ',
    transliteration: 'আল্লাহুম্মা সাল্লি আলা মুহাম্মাদ',
    banglaMeaning: 'হে আল্লাহ! মুহাম্মদ ﷺ এর ওপর শান্তি ও রহমত বর্ষণ করুন',
  },
];

export const TasbihCounter: React.FC = () => {
  const [selectedDhikr, setSelectedDhikr] = useState<DhikrItem>(DHIKR_LIST[0]);
  const [count, setCount] = useState<number>(0);
  const [target, setTarget] = useState<number>(33); // 33, 99, 100, 0 (free)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [totalCompletedCycles, setTotalCompletedCycles] = useState<number>(0);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(TASBIH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.count !== undefined) setCount(parsed.count);
        if (parsed.target !== undefined) setTarget(parsed.target);
        if (parsed.cycles !== undefined) setTotalCompletedCycles(parsed.cycles);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save to local storage
  const saveState = (newCount: number, newCycles: number) => {
    try {
      localStorage.setItem(
        TASBIH_STORAGE_KEY,
        JSON.stringify({
          count: newCount,
          target,
          cycles: newCycles,
        })
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleIncrement = () => {
    // Vibration feedback on mobile
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(30);
    }

    // Play subtle audio click using Web Audio API
    if (soundEnabled && typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } catch (err) {
        // ignore audio errors
      }
    }

    const nextCount = count + 1;

    if (target > 0 && nextCount >= target) {
      setIsCompleted(true);
      const newCycles = totalCompletedCycles + 1;
      setTotalCompletedCycles(newCycles);
      setCount(nextCount);
      saveState(nextCount, newCycles);

      // Longer vibration on completion
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([80, 50, 80]);
      }
    } else {
      setCount(nextCount);
      saveState(nextCount, totalCompletedCycles);
    }
  };

  const handleReset = () => {
    setCount(0);
    setIsCompleted(false);
    saveState(0, totalCompletedCycles);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  return (
    <section id="tasbih" className="py-12 lg:py-20 relative bg-[#06130F]/40 border-t border-[#17C98B]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17C98B]/10 border border-[#17C98B]/20 text-[#17C98B] text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>যিকির ও তাসবিহ</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#F5FFF9] font-bengali">
            📿 ডিজিটাল তাসবিহ
          </h2>
          <p className="mt-2 text-sm text-[#A7BEB3]">
            প্রতিদিনের নির্ধারিত তাসবিহ ও দোয়ার হিসাব সহজে সংরক্ষণ করুন
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <div className="glass-card-gold rounded-3xl p-4 sm:p-8 md:p-10 border border-[#E7BD68]/30 shadow-2xl relative">
            
            {/* Top Bar: Dhikr Selection Pill Dropdown */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-[#E7BD68] uppercase tracking-wider mb-2">
                যিকির নির্বাচন করুন
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {DHIKR_LIST.map((d) => {
                  const isSelected = selectedDhikr.id === d.id;
                  return (
                    <button
                      key={d.id}
                      onClick={() => {
                        setSelectedDhikr(d);
                        handleReset();
                      }}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#17C98B] text-[#06130F] font-bold shadow-md'
                          : 'bg-[#06130F] border-[#17C98B]/20 text-[#A7BEB3] hover:text-[#F5FFF9]'
                      }`}
                    >
                      <span className="text-xs font-bengali block">
                        {d.transliteration}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dhikr Arabic & Meaning Banner */}
            <div className="text-center p-3.5 sm:p-4 rounded-2xl bg-[#06130F]/90 border border-[#17C98B]/20 mb-6 sm:mb-8">
              <p className="font-arabic text-2xl sm:text-3xl text-[#E7BD68] leading-relaxed">
                {selectedDhikr.arabic}
              </p>
              <p className="text-xs text-[#F5FFF9] font-medium mt-1">
                {selectedDhikr.banglaMeaning}
              </p>
            </div>

            {/* Target Selectors & Sound Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-1 sm:gap-1.5 bg-[#06130F] p-1 rounded-xl border border-[#17C98B]/20">
                {[33, 99, 100, 0].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTarget(t);
                      handleReset();
                    }}
                    className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      target === t
                        ? 'bg-[#E7BD68] text-[#06130F] font-bold'
                        : 'text-[#A7BEB3] hover:text-[#F5FFF9]'
                    }`}
                  >
                    {t === 0 ? 'মুক্ত' : toBengaliDigits(t)}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  title={soundEnabled ? 'সাউন্ড বন্ধ করুন' : 'সাউন্ড চালু করুন'}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    soundEnabled
                      ? 'bg-[#17C98B]/15 border-[#17C98B]/30 text-[#17C98B]'
                      : 'bg-[#06130F] border-gray-800 text-gray-500'
                  }`}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                <button
                  onClick={handleReset}
                  title="কাউন্টার রিসেট করুন"
                  className="p-2 rounded-xl bg-[#06130F] border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Giant Circular Click Button */}
            <div className="flex flex-col items-center justify-center my-4 sm:my-6">
              <button
                onClick={handleIncrement}
                className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-gradient-to-b from-[#12382A] via-[#081F17] to-[#040D0A] border-4 border-[#17C98B] shadow-2xl shadow-[#17C98B]/30 active:scale-95 transition-all duration-150 cursor-pointer flex flex-col items-center justify-center select-none group"
              >
                {/* Glow ring */}
                <div className="absolute inset-2 rounded-full border border-[#E7BD68]/30 group-hover:border-[#E7BD68] transition-colors" />

                <span className="font-arabic text-2xl sm:text-4xl text-[#E7BD68] mb-0.5 sm:mb-1 group-hover:scale-110 transition-transform">
                  الله
                </span>

                <span className="text-4xl sm:text-5xl font-black text-[#F5FFF9] tracking-tight font-sans">
                  {toBengaliDigits(count)}
                </span>

                <span className="text-[10px] sm:text-[11px] text-[#A7BEB3] uppercase tracking-widest mt-1">
                  {target > 0 ? `টার্গেট: ${toBengaliDigits(target)}` : 'ক্লিক করুন'}
                </span>
              </button>
            </div>

            {/* Target Reached Peaceful Notification */}
            {isCompleted && (
              <div className="mt-4 p-4 rounded-2xl bg-[#17C98B]/20 border border-[#17C98B]/40 text-center animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-center gap-2 text-[#17C98B] font-bold text-sm font-bengali">
                  <CheckCircle2 className="w-5 h-5 text-[#17C98B]" />
                  <span>মাশাআল্লাহ! {toBengaliDigits(target)} বার যিকির সম্পন্ন হয়েছে।</span>
                </div>
                <button
                  onClick={handleReset}
                  className="mt-2 text-xs font-bold text-[#E7BD68] underline cursor-pointer"
                >
                  আবার শুরু করুন
                </button>
              </div>
            )}

            {/* Completed Cycles Badge */}
            <div className="mt-6 pt-4 border-t border-[#17C98B]/15 flex items-center justify-between text-xs text-[#A7BEB3]">
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#E7BD68]" />
                মোট পূর্ণ চক্র: {toBengaliDigits(totalCompletedCycles)} বার
              </span>
              <span className="text-[#17C98B]">অটো-সেভ সক্রিয়</span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
