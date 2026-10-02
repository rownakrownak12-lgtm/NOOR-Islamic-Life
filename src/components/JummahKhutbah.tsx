import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic2, Play, Pause, Calendar, BookOpen, 
  Volume2, VolumeX, Sparkles, X, ChevronRight, AlertCircle 
} from 'lucide-react';
import { Khutbah } from '../types/islamic';

interface JummahKhutbahProps {
  khutbahs: Khutbah[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export const JummahKhutbah: React.FC<JummahKhutbahProps> = ({
  khutbahs,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'All' | 'Arabic' | 'English' | 'Urdu' | 'Bengali'>('All');
  const [activeKhutbah, setActiveKhutbah] = useState<Khutbah | null>(khutbahs[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [viewingKhutbahModal, setViewingKhutbahModal] = useState<Khutbah | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Set default khutbah
  useEffect(() => {
    if (!activeKhutbah && khutbahs.length > 0) {
      setActiveKhutbah(khutbahs[0]);
    }
  }, [khutbahs, activeKhutbah]);

  const current = activeKhutbah || khutbahs[0];

  // Update audio source safely without recreating audio element
  useEffect(() => {
    if (!current?.audioUrl || !audioRef.current) return;
    setAudioError(null);
    if (audioRef.current.src !== current.audioUrl) {
      audioRef.current.src = current.audioUrl;
    }
    audioRef.current.playbackRate = playbackSpeed;
    audioRef.current.volume = isMuted ? 0 : volume;

    if (isPlaying) {
      audioRef.current.play().catch(err => {
        console.warn('Playback paused by browser:', err);
        setIsPlaying(false);
      });
    }
  }, [current?.id, current?.audioUrl]);

  const handlePlayToggle = (khutbah: Khutbah) => {
    setAudioError(null);
    if (!audioRef.current) return;

    if (current?.id === khutbah.id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        if (!audioRef.current.src || audioRef.current.src !== khutbah.audioUrl) {
          audioRef.current.src = khutbah.audioUrl || '';
        }
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.warn('Playback error:', err);
          setIsPlaying(false);
          setAudioError('অডিও প্লে করতে সাময়িক সমস্যা হচ্ছে। দয়া করে আবার ক্লিক করুন।');
        });
      }
    } else {
      setActiveKhutbah(khutbah);
      audioRef.current.src = khutbah.audioUrl || '';
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Switch playback error:', err);
        setIsPlaying(false);
      });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const formatSec = (sec: number) => {
    if (!sec || isNaN(sec)) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const filteredKhutbahs = selectedLanguage === 'All' 
    ? khutbahs 
    : khutbahs.filter(k => k.language === selectedLanguage);

  return (
    <section id="khutbah" className="py-12 lg:py-20 relative">
      <audio
        ref={audioRef}
        crossOrigin="anonymous"
        preload="metadata"
        onLoadedMetadata={() => {
          if (audioRef.current && audioRef.current.duration) {
            setDuration(audioRef.current.duration);
          }
        }}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
              setDuration(audioRef.current.duration);
            }
          }
        }}
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setIsPlaying(false);
          setAudioError('অডিও প্লে করতে সমস্যা হচ্ছে। ইন্টারনেট সংযোগ পরীক্ষা করুন।');
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17C98B]/10 border border-[#17C98B]/20 text-[#17C98B] text-xs font-semibold uppercase tracking-wider mb-2">
              <Mic2 className="w-3.5 h-3.5" />
              <span>জুমার বয়ান ও খুতবা</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#F5FFF9] font-bengali">
              🕌 জুমার খুতবা
            </h2>
            <p className="mt-1 text-sm text-[#A7BEB3]">
              হারামাইন শরিফাইনের পূর্ণাঙ্গ জুমার খুতবা ও হেদায়েতি বয়ান সরাসরি শুনুন
            </p>
          </div>

          {/* Language Selector Buttons */}
          <div className="flex items-center gap-1.5 bg-[#081A14] p-1 rounded-2xl border border-[#17C98B]/20 overflow-x-auto pb-1 sm:pb-1">
            {[
              { id: 'All', label: 'সবগুলো' },
              { id: 'Arabic', label: 'العربية' },
              { id: 'English', label: 'English' },
              { id: 'Bengali', label: 'বাংলা' },
              { id: 'Urdu', label: 'اردو' },
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedLanguage === lang.id
                    ? 'bg-[#17C98B] text-[#06130F] font-bold shadow-sm'
                    : 'text-[#A7BEB3] hover:text-[#F5FFF9]'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Audio Error Banner */}
        {audioError && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
              <p className="text-xs sm:text-sm text-amber-200">
                {audioError}
              </p>
            </div>
            <button
              onClick={() => handlePlayToggle(current)}
              className="px-3 py-1.5 rounded-lg bg-amber-700/40 hover:bg-amber-700/60 text-xs font-semibold text-amber-100 transition-colors shrink-0"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        )}

        {/* Featured Main Khutbah Card & Player */}
        {current && (
          <div className="glass-card-gold rounded-3xl p-6 sm:p-8 mb-8 border border-[#E7BD68]/30 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Khutbah Info */}
              <div className="lg:col-span-7">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E7BD68]/20 text-[#E7BD68] font-bold uppercase border border-[#E7BD68]/30">
                    নির্বাচিত জুমার খুতবা
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#17C98B]/15 text-[#17C98B] font-semibold border border-[#17C98B]/25">
                    {current.language}
                  </span>
                  {isPlaying && (
                    <span className="flex items-center gap-1.5 text-[11px] text-[#17C98B] font-bold">
                      <span className="w-2 h-2 rounded-full bg-[#17C98B] animate-ping"></span>
                      অডিও চলছে
                    </span>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[#F5FFF9] font-bengali leading-snug">
                  {current.title}
                </h3>

                {current.arabicTitle && (
                  <p className="font-arabic text-lg sm:text-xl text-[#E7BD68] mt-1.5 leading-relaxed">
                    {current.arabicTitle}
                  </p>
                )}

                {current.summary && (
                  <p className="text-xs sm:text-sm text-[#A7BEB3] font-bengali mt-3 leading-relaxed">
                    {current.summary}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-[#A7BEB3]">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#17C98B]" />
                    {current.date}
                  </span>
                  {current.hijriDate && (
                    <span>• {current.hijriDate}</span>
                  )}
                  <span>• খতিব: {current.speaker}</span>
                </div>

                {/* Read Full Khutbah Button */}
                <div className="mt-5">
                  <button
                    onClick={() => setViewingKhutbahModal(current)}
                    className="px-4 py-2 rounded-xl bg-[#06130F] border border-[#E7BD68]/30 text-xs text-[#E7BD68] hover:text-[#F3D99E] hover:border-[#E7BD68] font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>খুতবার বিস্তারিত ও নসিহত পড়ুন</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Column: In-App Audio Player */}
              <div className="lg:col-span-5 flex flex-col justify-center space-y-4 bg-[#06130F]/90 p-5 sm:p-6 rounded-2xl border border-[#17C98B]/20 shadow-inner">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#17C98B]">অডিও প্লেয়ার</span>
                    {isPlaying && (
                      <div className="flex items-center gap-0.5 h-3">
                        <span className="w-1 bg-[#17C98B] animate-[bounce_0.6s_infinite] h-full rounded-full"></span>
                        <span className="w-1 bg-[#E7BD68] animate-[bounce_0.8s_infinite] h-2/3 rounded-full"></span>
                        <span className="w-1 bg-[#17C98B] animate-[bounce_0.5s_infinite] h-full rounded-full"></span>
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] text-[#E7BD68] font-mono">
                    পূর্ণাঙ্গ অডিও ({current.duration})
                  </span>
                </div>

                {/* Seek Timeline */}
                <div className="space-y-1">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full accent-[#17C98B] cursor-pointer bg-gray-700 h-1.5 rounded-lg"
                  />
                  <div className="flex items-center justify-between text-[11px] text-[#A7BEB3] font-mono">
                    <span>{formatSec(currentTime)}</span>
                    <span>{formatSec(duration) !== '00:00' ? formatSec(duration) : current.duration}</span>
                  </div>
                </div>

                {/* Big Play/Pause Button */}
                <button
                  onClick={() => handlePlayToggle(current)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#17C98B] to-[#0E9F70] text-[#06130F] font-bold text-sm shadow-lg shadow-[#17C98B]/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isPlaying && current?.id === activeKhutbah?.id ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>খুতবা থামান</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>খুতবা শুনুন</span>
                    </>
                  )}
                </button>

                {/* Sub Controls: Speed & Volume */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  {/* Speed */}
                  <div className="flex items-center gap-1">
                    {[1, 1.25].map(s => (
                      <button
                        key={s}
                        onClick={() => changeSpeed(s)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                          playbackSpeed === s ? 'bg-[#17C98B] text-[#06130F]' : 'bg-[#081A14] text-[#A7BEB3]'
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>

                  {/* Volume */}
                  <div className="flex items-center gap-2">
                    <button onClick={toggleMute} className="text-[#A7BEB3] hover:text-[#17C98B]">
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 accent-[#17C98B] cursor-pointer bg-gray-700 h-1 rounded-lg"
                    />
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* Khutbahs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredKhutbahs.map((khutbah) => {
            const isSelected = activeKhutbah?.id === khutbah.id;
            const isItemPlaying = isSelected && isPlaying;

            return (
              <div
                key={khutbah.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'glass-card border-[#E7BD68] shadow-lg shadow-[#E7BD68]/15 bg-[#082017]'
                    : 'glass-card border-[#17C98B]/15 hover:border-[#17C98B]/40 hover:-translate-y-0.5'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-[#17C98B]/15 text-[#17C98B] font-semibold">
                      {khutbah.language}
                    </span>
                    <span className="text-xs text-[#A7BEB3] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#E7BD68]" />
                      {khutbah.date}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-[#F5FFF9] font-bengali line-clamp-2 mt-1">
                    {khutbah.title}
                  </h4>

                  {khutbah.arabicTitle && (
                    <p className="font-arabic text-sm text-[#E7BD68] line-clamp-1 mt-1">
                      {khutbah.arabicTitle}
                    </p>
                  )}

                  {khutbah.summary && (
                    <p className="text-xs text-[#A7BEB3] line-clamp-2 mt-2 font-bengali">
                      {khutbah.summary}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-3 text-xs">
                    <span className="text-[#17C98B] font-medium">
                      {khutbah.speaker}
                    </span>
                    <span className="text-[#E7BD68] font-mono text-[11px]">
                      {khutbah.duration}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#17C98B]/15 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handlePlayToggle(khutbah)}
                    className={`text-xs px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isItemPlaying
                        ? 'bg-[#E7BD68] text-[#06130F] shadow-sm'
                        : 'bg-[#17C98B]/15 text-[#17C98B] hover:bg-[#17C98B] hover:text-[#06130F]'
                    }`}
                  >
                    {isItemPlaying ? (
                      <Pause className="w-3.5 h-3.5 fill-current" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current" />
                    )}
                    <span>{isItemPlaying ? 'থামান' : 'প্লে করুন'}</span>
                  </button>

                  <button
                    onClick={() => setViewingKhutbahModal(khutbah)}
                    className="px-3 py-2 rounded-xl bg-[#06130F] hover:bg-[#17C98B]/20 text-[#A7BEB3] hover:text-[#17C98B] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>পড়ুন</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Full Khutbah In-App Reader Modal (NO EXTERNAL REDIRECTS) */}
      {viewingKhutbahModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-[#081A14] border border-[#17C98B]/30 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[88vh] overflow-y-auto"
          >
            <button
              onClick={() => setViewingKhutbahModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#A7BEB3] hover:text-[#F5FFF9] hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#17C98B]/15 text-[#17C98B] font-bold uppercase">
                {viewingKhutbahModal.language}
              </span>
              <span className="text-xs text-[#A7BEB3]">
                {viewingKhutbahModal.date}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-[#F5FFF9] font-bengali leading-snug">
              {viewingKhutbahModal.title}
            </h3>

            {viewingKhutbahModal.arabicTitle && (
              <p className="font-arabic text-xl text-[#E7BD68] mt-2 leading-relaxed">
                {viewingKhutbahModal.arabicTitle}
              </p>
            )}

            <p className="text-xs text-[#17C98B] font-semibold mt-2">
              খতিব: {viewingKhutbahModal.speaker}
            </p>

            {/* In-Modal Direct Player */}
            <div className="my-6 p-4 rounded-2xl bg-[#06130F] border border-[#17C98B]/20 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#F5FFF9] block">খুতবা অডিও</span>
                <span className="text-[11px] text-[#A7BEB3]">দৈর্ঘ্য: {viewingKhutbahModal.duration}</span>
              </div>
              <button
                onClick={() => handlePlayToggle(viewingKhutbahModal)}
                className="px-4 py-2 rounded-xl bg-[#17C98B] text-[#06130F] font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                {isPlaying && activeKhutbah?.id === viewingKhutbahModal.id ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>থামান</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>প্লে করুন</span>
                  </>
                )}
              </button>
            </div>

            {/* Summary */}
            {viewingKhutbahModal.summary && (
              <div className="mb-6 p-4 rounded-2xl bg-[#06130F]/60 border border-[#E7BD68]/20">
                <span className="text-xs font-bold text-[#E7BD68] uppercase block mb-1">
                  খুতবার মূল বিষয়বস্তু
                </span>
                <p className="text-xs sm:text-sm text-[#F5FFF9] font-bengali leading-relaxed">
                  {viewingKhutbahModal.summary}
                </p>
              </div>
            )}

            {/* Full text / speech excerpt */}
            {viewingKhutbahModal.fullText && (
              <div className="mb-6 space-y-2">
                <span className="text-xs font-bold text-[#A7BEB3] uppercase block">
                  খুতবার নির্বাচিত অংশ / নসিহত
                </span>
                <div className="p-5 rounded-2xl bg-[#06130F] border border-[#17C98B]/15 text-xs sm:text-sm text-[#F5FFF9] leading-loose font-bengali font-arabic">
                  {viewingKhutbahModal.fullText}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-[#17C98B]/15 flex items-center justify-between text-xs text-[#A7BEB3]">
              <span>পবিত্র হারামাইন শরিফাইনের খুতবা কালেকশন</span>
              <button
                onClick={() => setViewingKhutbahModal(null)}
                className="px-3 py-1 rounded-lg bg-[#17C98B]/20 text-[#17C98B] font-bold"
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
