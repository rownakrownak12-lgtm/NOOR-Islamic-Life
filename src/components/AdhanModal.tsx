import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Square, Bell, Check, X, ShieldAlert, Sparkles, Sliders } from 'lucide-react';
import { AdhanSettings } from '../types/islamic';
import { adhanManager, ADHAN_SOURCES, saveAdhanSettings } from '../services/audioService';

interface AdhanModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AdhanSettings;
  onUpdateSettings: (newSettings: AdhanSettings) => void;
}

export const AdhanModal: React.FC<AdhanModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const [isPlayingTest, setIsPlayingTest] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState({ current: 0, total: 0 });
  const [localSettings, setLocalSettings] = useState<AdhanSettings>(settings);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  useEffect(() => {
    adhanManager.setListener((info) => {
      setIsPlayingTest(info.isPlaying);
      setPlaybackProgress({ current: info.currentTime, total: info.duration });
    });
    return () => {
      adhanManager.setListener(() => {});
    };
  }, []);

  if (!isOpen) return null;

  const formatAudioTime = (sec: number) => {
    if (!sec || isNaN(sec)) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleToggleAdhan = () => {
    const updated = {
      ...localSettings,
      enabled: !localSettings.enabled,
      autoPlayAllowed: true,
    };
    setLocalSettings(updated);
    onUpdateSettings(updated);
    saveAdhanSettings(updated);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    const updated = { ...localSettings, volume: vol };
    setLocalSettings(updated);
    onUpdateSettings(updated);
    saveAdhanSettings(updated);
  };

  const handleReciterChange = (reciterKey: 'makkah' | 'madinah' | 'quds' | 'egypt') => {
    const updated = { ...localSettings, reciter: reciterKey };
    setLocalSettings(updated);
    onUpdateSettings(updated);
    saveAdhanSettings(updated);

    if (isPlayingTest) {
      adhanManager.playAdhan(reciterKey, localSettings.volume);
    }
  };

  const handleTogglePrayerAlert = (prayerKey: keyof typeof localSettings.prayerAlerts) => {
    const updated = {
      ...localSettings,
      prayerAlerts: {
        ...localSettings.prayerAlerts,
        [prayerKey]: !localSettings.prayerAlerts[prayerKey],
      },
    };
    setLocalSettings(updated);
    onUpdateSettings(updated);
    saveAdhanSettings(updated);
  };

  const handleTestAudio = async () => {
    if (isPlayingTest) {
      adhanManager.stop();
      setIsPlayingTest(false);
    } else {
      setIsPlayingTest(true);
      const ok = await adhanManager.playAdhan(localSettings.reciter, localSettings.volume);
      if (!ok) {
        setIsPlayingTest(false);
      }
    }
  };

  const requestBrowserNotification = async () => {
    if (typeof Notification !== 'undefined') {
      try {
        const perm = await Notification.requestPermission();
        setNotificationPermission(perm);
        if (perm === 'granted') {
          new Notification('NOOR — Islamic Life', {
            body: 'নামাজের আজান ও রিমাইন্ডার নোটিফিকেশন সফলভাবে চালু হয়েছে।',
            icon: '/favicon.ico',
          });
        }
      } catch (err) {
        console.error('Notification permission error:', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#081A14] border border-[#17C98B]/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
      >
        {/* Close Button */}
        <button
          onClick={() => {
            if (isPlayingTest) adhanManager.stop();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full text-[#A7BEB3] hover:text-[#F5FFF9] hover:bg-[#17C98B]/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-[#17C98B]/15 text-[#17C98B] border border-[#17C98B]/20">
            <Volume2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#F5FFF9] font-bengali">
              আজান ও অডিও সেটিংস
            </h3>
            <p className="text-xs text-[#A7BEB3]">
              ওয়াক্ত অনুযায়ী আজান ও রিমাইন্ডার নিয়ন্ত্রণ করুন
            </p>
          </div>
        </div>

        {/* Main Enable / Disable Adhan Toggle */}
        <div className="p-4 rounded-2xl bg-[#06130F] border border-[#17C98B]/20 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${localSettings.enabled ? 'bg-[#17C98B]/20 text-[#17C98B]' : 'bg-gray-800 text-gray-400'}`}>
              {localSettings.enabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-sm font-bold text-[#F5FFF9]">
                {localSettings.enabled ? 'আজান সক্রিয় আছে' : 'আজান বন্ধ আছে'}
              </span>
              <p className="text-xs text-[#A7BEB3]">
                {localSettings.enabled ? 'নামাজের সময় স্বয়ংক্রিয়ভাবে ধ্বনিত হবে' : 'আজানের অডিও চালু করতে ক্লিক করুন'}
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleAdhan}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              localSettings.enabled
                ? 'bg-[#17C98B] text-[#06130F] shadow-md shadow-[#17C98B]/25 hover:bg-[#14b67d]'
                : 'bg-[#17C98B]/15 text-[#17C98B] border border-[#17C98B]/30 hover:bg-[#17C98B]/25'
            }`}
          >
            {localSettings.enabled ? 'সক্রিয়' : 'চালু করুন'}
          </button>
        </div>

        {/* Reciter Selector */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-[#E7BD68] uppercase tracking-wider mb-2.5">
            মুয়াজ্জিন / আজানের স্থান নির্বাচন
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {Object.entries(ADHAN_SOURCES).map(([key, item]) => {
              const isSelected = localSettings.reciter === key;
              return (
                <button
                  key={key}
                  onClick={() => handleReciterChange(key as any)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#17C98B]/15 border-[#17C98B] text-[#F5FFF9] shadow-sm'
                      : 'bg-[#06130F] border-[#17C98B]/15 text-[#A7BEB3] hover:border-[#17C98B]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-bengali text-[#F5FFF9]">
                      {item.bangla}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#17C98B]" />}
                  </div>
                  <span className="text-[10px] text-[#A7BEB3] block mt-0.5">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Volume Slider & Test Button */}
        <div className="p-4 rounded-2xl bg-[#06130F] border border-[#17C98B]/20 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#F5FFF9] flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#17C98B]" />
              আজানের ভলিউম ({Math.round(localSettings.volume * 100)}%)
            </span>

            {/* Test Sound Button */}
            <button
              onClick={handleTestAudio}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isPlayingTest
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                  : 'bg-[#E7BD68]/15 text-[#E7BD68] border border-[#E7BD68]/30 hover:bg-[#E7BD68]/25'
              }`}
            >
              {isPlayingTest ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlayingTest ? 'আজান থামান' : 'টেস্ট আজান শুনুন'}</span>
            </button>
          </div>

          {/* Test Adhan Live Progress */}
          {isPlayingTest && (
            <div className="p-3 rounded-xl bg-[#081A14] border border-[#17C98B]/30 space-y-1.5 animate-in fade-in">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#17C98B] font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#17C98B] animate-ping"></span>
                  পূর্ণাঙ্গ আজান প্লে হচ্ছে
                </span>
                <span className="text-[#E7BD68] font-mono">
                  {formatAudioTime(playbackProgress.current)} / {formatAudioTime(playbackProgress.total) !== '00:00' ? formatAudioTime(playbackProgress.total) : (ADHAN_SOURCES[localSettings.reciter]?.durationStr || '03:43')}
                </span>
              </div>
              <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#17C98B] to-[#E7BD68] h-full rounded-full transition-all duration-300"
                  style={{ width: `${playbackProgress.total > 0 ? (playbackProgress.current / playbackProgress.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          )}

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={localSettings.volume}
            onChange={handleVolumeChange}
            className="w-full accent-[#17C98B] cursor-pointer bg-gray-700 h-1.5 rounded-lg"
          />
        </div>

        {/* Prayers with active alert */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-[#A7BEB3] uppercase tracking-wider mb-2.5">
            যেসব ওয়াক্তে আজান বাজবে:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'fajr', label: 'ফজর' },
              { key: 'dhuhr', label: 'যোহর' },
              { key: 'asr', label: 'আসর' },
              { key: 'maghrib', label: 'মাগরিব' },
              { key: 'isha', label: 'ইশা' },
              { key: 'jummah', label: 'জুমা' },
            ].map((p) => {
              const isChecked = localSettings.prayerAlerts[p.key as keyof typeof localSettings.prayerAlerts];
              return (
                <button
                  key={p.key}
                  onClick={() => handleTogglePrayerAlert(p.key as any)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-[#17C98B]/15 border-[#17C98B]/40 text-[#17C98B]'
                      : 'bg-[#06130F] border-gray-800 text-gray-500'
                  }`}
                >
                  <span className="text-xs font-bold">{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Browser Notice / Limitation Disclaimer */}
        <div className="p-3.5 rounded-xl bg-[#06130F] border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-200/80">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            ব্রাউজারের নিরাপত্তা নীতি অনুযায়ী ট্যাব খোলা থাকাকালীন সময়ে ওয়াক্তে আজান স্বয়ংক্রিয়ভাবে ধ্বনিত হবে। ব্রাউজার সম্পূর্ণ বন্ধ থাকলে সাউন্ড প্লে হবে না।
          </p>
        </div>

        {/* Browser Notifications Permission */}
        {notificationPermission !== 'granted' && (
          <div className="mt-4 pt-4 border-t border-[#17C98B]/15 flex items-center justify-between">
            <span className="text-xs text-[#A7BEB3]">
              ডেস্কটপ নোটিফিকেশন পেতে চান?
            </span>
            <button
              onClick={requestBrowserNotification}
              className="text-xs px-3 py-1.5 rounded-lg bg-[#17C98B]/20 text-[#17C98B] hover:bg-[#17C98B]/30 font-semibold"
            >
              অনুমতি দিন
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
