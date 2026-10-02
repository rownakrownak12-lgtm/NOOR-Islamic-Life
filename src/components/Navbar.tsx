import React from 'react';
import { Volume2, VolumeX, Moon, Sun, Settings as SettingsIcon, Search, Compass, Shield } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenSettings: () => void;
  onOpenSearch: () => void;
  onOpenAdhanModal: () => void;
  isAdhanEnabled: boolean;
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenSettings,
  onOpenSearch,
  onOpenAdhanModal,
  isAdhanEnabled,
  theme,
  setTheme,
  onOpenAdmin,
}) => {
  const navItems = [
    { id: 'home', label: 'Home', bangla: 'হোম' },
    { id: 'prayer', label: 'Prayer Times', bangla: 'নামাজের সময়' },
    { id: 'quran', label: 'Quran', bangla: 'কুরআন' },
    { id: 'khutbah', label: 'Khutbah', bangla: 'জুমার খুতবা' },
    { id: 'waz', label: 'Waz', bangla: 'ওয়াজ' },
    { id: 'qibla', label: 'Qibla', bangla: 'কিবলা' },
    { id: 'tasbih', label: 'Tasbih', bangla: 'তাসবিহ' },
    { id: 'duas', label: 'Duas', bangla: 'দোয়া' },
  ];

  const scrollToSection = (id: string) => {
    setCurrentTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#17C98B]/20 bg-[#06130F]/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Logo */}
          <div 
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            {/* Islamic Crescent & Star Emblem */}
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-[#17C98B] to-[#08281F] p-[1.5px] shadow-lg shadow-[#17C98B]/10 group-hover:shadow-[#17C98B]/25 transition-all">
              <div className="w-full h-full bg-[#06130F] rounded-[10px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-radial from-[#17C98B]/20 to-transparent"></div>
                {/* Crescent Moon SVG */}
                <svg className="w-6 h-6 text-[#E7BD68]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c2.25 0 4.33-.74 6-2-5-1-8.5-5.5-8.5-10.5 0-3.3 1.5-6.2 3.8-8-1.07-.33-2.2-.5-3.3-.5z" />
                  <polygon points="19.5,4 20.5,7 23.5,7 21,9 22,12 19.5,10 17,12 18,9 15.5,7 18.5,7" fill="#17C98B" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-wider text-[#F5FFF9] group-hover:text-[#17C98B] transition-colors">
                  NOOR
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#17C98B]/15 text-[#17C98B] font-semibold border border-[#17C98B]/30">
                  নূর
                </span>
              </div>
              <span className="text-xs text-[#A7BEB3] font-medium tracking-tight">
                Islamic Life • by ASM Rownak
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer relative ${
                    isActive
                      ? 'text-[#17C98B] bg-[#17C98B]/10 font-semibold'
                      : 'text-[#A7BEB3] hover:text-[#F5FFF9] hover:bg-[#17C98B]/5'
                  }`}
                >
                  {item.bangla}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-transparent via-[#17C98B] to-transparent"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search Button */}
            <button
              onClick={onOpenSearch}
              title="কুরআন, সুরা, ওয়াজ ও দোয়া খুঁজুন"
              className="p-2.5 rounded-lg text-[#A7BEB3] hover:text-[#17C98B] hover:bg-[#17C98B]/10 transition-colors cursor-pointer border border-transparent hover:border-[#17C98B]/20"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Adhan Sound Quick Toggle */}
            <button
              onClick={onOpenAdhanModal}
              title={isAdhanEnabled ? 'আজান সক্রিয় (ক্লিক করে সেটিংস পরিবর্তন করুন)' : 'আজান চালু করুন'}
              className={`p-2.5 rounded-lg transition-colors cursor-pointer border ${
                isAdhanEnabled
                  ? 'text-[#17C98B] bg-[#17C98B]/15 border-[#17C98B]/40 shadow-sm shadow-[#17C98B]/20 animate-pulse'
                  : 'text-[#A7BEB3] hover:text-[#E7BD68] hover:bg-[#E7BD68]/10 border-transparent'
              }`}
              aria-label="Adhan audio toggle"
            >
              {isAdhanEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {/* Theme Toggle (Dark / Light) */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title={theme === 'dark' ? 'লাইট মোড করুন' : 'ডার্ক মোড করুন'}
              className="p-2.5 rounded-lg text-[#A7BEB3] hover:text-[#E7BD68] hover:bg-[#E7BD68]/10 transition-colors cursor-pointer border border-transparent hover:border-[#E7BD68]/20"
              aria-label="Theme toggle"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Settings Modal Button */}
            <button
              onClick={onOpenSettings}
              title="অ্যাপ সেটিংস"
              className="p-2.5 rounded-lg text-[#A7BEB3] hover:text-[#17C98B] hover:bg-[#17C98B]/10 transition-colors cursor-pointer border border-transparent hover:border-[#17C98B]/20"
              aria-label="Settings"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
