import React, { useState } from 'react';
import { Volume2, Mic2, Sparkles, Play, Pause, X } from 'lucide-react';
import { Imam } from '../types/islamic';

interface ImamsSectionProps {
  imams: Imam[];
  loading: boolean;
  onSelectKhutbah?: () => void;
  onSelectQuran?: (imamName: string) => void;
}

export const ImamsSection: React.FC<ImamsSectionProps> = ({ 
  imams,
  onSelectKhutbah,
  onSelectQuran,
}) => {
  const [playingImamId, setPlayingImamId] = useState<string | null>(null);
  const [activeAudioUrl, setActiveAudioUrl] = useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const handlePlayRecitation = (imam: Imam) => {
    const url = imam.quranUrl || 'https://server11.mp3quran.net/sds/001.mp3';
    if (playingImamId === imam.id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingImamId(null);
    } else {
      setPlayingImamId(imam.id);
      setActiveAudioUrl(url);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play().catch(e => console.warn('Audio play error:', e));
      }
    }
  };

  const handleGoToKhutbah = () => {
    if (onSelectKhutbah) {
      onSelectKhutbah();
    } else {
      const elem = document.getElementById('khutbah');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 lg:py-20 relative bg-[#06130F]/40 border-t border-[#17C98B]/10">
      <audio
        ref={audioRef}
        crossOrigin="anonymous"
        onEnded={() => setPlayingImamId(null)}
        onError={() => setPlayingImamId(null)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7BD68]/15 border border-[#E7BD68]/30 text-[#E7BD68] text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>হারামাইন শরিফাইন</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#F5FFF9] font-bengali">
            🕋 মক্কা ও হারামের ইমাম
          </h2>
          <p className="mt-2 text-sm text-[#A7BEB3]">
            মসজিদুল হারামের সম্মানিত ইমাম ও খতিবগণের হৃদয়স্পর্শী তিলাওয়াত ও হেদায়েতি খুতবা শুনুন
          </p>
        </div>

        {/* Imams Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {imams.map((imam) => {
            const isPlayingThis = playingImamId === imam.id;

            return (
              <div
                key={imam.id}
                className="glass-card-gold rounded-3xl p-6 border border-[#E7BD68]/25 hover:border-[#E7BD68] transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 shadow-xl"
              >
                <div>
                  
                  {/* Top Mosque Pill */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#E7BD68]/15 text-[#E7BD68] font-bold border border-[#E7BD68]/30">
                      {imam.mosque}
                    </span>
                    {imam.featured && (
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#17C98B]">
                        বিশিষ্ট ইমাম
                      </span>
                    )}
                  </div>

                  {/* Imam Details */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-[#F5FFF9] group-hover:text-[#E7BD68] transition-colors">
                      {imam.name}
                    </h3>
                    <p className="font-arabic text-base text-[#E7BD68] mt-0.5">
                      {imam.arabicName}
                    </p>
                    <p className="text-xs text-[#A7BEB3] mt-2 font-medium">
                      {imam.title}
                    </p>
                  </div>

                </div>

                {/* In-App Action Buttons (NO EXTERNAL REDIRECTS) */}
                <div className="mt-6 pt-4 border-t border-[#17C98B]/20 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handlePlayRecitation(imam)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isPlayingThis
                        ? 'bg-[#17C98B] text-[#06130F] border-[#17C98B] shadow-md font-bold'
                        : 'bg-[#06130F] border-[#17C98B]/20 hover:border-[#17C98B] text-[#F5FFF9] hover:text-[#17C98B]'
                    }`}
                  >
                    {isPlayingThis ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current text-[#17C98B]" />}
                    <span>{isPlayingThis ? 'থামান' : 'তিলাওয়াত শুনুন'}</span>
                  </button>

                  <button
                    onClick={handleGoToKhutbah}
                    className="py-2.5 px-3 rounded-xl bg-[#06130F] border border-[#E7BD68]/30 hover:border-[#E7BD68] text-[#E7BD68] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Mic2 className="w-3.5 h-3.5" />
                    <span>জুমার খুতবা</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

