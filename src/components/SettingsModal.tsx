import React, { useState } from 'react';
import { Settings, X, MapPin, Calculator, Clock, Globe, Shield, Volume2, Moon, Sun, Check } from 'lucide-react';
import { PrayerSettings, AdhanSettings } from '../types/islamic';
import { CALCULATION_METHODS } from '../services/prayerService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  prayerSettings: PrayerSettings;
  onSavePrayerSettings: (newSettings: PrayerSettings) => void;
  adhanSettings: AdhanSettings;
  onSaveAdhanSettings: (newSettings: AdhanSettings) => void;
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  onOpenAdmin: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  prayerSettings,
  onSavePrayerSettings,
  adhanSettings,
  onSaveAdhanSettings,
  theme,
  setTheme,
  onOpenAdmin,
}) => {
  const [city, setCity] = useState(prayerSettings.city);
  const [country, setCountry] = useState(prayerSettings.country);
  const [method, setMethod] = useState(prayerSettings.method);
  const [madhab, setMadhab] = useState<'shafi' | 'hanafi'>(prayerSettings.madhab);
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>(prayerSettings.timeFormat);
  const [language, setLanguage] = useState<'bn' | 'en' | 'ar'>(prayerSettings.language || 'bn');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    const updated: PrayerSettings = {
      city: city.trim() || 'Dhaka',
      country: country.trim() || 'Bangladesh',
      method,
      madhab,
      timeFormat,
      language,
    };
    onSavePrayerSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#081A14] border border-[#17C98B]/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#A7BEB3] hover:text-[#F5FFF9] hover:bg-[#17C98B]/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-[#17C98B]/15 text-[#17C98B] border border-[#17C98B]/20">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#F5FFF9] font-bengali">
              অ্যাপ্লিকেশন সেটিংস
            </h3>
            <p className="text-xs text-[#A7BEB3]">
              নামাজের সময়, স্থান ও ভাষা পছন্দ নির্ধারণ করুন
            </p>
          </div>
        </div>

        <div className="space-y-5">
          
          {/* Location Settings */}
          <div className="p-4 rounded-2xl bg-[#06130F] border border-[#17C98B]/20 space-y-3">
            <label className="text-xs font-bold text-[#E7BD68] uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              স্থান ও অবস্থান (Location)
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-[#A7BEB3] block mb-1">শহর (City)</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Dhaka, Chittagong, Sylhet"
                  className="w-full px-3 py-2 rounded-xl bg-[#081A14] border border-[#17C98B]/20 text-xs text-[#F5FFF9] focus:outline-none focus:border-[#17C98B]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#A7BEB3] block mb-1">দেশ (Country)</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Bangladesh"
                  className="w-full px-3 py-2 rounded-xl bg-[#081A14] border border-[#17C98B]/20 text-xs text-[#F5FFF9] focus:outline-none focus:border-[#17C98B]"
                />
              </div>
            </div>
          </div>

          {/* Calculation Method */}
          <div className="p-4 rounded-2xl bg-[#06130F] border border-[#17C98B]/20 space-y-2">
            <label className="text-xs font-bold text-[#17C98B] uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5" />
              নামাজ গণনার মেথড (Calculation Method)
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl bg-[#081A14] border border-[#17C98B]/20 text-xs text-[#F5FFF9] focus:outline-none focus:border-[#17C98B]"
            >
              {CALCULATION_METHODS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.bangla}
                </option>
              ))}
            </select>
          </div>

          {/* Madhab (Hanafi vs Shafi) & Time Format */}
          <div className="grid grid-cols-2 gap-3">
            {/* Madhab */}
            <div className="p-3.5 rounded-2xl bg-[#06130F] border border-[#17C98B]/20">
              <label className="text-[11px] font-bold text-[#A7BEB3] block mb-2">মাযহাব (আসর ওয়াক্ত)</label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setMadhab('hanafi')}
                  className={`py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    madhab === 'hanafi'
                      ? 'bg-[#17C98B] text-[#06130F]'
                      : 'bg-[#081A14] text-[#A7BEB3]'
                  }`}
                >
                  হানাফী
                </button>
                <button
                  type="button"
                  onClick={() => setMadhab('shafi')}
                  className={`py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    madhab === 'shafi'
                      ? 'bg-[#17C98B] text-[#06130F]'
                      : 'bg-[#081A14] text-[#A7BEB3]'
                  }`}
                >
                  শাফেয়ী
                </button>
              </div>
            </div>

            {/* Time Format */}
            <div className="p-3.5 rounded-2xl bg-[#06130F] border border-[#17C98B]/20">
              <label className="text-[11px] font-bold text-[#A7BEB3] block mb-2">সময়ের ফরম্যাট</label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setTimeFormat('12h')}
                  className={`py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    timeFormat === '12h'
                      ? 'bg-[#17C98B] text-[#06130F]'
                      : 'bg-[#081A14] text-[#A7BEB3]'
                  }`}
                >
                  ১২ ঘণ্টা
                </button>
                <button
                  type="button"
                  onClick={() => setTimeFormat('24h')}
                  className={`py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    timeFormat === '24h'
                      ? 'bg-[#17C98B] text-[#06130F]'
                      : 'bg-[#081A14] text-[#A7BEB3]'
                  }`}
                >
                  ২৪ ঘণ্টা
                </button>
              </div>
            </div>
          </div>

          {/* Theme & Language */}
          <div className="grid grid-cols-2 gap-3">
            {/* Theme */}
            <div className="p-3.5 rounded-2xl bg-[#06130F] border border-[#17C98B]/20">
              <label className="text-[11px] font-bold text-[#A7BEB3] block mb-2">থিম (Theme)</label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-[#17C98B] text-[#06130F]'
                      : 'bg-[#081A14] text-[#A7BEB3]'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  ডার্ক
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer ${
                    theme === 'light'
                      ? 'bg-[#17C98B] text-[#06130F]'
                      : 'bg-[#081A14] text-[#A7BEB3]'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  লাইট
                </button>
              </div>
            </div>

            {/* Language */}
            <div className="p-3.5 rounded-2xl bg-[#06130F] border border-[#17C98B]/20">
              <label className="text-[11px] font-bold text-[#A7BEB3] block mb-2">ভাষা (Language)</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#081A14] border border-[#17C98B]/20 text-xs text-[#F5FFF9] focus:outline-none"
              >
                <option value="bn">বাংলা (Bengali)</option>
                <option value="en">English</option>
                <option value="ar">العربية (Arabic)</option>
              </select>
            </div>
          </div>

          {/* Developer Credit */}
          <div className="p-3 rounded-2xl bg-[#06130F] border border-[#17C98B]/15 flex items-center justify-between text-xs">
            <span className="text-[#A7BEB3]">ডেভেলপার (Developer)</span>
            <span className="font-bold text-[#17C98B] flex items-center gap-1">
              <span>ASM Rownak</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#17C98B]/20 text-[#17C98B]">Engineer</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#17C98B]/20 flex items-center justify-between gap-3">
            <button
              onClick={() => {
                onClose();
                onOpenAdmin();
              }}
              className="text-xs text-[#A7BEB3] hover:text-[#E7BD68] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>এডমিন প্যানেল</span>
            </button>

            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#17C98B] to-[#0E9F70] text-[#06130F] font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>সংরক্ষিত হয়েছে!</span>
                </>
              ) : (
                <span>সেটিংস সংরক্ষণ করুন</span>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
