import React, { useState } from 'react';
import { HeartHandshake, ChevronRight, Copy, Check, Sparkles, BookOpen } from 'lucide-react';
import { Dua } from '../types/islamic';

interface DailyDuaProps {
  duas: Dua[];
  loading: boolean;
}

export const DailyDua: React.FC<DailyDuaProps> = ({ duas }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  const categories = [
    { id: 'all', label: 'সকল দোয়া' },
    { id: 'daily', label: 'দৈনন্দিন' },
    { id: 'knowledge', label: 'জ্ঞান বৃদ্ধি' },
    { id: 'parents', label: 'পিতা-মাতা' },
    { id: 'forgiveness', label: 'ক্ষমা প্রার্থনা' },
    { id: 'morning_evening', label: 'সকাল-সন্ধ্যা' },
    { id: 'ramadan', label: 'রমজান' },
  ];

  const filteredDuas = selectedCategory === 'all'
    ? duas
    : duas.filter(d => d.category === selectedCategory);

  const activeDua = filteredDuas[currentIndex % (filteredDuas.length || 1)] || duas[0];

  const handleNextDua = () => {
    if (filteredDuas.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % filteredDuas.length);
      setCopied(false);
    }
  };

  const handleCopy = () => {
    if (!activeDua) return;
    const textToCopy = `${activeDua.arabic}\n\nউচ্চারণ: ${activeDua.banglaTransliteration || ''}\nঅনুবাদ: ${activeDua.banglaTranslation}\nসূত্র: ${activeDua.source}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="duas" className="py-12 lg:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17C98B]/10 border border-[#17C98B]/20 text-[#17C98B] text-xs font-semibold uppercase tracking-wider mb-2">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>মাসনূন দোয়া ও মোনাজাত</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#F5FFF9] font-bengali">
              🤲 আজকের দোয়া
            </h2>
            <p className="mt-1 text-sm text-[#A7BEB3]">
              পবিত্র কুরআন ও সহীহ হাদিস বর্ণিত প্রমাণিত ও বরকতময় দোয়া
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentIndex(0);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#17C98B] text-[#06130F] font-bold shadow-sm'
                    : 'bg-[#081A14] text-[#A7BEB3] hover:text-[#F5FFF9] border border-[#17C98B]/15'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Dua Glass Card */}
        {activeDua && (
          <div className="max-w-3xl mx-auto">
            <div className="glass-card-gold rounded-3xl p-6 sm:p-10 border border-[#E7BD68]/30 shadow-2xl relative">
              
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#17C98B]/15">
                <span className="text-xs px-3 py-1 rounded-full bg-[#E7BD68]/15 text-[#E7BD68] font-bold uppercase border border-[#E7BD68]/30">
                  {activeDua.category}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-xl bg-[#06130F] border border-[#17C98B]/20 text-[#A7BEB3] hover:text-[#17C98B] transition-colors cursor-pointer flex items-center gap-1.5 text-xs"
                    title="দোয়া কপি করুন"
                  >
                    {copied ? <Check className="w-4 h-4 text-[#17C98B]" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'কপি হয়েছে' : 'কপি'}</span>
                  </button>

                  <button
                    onClick={handleNextDua}
                    className="px-3.5 py-2 rounded-xl bg-[#17C98B] text-[#06130F] font-bold text-xs shadow-md hover:bg-[#14b67d] transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>পরবর্তী দোয়া</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Arabic Religious Text */}
              <div className="text-center my-6 py-4">
                <p className="font-arabic text-2xl sm:text-4xl text-[#E7BD68] leading-loose sm:leading-loose">
                  {activeDua.arabic}
                </p>
              </div>

              {/* Transliteration */}
              {activeDua.banglaTransliteration && (
                <div className="text-center mb-4">
                  <p className="text-xs sm:text-sm text-[#A7BEB3] italic font-bengali">
                    "{activeDua.banglaTransliteration}"
                  </p>
                </div>
              )}

              {/* Bengali Translation */}
              <div className="p-4 rounded-2xl bg-[#06130F]/90 border border-[#17C98B]/20 text-center mb-4">
                <span className="text-[10px] uppercase tracking-wider text-[#17C98B] font-bold block mb-1">
                  বাংলা অর্থ
                </span>
                <p className="text-sm sm:text-base font-semibold text-[#F5FFF9] font-bengali leading-relaxed">
                  "{activeDua.banglaTranslation}"
                </p>
              </div>

              {/* English Translation */}
              {activeDua.englishTranslation && (
                <p className="text-xs text-[#A7BEB3] text-center mb-6 italic">
                  "{activeDua.englishTranslation}"
                </p>
              )}

              {/* Source Reference */}
              <div className="pt-4 border-t border-[#17C98B]/15 flex items-center justify-between text-xs text-[#A7BEB3]">
                <div className="flex items-center gap-1.5 text-[#E7BD68] font-medium">
                  <BookOpen className="w-4 h-4" />
                  <span>সূত্র: {activeDua.source}</span>
                </div>
                <span>সহীহ ও বিশুদ্ধ উদ্ধৃতি</span>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
