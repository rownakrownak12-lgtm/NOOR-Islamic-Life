import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, Mic2, Sparkles, HeartHandshake, Compass, ArrowRight } from 'lucide-react';
import { ALL_SURAHS } from '../data/quranData';
import { Speaker, Khutbah, Dua } from '../types/islamic';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  speakers: Speaker[];
  khutbahs: Khutbah[];
  duas: Dua[];
  onNavigateTo: (sectionId: string) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  isOpen,
  onClose,
  speakers,
  khutbahs,
  duas,
  onNavigateTo,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // toggle handled externally or open
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  // Search Surahs
  const matchedSurahs = q ? ALL_SURAHS.filter(s => 
    s.englishName.toLowerCase().includes(q) ||
    s.banglaName.toLowerCase().includes(q) ||
    s.name.includes(q) ||
    s.number.toString() === q
  ).slice(0, 4) : [];

  // Search Speakers
  const matchedSpeakers = q ? speakers.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.banglaName.toLowerCase().includes(q) ||
    s.category.toLowerCase().includes(q)
  ).slice(0, 4) : [];

  // Search Khutbahs
  const matchedKhutbahs = q ? khutbahs.filter(k =>
    k.title.toLowerCase().includes(q) ||
    (k.arabicTitle && k.arabicTitle.includes(q)) ||
    k.language.toLowerCase().includes(q)
  ).slice(0, 4) : [];

  // Search Duas
  const matchedDuas = q ? duas.filter(d =>
    d.banglaTranslation.toLowerCase().includes(q) ||
    d.englishTranslation.toLowerCase().includes(q) ||
    d.source.toLowerCase().includes(q) ||
    d.arabic.includes(q)
  ).slice(0, 4) : [];

  const handleSelectResult = (sectionId: string) => {
    onClose();
    onNavigateTo(sectionId);
  };

  const hasResults = matchedSurahs.length > 0 || matchedSpeakers.length > 0 || matchedKhutbahs.length > 0 || matchedDuas.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#081A14] border border-[#17C98B]/30 rounded-3xl p-6 shadow-2xl overflow-hidden"
      >
        {/* Search Bar Input */}
        <div className="relative flex items-center border-b border-[#17C98B]/20 pb-4">
          <Search className="w-5 h-5 text-[#17C98B] absolute left-0" />
          <input
            type="text"
            autoFocus
            placeholder="সূরা, বক্তা, খুতবা বা দোয়া খুঁজুন..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-8 pr-10 bg-transparent text-[#F5FFF9] placeholder-[#A7BEB3]/60 text-base focus:outline-none"
          />
          {query ? (
            <button onClick={() => setQuery('')} className="p-1 text-[#A7BEB3] hover:text-[#F5FFF9]">
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="text-[10px] px-2 py-0.5 rounded bg-[#17C98B]/10 text-[#17C98B] border border-[#17C98B]/20">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-5 pr-1">
          
          {/* Quick Categories when search is empty */}
          {!q && (
            <div className="space-y-3 py-2">
              <span className="text-xs font-bold text-[#A7BEB3] uppercase tracking-wider block">
                দ্রুত বিভাগে যান
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'prayer', label: 'নামাজের সময়', icon: Compass },
                  { id: 'quran', label: 'কুরআন মজীদ', icon: BookOpen },
                  { id: 'khutbah', label: 'জুমার খুতবা', icon: Mic2 },
                  { id: 'waz', label: 'ওয়াজ মাহফিল', icon: Sparkles },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectResult(item.id)}
                      className="p-3 rounded-xl bg-[#06130F] border border-[#17C98B]/15 hover:border-[#17C98B]/40 text-left transition-colors flex items-center gap-2 group cursor-pointer"
                    >
                      <Icon className="w-4 h-4 text-[#17C98B] group-hover:text-[#E7BD68]" />
                      <span className="text-xs font-semibold text-[#F5FFF9]">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Surahs Results */}
          {matchedSurahs.length > 0 && (
            <div>
              <span className="text-xs font-bold text-[#E7BD68] uppercase tracking-wider block mb-2">
                সূরা ({matchedSurahs.length})
              </span>
              <div className="space-y-1.5">
                {matchedSurahs.map((surah) => (
                  <div
                    key={surah.number}
                    onClick={() => handleSelectResult('quran')}
                    className="p-2.5 rounded-xl bg-[#06130F] hover:bg-[#17C98B]/10 border border-[#17C98B]/10 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-[#17C98B]" />
                      <span className="text-sm font-semibold text-[#F5FFF9] font-bengali">
                        সূরা {surah.banglaName} ({surah.englishName})
                      </span>
                    </div>
                    <span className="font-arabic text-sm text-[#E7BD68]">
                      {surah.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Speakers Results */}
          {matchedSpeakers.length > 0 && (
            <div>
              <span className="text-xs font-bold text-[#17C98B] uppercase tracking-wider block mb-2">
                বক্তা / স্কলার ({matchedSpeakers.length})
              </span>
              <div className="space-y-1.5">
                {matchedSpeakers.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => handleSelectResult('waz')}
                    className="p-2.5 rounded-xl bg-[#06130F] hover:bg-[#17C98B]/10 border border-[#17C98B]/10 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="text-sm font-semibold text-[#F5FFF9] font-bengali block">
                        {s.banglaName}
                      </span>
                      <span className="text-xs text-[#A7BEB3]">
                        {s.name} • {s.category}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#17C98B]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Khutbah Results */}
          {matchedKhutbahs.length > 0 && (
            <div>
              <span className="text-xs font-bold text-[#E7BD68] uppercase tracking-wider block mb-2">
                খুতবা ({matchedKhutbahs.length})
              </span>
              <div className="space-y-1.5">
                {matchedKhutbahs.map((k) => (
                  <div
                    key={k.id}
                    onClick={() => handleSelectResult('khutbah')}
                    className="p-2.5 rounded-xl bg-[#06130F] hover:bg-[#17C98B]/10 border border-[#17C98B]/10 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="text-sm font-semibold text-[#F5FFF9] font-bengali block line-clamp-1">
                        {k.title}
                      </span>
                      <span className="text-xs text-[#A7BEB3]">
                        {k.language} • {k.speaker}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#E7BD68]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Duas Results */}
          {matchedDuas.length > 0 && (
            <div>
              <span className="text-xs font-bold text-[#17C98B] uppercase tracking-wider block mb-2">
                দোয়া ({matchedDuas.length})
              </span>
              <div className="space-y-1.5">
                {matchedDuas.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => handleSelectResult('duas')}
                    className="p-2.5 rounded-xl bg-[#06130F] hover:bg-[#17C98B]/10 border border-[#17C98B]/10 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="font-arabic text-sm text-[#E7BD68] block">
                        {d.arabic}
                      </span>
                      <span className="text-xs text-[#F5FFF9] font-bengali line-clamp-1">
                        "{d.banglaTranslation}"
                      </span>
                    </div>
                    <span className="text-[10px] text-[#A7BEB3]">
                      {d.source}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {q && !hasResults && (
            <div className="text-center py-8 text-[#A7BEB3]">
              <p className="text-sm">কোনো ফলাফল পাওয়া যায়নি।</p>
              <p className="text-xs mt-1">অন্য কোনো শব্দ দিয়ে সার্চ করে দেখুন।</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
