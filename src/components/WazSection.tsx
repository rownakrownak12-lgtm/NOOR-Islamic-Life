import React, { useState } from 'react';
import { Sparkles, Play, UserCheck, X, Volume2, BookOpen } from 'lucide-react';
import { Speaker } from '../types/islamic';

interface WazSectionProps {
  speakers: Speaker[];
  loading: boolean;
  onRefresh?: () => void;
}

export const WazSection: React.FC<WazSectionProps> = ({ speakers }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeSpeakerModal, setActiveSpeakerModal] = useState<Speaker | null>(null);

  const categories = ['All', 'Waz', 'Tafsir', 'Islamic Lecture', 'Youth Guidance'];

  const filteredSpeakers = selectedCategory === 'All'
    ? speakers
    : speakers.filter(s => s.category === selectedCategory);

  // Helper to extract or format clean embed for in-app viewing
  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube-nocookie.com/embed/${match[2]}?autoplay=1&rel=0`;
    }
    return null;
  };

  return (
    <section id="waz" className="py-12 lg:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17C98B]/10 border border-[#17C98B]/20 text-[#17C98B] text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#E7BD68]" />
              <span>বাংলা ওয়াজ ও দ্বীনি আলোচনা</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#F5FFF9] font-bengali">
              🇧🇩 বাংলাদেশের জনপ্রিয় ওয়াজ
            </h2>
            <p className="mt-1 text-sm text-[#A7BEB3]">
              দেশের শীর্ষস্থানীয় ও বিজ্ঞ ইসলামিক চিন্তাবিদ ও বক্তাগণের জীবনঘনিষ্ঠ আলোচনা ও হেদায়েতি নসিহত সরাসরি শুনুন
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#17C98B] text-[#06130F] font-bold shadow-sm'
                    : 'bg-[#081A14] text-[#A7BEB3] hover:text-[#F5FFF9] border border-[#17C98B]/15'
                }`}
              >
                {cat === 'All' ? 'সকল আলোচক' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Speakers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpeakers.map((speaker) => {
            return (
              <div
                key={speaker.id}
                className="glass-card rounded-3xl p-6 border border-[#17C98B]/20 hover:border-[#E7BD68]/50 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 shadow-lg"
              >
                <div>
                  
                  {/* Top Bar with Category & Featured Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#17C98B]/15 text-[#17C98B] font-semibold border border-[#17C98B]/25">
                      {speaker.category}
                    </span>
                    {speaker.featured && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#E7BD68]/20 text-[#E7BD68] font-bold border border-[#E7BD68]/30 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        জনপ্রিয়
                      </span>
                    )}
                  </div>

                  {/* Speaker Profile Header */}
                  <div className="flex items-start gap-4 mb-4">
                    
                    {/* Tasteful Islamic Avatar */}
                    <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#17C98B]/20 to-[#E7BD68]/20 border border-[#17C98B]/30 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform overflow-hidden">
                      {speaker.photoUrl ? (
                        <img 
                          src={speaker.photoUrl} 
                          alt={speaker.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="text-center">
                          <UserCheck className="w-7 h-7 text-[#17C98B] mx-auto group-hover:text-[#E7BD68] transition-colors" />
                          <span className="text-[8px] text-[#A7BEB3] font-bold block uppercase mt-0.5">
                            দাঈ
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-[#F5FFF9] font-bengali group-hover:text-[#17C98B] transition-colors">
                        {speaker.banglaName}
                      </h3>
                      <p className="text-xs text-[#E7BD68] font-medium">
                        {speaker.name}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#A7BEB3] leading-relaxed line-clamp-3 font-bengali">
                    {speaker.description}
                  </p>

                </div>

                {/* In-App Action Button (NO OUTBOUND REDIRECTS) */}
                <div className="mt-6 pt-4 border-t border-[#17C98B]/15 flex items-center gap-3">
                  <button
                    onClick={() => setActiveSpeakerModal(speaker)}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#17C98B] to-[#0E9F70] text-[#06130F] font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-md shadow-[#17C98B]/20"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>আলোচনা ও বয়ান শুনুন</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* In-App Speaker Video & Lecture Modal (100% inside site) */}
      {activeSpeakerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-[#081A14] border border-[#17C98B]/30 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setActiveSpeakerModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#A7BEB3] hover:text-[#F5FFF9] hover:bg-[#17C98B]/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#17C98B]/15 text-[#17C98B] font-bold uppercase">
                {activeSpeakerModal.category}
              </span>
              <span className="text-xs text-[#E7BD68] font-semibold">
                ইন-অ্যাপ বয়ান প্লেয়ার
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-[#F5FFF9] font-bengali">
              {activeSpeakerModal.banglaName}
            </h3>
            <p className="text-xs text-[#A7BEB3] mb-5">
              {activeSpeakerModal.name}
            </p>

            {/* Embedded Player or Rich Speech UI */}
            {getEmbedUrl(activeSpeakerModal.youtubeUrl) ? (
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-[#17C98B]/20 shadow-2xl mb-6">
                <iframe
                  src={getEmbedUrl(activeSpeakerModal.youtubeUrl)!}
                  title={activeSpeakerModal.banglaName}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[#06130F] border border-[#17C98B]/20 mb-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#17C98B]/15 text-[#17C98B] flex items-center justify-center mx-auto">
                  <Volume2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-[#F5FFF9] font-bengali">
                  দ্বীনি আলোচনা ও হেদায়েতি নসিহত
                </h4>
                <p className="text-xs text-[#A7BEB3] max-w-lg mx-auto font-bengali leading-relaxed">
                  {activeSpeakerModal.description}
                </p>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-[#06130F]/60 border border-[#E7BD68]/20 mb-6">
              <span className="text-xs font-bold text-[#E7BD68] uppercase block mb-1">
                বক্তা সম্পর্কে ও আলোচনার মূল বিষয়
              </span>
              <p className="text-xs sm:text-sm text-[#F5FFF9] font-bengali leading-relaxed">
                {activeSpeakerModal.description}
              </p>
            </div>

            <div className="pt-4 border-t border-[#17C98B]/15 flex items-center justify-between text-xs text-[#A7BEB3]">
              <span>NOOR ইসলামিক লাইফ — কোনো রিডাইরেক্ট নেই</span>
              <button
                onClick={() => setActiveSpeakerModal(null)}
                className="px-4 py-2 rounded-xl bg-[#17C98B]/20 text-[#17C98B] hover:bg-[#17C98B] hover:text-[#06130F] font-bold transition-all cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};

