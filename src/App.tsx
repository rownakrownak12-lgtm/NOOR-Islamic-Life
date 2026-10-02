import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { Hero } from './components/Hero';
import { HijriCalendar } from './components/HijriCalendar';
import { DailyReminder } from './components/DailyReminder';
import { PrayerTimes } from './components/PrayerTimes';
import { AdhanModal } from './components/AdhanModal';
import { QuranPlayer } from './components/QuranPlayer';
import { JummahKhutbah } from './components/JummahKhutbah';
import { WazSection } from './components/WazSection';
import { ImamsSection } from './components/ImamsSection';
import { QiblaCompass } from './components/QiblaCompass';
import { TasbihCounter } from './components/TasbihCounter';
import { DailyDua } from './components/DailyDua';
import { RamadanTracker } from './components/RamadanTracker';
import { GlobalSearch } from './components/GlobalSearch';
import { SettingsModal } from './components/SettingsModal';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel/AdminPanel';

import { 
  Speaker, Imam, Khutbah, Dua, Reminder, AppSettings, 
  PrayerSettings, AdhanSettings 
} from './types/islamic';
import { 
  fetchSpeakers, fetchImams, fetchKhutbahs, 
  fetchDuas, fetchReminders, fetchSettings 
} from './services/api';
import { 
  fetchPrayerTimes, calculateNextPrayer, 
  PrayerDayData, NextPrayerInfo, toBengaliDigits 
} from './services/prayerService';
import { 
  loadAdhanSettings, saveAdhanSettings, 
  defaultAdhanSettings, adhanManager 
} from './services/audioService';
import { 
  initialSpeakers, initialImams, initialKhutbahs, 
  initialDuas, initialReminders, initialSettings 
} from './data/initialData';

const SETTINGS_STORAGE_KEY = 'noor_prayer_settings';
const THEME_STORAGE_KEY = 'noor_theme';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === 'light' ? 'light' : 'dark';
  });

  // Prayer & Location Settings
  const [prayerSettings, setPrayerSettings] = useState<PrayerSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      city: 'Dhaka',
      country: 'Bangladesh',
      method: 1, // Karachi (standard for Bangladesh/South Asia)
      madhab: 'hanafi',
      timeFormat: '12h',
      language: 'bn',
    };
  });

  // Adhan Settings
  const [adhanSettings, setAdhanSettings] = useState<AdhanSettings>(loadAdhanSettings);

  // Dynamic Content Data
  const [speakers, setSpeakers] = useState<Speaker[]>(initialSpeakers);
  const [imams, setImams] = useState<Imam[]>(initialImams);
  const [khutbahs, setKhutbahs] = useState<Khutbah[]>(initialKhutbahs);
  const [duas, setDuas] = useState<Dua[]>(initialDuas);
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
  const [appSettings, setAppSettings] = useState<AppSettings>(initialSettings);

  // Prayer Timings Data
  const [prayerData, setPrayerData] = useState<PrayerDayData | null>(null);
  const [nextPrayer, setNextPrayer] = useState<NextPrayerInfo | null>(null);
  const [prayerLoading, setPrayerLoading] = useState(true);
  const [prayerError, setPrayerError] = useState<string | null>(null);
  const [dayOffset, setDayOffset] = useState(0);

  // Navigation & Active Section
  const [currentTab, setCurrentTab] = useState('home');

  // Modals
  const [isAdhanOpen, setIsAdhanOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(() => {
    // Check if user navigated to /admin or #/admin
    return typeof window !== 'undefined' && 
      (window.location.pathname === '/admin' || window.location.hash === '#/admin' || window.location.search.includes('admin=true'));
  });

  // Handle Theme class on body
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  // Load all database dynamic content
  const loadAllDynamicContent = useCallback(async () => {
    try {
      const [s, i, k, d, r, set] = await Promise.allSettled([
        fetchSpeakers(),
        fetchImams(),
        fetchKhutbahs(),
        fetchDuas(),
        fetchReminders(),
        fetchSettings(),
      ]);

      if (s.status === 'fulfilled') setSpeakers(s.value);
      if (i.status === 'fulfilled') setImams(i.value);
      if (k.status === 'fulfilled') setKhutbahs(k.value);
      if (d.status === 'fulfilled') setDuas(d.value);
      if (r.status === 'fulfilled') setReminders(r.value);
      if (set.status === 'fulfilled') setAppSettings(set.value);
    } catch (e) {
      console.warn('Error fetching dynamic content:', e);
    }
  }, []);

  useEffect(() => {
    loadAllDynamicContent();
  }, [loadAllDynamicContent]);

  // Load Prayer Times from AlAdhan API
  const loadPrayerData = useCallback(async () => {
    setPrayerLoading(true);
    setPrayerError(null);
    try {
      const targetDate = new Date();
      if (dayOffset !== 0) {
        targetDate.setDate(targetDate.getDate() + dayOffset);
      }
      const data = await fetchPrayerTimes(prayerSettings, targetDate);
      setPrayerData(data);

      if (data && data.timings) {
        const next = calculateNextPrayer(data.timings, prayerSettings.timeFormat === '12h');
        setNextPrayer(next);
      }
    } catch (err: any) {
      setPrayerError(err.message || 'Failed to load prayer times');
    } finally {
      setPrayerLoading(false);
    }
  }, [prayerSettings, dayOffset]);

  useEffect(() => {
    loadPrayerData();
  }, [loadPrayerData]);

  // Timer loop for real-time Next Prayer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      if (prayerData && prayerData.timings) {
        const next = calculateNextPrayer(prayerData.timings, prayerSettings.timeFormat === '12h');
        setNextPrayer(next);

        // Check if Adhan should play (if exact prayer minute strikes)
        if (adhanSettings.enabled && next.countdownMinutes <= 0.05 && next.countdownMinutes >= 0) {
          const prayerKey = next.nextPrayer.toLowerCase();
          const shouldAlert = adhanSettings.prayerAlerts[prayerKey as keyof typeof adhanSettings.prayerAlerts];
          if (shouldAlert && !adhanManager.getIsPlaying()) {
            adhanManager.playAdhan(adhanSettings.reciter, adhanSettings.volume);
          }
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [prayerData, prayerSettings.timeFormat, adhanSettings]);

  // Save prayer settings updates
  const handleSavePrayerSettings = (newSettings: PrayerSettings) => {
    setPrayerSettings(newSettings);
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
  };

  // Save adhan settings updates
  const handleSaveAdhanSettings = (newSettings: AdhanSettings) => {
    setAdhanSettings(newSettings);
    saveAdhanSettings(newSettings);
  };

  // Navigate to sections
  const handleNavigateTo = (sectionId: string) => {
    setCurrentTab(sectionId);
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateDay = (offsetChange: number) => {
    setDayOffset(prev => prev + offsetChange);
  };

  // Formatted Hijri String for Hero
  const hijri = prayerData?.date?.hijri;
  const hijriDateStr = hijri 
    ? `${toBengaliDigits(hijri.day)} ${hijri.month.en} ${toBengaliDigits(hijri.year)} হিজরি`
    : '১৫ রবিউল আউয়াল ১৪৪৮ হিজরি';

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'islamic-bg-pattern' : 'islamic-bg-light'} text-[#F5FFF9] transition-colors duration-300 font-sans selection:bg-[#17C98B] selection:text-[#06130F]`}>
      
      {/* Desktop Main Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAdhanModal={() => setIsAdhanOpen(true)}
        isAdhanEnabled={adhanSettings.enabled}
        theme={theme}
        setTheme={setTheme}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <main>
        {/* Hero Section */}
        <Hero
          onScrollToPrayer={() => handleNavigateTo('prayer')}
          onOpenAdhanModal={() => setIsAdhanOpen(true)}
          hijriDateStr={hijriDateStr}
        />

        {/* Hijri Calendar Section */}
        <HijriCalendar
          currentDayData={prayerData}
          onNavigateDay={handleNavigateDay}
          dayOffset={dayOffset}
        />

        {/* Daily Islamic Reminder Card */}
        <DailyReminder reminders={reminders} />

        {/* Prayer Times Section */}
        <PrayerTimes
          prayerData={prayerData}
          nextPrayer={nextPrayer}
          loading={prayerLoading}
          error={prayerError}
          onRetry={loadPrayerData}
          settings={prayerSettings}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAdhanModal={() => setIsAdhanOpen(true)}
        />

        {/* Quran Player Section */}
        <QuranPlayer />

        {/* Jummah Khutbah Section */}
        <JummahKhutbah
          khutbahs={khutbahs}
          loading={false}
          error={null}
          onRetry={loadAllDynamicContent}
        />

        {/* Bangladeshi Waz Section */}
        <WazSection
          speakers={speakers}
          loading={false}
          onRefresh={loadAllDynamicContent}
        />

        {/* Makkah / Masjid al-Haram Section */}
        <ImamsSection
          imams={imams}
          loading={false}
          onSelectKhutbah={() => handleNavigateTo('khutbah')}
        />

        {/* Qibla Direction Compass Section */}
        <QiblaCompass />

        {/* Digital Tasbih Section */}
        <TasbihCounter />

        {/* Daily Authentic Dua Section */}
        <DailyDua
          duas={duas}
          loading={false}
        />

        {/* Ramadan Tracker Section */}
        <RamadanTracker
          prayerData={prayerData}
          is12h={prayerSettings.timeFormat === '12h'}
        />
      </main>

      {/* Footer */}
      <Footer
        onNavigateTo={handleNavigateTo}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Mobile Fixed Bottom Navigation */}
      <MobileNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Global Search Modal */}
      <GlobalSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        speakers={speakers}
        khutbahs={khutbahs}
        duas={duas}
        onNavigateTo={handleNavigateTo}
      />

      {/* Adhan & Audio Settings Modal */}
      <AdhanModal
        isOpen={isAdhanOpen}
        onClose={() => setIsAdhanOpen(false)}
        settings={adhanSettings}
        onUpdateSettings={handleSaveAdhanSettings}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        prayerSettings={prayerSettings}
        onSavePrayerSettings={handleSavePrayerSettings}
        adhanSettings={adhanSettings}
        onSaveAdhanSettings={handleSaveAdhanSettings}
        theme={theme}
        setTheme={setTheme}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Separate Admin Panel (URL /admin or button) */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        speakers={speakers}
        imams={imams}
        khutbahs={khutbahs}
        duas={duas}
        reminders={reminders}
        settings={appSettings}
        onRefreshAllData={loadAllDynamicContent}
      />

    </div>
  );
}
