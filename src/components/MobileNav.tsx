import React, { useState } from 'react';
import { Home, Clock, BookOpen, Mic2, Compass, Layers, Sparkles, HeartHandshake, MoonStar, X } from 'lucide-react';

interface MobileNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenSettings: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  setCurrentTab,
  onOpenSettings,
}) => {
  const [showToolsDrawer, setShowToolsDrawer] = useState(false);

  const handleNav = (tabId: string) => {
    setCurrentTab(tabId);
    setShowToolsDrawer(false);
    const element = document.getElementById(tabId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'home', label: 'হোম', icon: Home },
    { id: 'prayer', label: 'নামাজ', icon: Clock },
    { id: 'quran', label: 'কুরআন', icon: BookOpen },
    { id: 'khutbah', label: 'খুতবা', icon: Mic2 },
    { id: 'tools', label: 'টুলস', icon: Layers, isAction: true },
  ];

  const toolsList = [
    { id: 'waz', label: 'ওয়াজ মাহফিল', icon: Sparkles, desc: 'জনপ্রিয় ইসলামিক স্কলারদের লেকচার' },
    { id: 'qibla', label: 'কিবলা কম্পাস', icon: Compass, desc: 'সঠিক কিবলার দিক নির্ণয়' },
    { id: 'tasbih', label: 'ডিজিটাল তাসবিহ', icon: Layers, desc: 'সহজে যিকির গণনা ও রিমাইন্ডার' },
    { id: 'duas', label: 'প্রতিদিনের দোয়া', icon: HeartHandshake, desc: 'কুরআন ও সুন্নাহ ভিত্তিক দোয়া' },
    { id: 'ramadan', label: 'রমজান ট্র্যাকার', icon: MoonStar, desc: 'সেহরি ও ইফতারের সময়সূচি' },
  ];

  return (
    <>
      {/* Tools Drawer Sheet */}
      {showToolsDrawer && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          {/* Backdrop */}
          <div 
            onClick={() => setShowToolsDrawer(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Content */}
          <div className="relative bg-[#081A14] border-t border-[#17C98B]/30 rounded-t-3xl p-6 shadow-2xl z-10 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#17C98B]/15">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#17C98B]/15 text-[#17C98B]">
                  <Layers className="w-5 h-5" />
                </span>
                <h3 className="text-base font-bold text-[#F5FFF9]">ইসলামিক টুলস ও বিষয়সমূহ</h3>
              </div>
              <button 
                onClick={() => setShowToolsDrawer(false)}
                className="p-1.5 rounded-full text-[#A7BEB3] hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 py-4">
              {toolsList.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => handleNav(tool.id)}
                    className="flex flex-col items-start p-3.5 rounded-xl bg-[#06130F] border border-[#17C98B]/15 hover:border-[#E7BD68]/40 text-left transition-all group"
                  >
                    <div className="p-2 rounded-lg bg-[#17C98B]/10 text-[#17C98B] group-hover:text-[#E7BD68] group-hover:bg-[#E7BD68]/10 transition-colors mb-2">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-semibold text-[#F5FFF9] group-hover:text-[#17C98B]">
                      {tool.label}
                    </span>
                    <span className="text-[11px] text-[#A7BEB3] line-clamp-1 mt-0.5">
                      {tool.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#081A14]/95 backdrop-blur-lg border-t border-[#17C98B]/20 py-2 px-3">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = !item.isAction && currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.isAction) {
                    setShowToolsDrawer(!showToolsDrawer);
                  } else {
                    handleNav(item.id);
                  }
                }}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'text-[#17C98B]'
                    : 'text-[#A7BEB3] hover:text-[#F5FFF9]'
                }`}
              >
                <div className={`p-1 rounded-lg transition-transform ${isActive ? 'bg-[#17C98B]/15 scale-110' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[11px] font-medium mt-0.5 ${isActive ? 'font-bold text-[#17C98B]' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
