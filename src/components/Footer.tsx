import React from 'react';
import { Heart, Compass, Shield, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigateTo: (sectionId: string) => void;
  onOpenSettings: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateTo,
  onOpenSettings,
  onOpenAdmin,
}) => {
  return (
    <footer className="border-t border-[#17C98B]/20 bg-[#040D0A] pt-14 pb-24 lg:pb-14 text-sm text-[#A7BEB3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#17C98B]/15 border border-[#17C98B]/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#E7BD68]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c2.25 0 4.33-.74 6-2-5-1-8.5-5.5-8.5-10.5 0-3.3 1.5-6.2 3.8-8-1.07-.33-2.2-.5-3.3-.5z" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-bold text-[#F5FFF9] tracking-wider block">
                  NOOR
                </span>
                <span className="text-xs text-[#E7BD68] font-medium">
                  Your Daily Islamic Companion
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed max-w-sm font-bengali">
              নূর একটি আধুনিক, রুচিশীল ও নির্ভরযোগ্য ইসলামিক প্ল্যাটফর্ম। প্রতিদিনের সালাত, কুরআন তিলাওয়াত, জুমার বয়ান, কিবলা ও দোয়ার মাধ্যমে আল্লাহর সান্নিধ্য লাভের এক অপূর্ব ডিজিটাল সঙ্গী।
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-[#17C98B]">
              <span className="inline-block w-2 h-2 rounded-full bg-[#17C98B] animate-pulse"></span>
              <span>কোনো সাবস্ক্রিপশন বা বিজ্ঞাপন নেই — সম্পূর্ণ উন্মুক্ত</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-[#F5FFF9] uppercase tracking-wider mb-4 font-sans">
              প্রধান বিভাগসমূহ
            </h4>
            <ul className="space-y-2.5 text-xs font-bengali">
              <li>
                <button onClick={() => onNavigateTo('prayer')} className="hover:text-[#17C98B] transition-colors cursor-pointer">
                  নামাজের সময়সূচি
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTo('quran')} className="hover:text-[#17C98B] transition-colors cursor-pointer">
                  পবিত্র কুরআন তিলাওয়াত
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTo('khutbah')} className="hover:text-[#17C98B] transition-colors cursor-pointer">
                  জুমার খুতবা ও বয়ান
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTo('waz')} className="hover:text-[#17C98B] transition-colors cursor-pointer">
                  জনপ্রিয় বাংলা ওয়াজ
                </button>
              </li>
            </ul>
          </div>

          {/* Tools Links */}
          <div>
            <h4 className="text-xs font-bold text-[#F5FFF9] uppercase tracking-wider mb-4 font-sans">
              ইসলামিক টুলস
            </h4>
            <ul className="space-y-2.5 text-xs font-bengali">
              <li>
                <button onClick={() => onNavigateTo('qibla')} className="hover:text-[#17C98B] transition-colors cursor-pointer">
                  কিবলা কম্পাস
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTo('tasbih')} className="hover:text-[#17C98B] transition-colors cursor-pointer">
                  ডিজিটাল তাসবিহ
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTo('duas')} className="hover:text-[#17C98B] transition-colors cursor-pointer">
                  দৈনন্দিন মাসনূন দোয়া
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTo('ramadan')} className="hover:text-[#17C98B] transition-colors cursor-pointer">
                  রমজান ক্যালেন্ডার
                </button>
              </li>
            </ul>
          </div>

          {/* Developer & Noor Mission */}
          <div>
            <h4 className="text-xs font-bold text-[#F5FFF9] uppercase tracking-wider mb-4 font-sans">
              ডেভেলপার পরিচিতি
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-[#081A14] border border-[#17C98B]/20">
                <span className="text-[10px] text-[#A7BEB3] uppercase block font-semibold">ডেভেলপার ও ডিজাইনার</span>
                <span className="text-sm font-bold text-[#17C98B] block mt-0.5">
                  ASM Rownak
                </span>
                <span className="text-[11px] text-[#E7BD68] font-bengali block mt-0.5">
                  এ এস এম রওনক
                </span>
                <p className="text-[11px] text-[#A7BEB3] mt-2 font-bengali leading-relaxed">
                  উম্মাহর খেদমতে নিবেদিত সম্পূর্ণ ইন-অ্যাপ ইসলামিক প্লাটফর্ম।
                </p>
              </div>

              <div className="pt-1">
                <button
                  onClick={onOpenAdmin}
                  className="text-xs text-[#A7BEB3]/80 hover:text-[#E7BD68] flex items-center gap-1.5 transition-colors cursor-pointer py-1.5 px-3 rounded-xl bg-[#081A14] border border-[#17C98B]/15 w-full justify-center"
                >
                  <Shield className="w-3.5 h-3.5 text-[#E7BD68]" />
                  <span>এডমিন কন্ট্রোল প্যানেল</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Ummah & Developer dedication */}
        <div className="pt-8 border-t border-[#17C98B]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-2 font-bengali">
            <span className="flex items-center gap-1.5 text-[#F5FFF9]">
              <span>Developed with sincere dedication by</span>
              <strong className="text-[#17C98B] font-bold tracking-wide text-sm">ASM Rownak</strong>
              <span className="text-[#E7BD68] font-medium">(এ এস এম রওনক)</span>
              <span>for the Muslim Ummah</span>
            </span>
          </div>

          <p className="text-[11px] text-[#A7BEB3]/70 font-bengali">
            © 2026 NOOR — Islamic Life. Developer: ASM Rownak. সর্বস্বত্ব সংরক্ষিত।
          </p>
        </div>

      </div>
    </footer>
  );
};
