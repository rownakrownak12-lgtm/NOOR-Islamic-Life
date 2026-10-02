import { AdhanSettings } from '../types/islamic';

const ADHAN_SETTINGS_KEY = 'noor_adhan_settings';

// Verified, high-quality, full-length (2.5 to 4.5 minutes) streaming Adhans with CORS headers
export const ADHAN_SOURCES: Record<string, { name: string; bangla: string; url: string; fallbackUrl: string; durationStr: string }> = {
  makkah: {
    name: 'Masjid al-Haram, Makkah (Sheikh Ali Mullah / Sheikh Nayf)',
    bangla: 'মসজিদুল হারাম, মক্কা (শায়খ আলী মোল্লা)',
    url: 'https://archive.org/download/3913MakkahIshaAdhanSheikhNayf/3-9-13%20Makkah%20Isha%20Adhan%20Sheikh%20Nayf.mp3',
    fallbackUrl: 'https://archive.org/download/MakkahAsrAdhan26813SheikhHadrawi/Makkah%20Asr%20Adhan%2026-8-13%20Sheikh%20Hadrawi.mp3',
    durationStr: '03:43',
  },
  madinah: {
    name: 'Masjid an-Nabawi, Madinah (Sheikh Surayhi)',
    bangla: 'মসজিদে নববী, মদিনা মুনাওয়ারা',
    url: 'https://archive.org/download/MadinahAsrAdhan2913SheikhSurayhi/Madinah%20Asr%20Adhan%202-9-13%20Sheikh%20Surayhi.mp3',
    fallbackUrl: 'https://archive.org/download/3913MakkahIshaAdhanSheikhNayf/3-9-13%20Makkah%20Isha%20Adhan%20Sheikh%20Nayf.mp3',
    durationStr: '03:30',
  },
  quds: {
    name: 'Sheikh Mishary Rashid Alafasy',
    bangla: 'শায়খ মিশারি রশিদ আল-আফাসি',
    url: 'https://archive.org/download/Athan-AlafasyByDarifton/Athan-Alafasy1431.mp3',
    fallbackUrl: 'https://archive.org/download/3913MakkahIshaAdhanSheikhNayf/3-9-13%20Makkah%20Isha%20Adhan%20Sheikh%20Nayf.mp3',
    durationStr: '02:43',
  },
  egypt: {
    name: 'Masjid al-Haram, Makkah (Sheikh Hadrawi)',
    bangla: 'মসজিদুল হারাম (সুললিত সুমধুর কণ্ঠ)',
    url: 'https://archive.org/download/MakkahAsrAdhan26813SheikhHadrawi/Makkah%20Asr%20Adhan%2026-8-13%20Sheikh%20Hadrawi.mp3',
    fallbackUrl: 'https://archive.org/download/Athan-AlafasyByDarifton/Athan-Alafasy1431.mp3',
    durationStr: '04:15',
  },
};

export const defaultAdhanSettings: AdhanSettings = {
  enabled: false,
  volume: 0.8,
  reciter: 'makkah',
  autoPlayAllowed: false,
  prayerAlerts: {
    fajr: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
    jummah: true,
  },
};

export function loadAdhanSettings(): AdhanSettings {
  try {
    const saved = localStorage.getItem(ADHAN_SETTINGS_KEY);
    return saved ? { ...defaultAdhanSettings, ...JSON.parse(saved) } : defaultAdhanSettings;
  } catch {
    return defaultAdhanSettings;
  }
}

export function saveAdhanSettings(settings: AdhanSettings): void {
  try {
    localStorage.setItem(ADHAN_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save adhan settings', e);
  }
}

export interface AdhanPlaybackInfo {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  reciterKey: string;
}

// Global Audio Singleton for Adhan
class AdhanAudioManager {
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private currentReciter = 'makkah';
  private onStateChange: ((info: AdhanPlaybackInfo) => void) | null = null;

  public setListener(cb: (info: AdhanPlaybackInfo) => void) {
    this.onStateChange = cb;
  }

  private notify() {
    if (this.onStateChange) {
      this.onStateChange({
        isPlaying: this.isPlaying,
        currentTime: this.audio?.currentTime || 0,
        duration: this.audio?.duration || 0,
        reciterKey: this.currentReciter,
      });
    }
  }

  public async playAdhan(reciterKey: string, volume: number): Promise<boolean> {
    try {
      this.stop();
      this.currentReciter = reciterKey;
      const source = ADHAN_SOURCES[reciterKey] || ADHAN_SOURCES.makkah;
      this.audio = new Audio(source.url);
      this.audio.crossOrigin = 'anonymous';
      this.audio.volume = Math.max(0, Math.min(1, volume));

      this.audio.onplay = () => {
        this.isPlaying = true;
        this.notify();
      };

      this.audio.ontimeupdate = () => {
        this.notify();
      };

      this.audio.onended = () => {
        this.isPlaying = false;
        this.notify();
      };

      this.audio.onerror = (e) => {
        console.warn('Primary adhan audio failed, switching to backup stream...', e);
        if (source.fallbackUrl && this.audio) {
          this.audio.src = source.fallbackUrl;
          this.audio.play().catch(() => {
            this.isPlaying = false;
            this.notify();
          });
        } else {
          this.isPlaying = false;
          this.notify();
        }
      };

      await this.audio.play();
      this.isPlaying = true;
      this.notify();
      return true;
    } catch (err) {
      console.warn('Audio playback error (user interaction may be required):', err);
      this.isPlaying = false;
      this.notify();
      return false;
    }
  }

  public stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
    this.isPlaying = false;
    this.notify();
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentInfo(): AdhanPlaybackInfo {
    return {
      isPlaying: this.isPlaying,
      currentTime: this.audio?.currentTime || 0,
      duration: this.audio?.duration || 0,
      reciterKey: this.currentReciter,
    };
  }
}

export const adhanManager = new AdhanAudioManager();

