import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, 
  Search, BookOpen, User, Flame, Clock, Sparkles, ChevronDown 
} from 'lucide-react';
import { ALL_SURAHS, POPULAR_SURAHS, QURAN_RECITERS, formatSurahNumber } from '../data/quranData';
import { Surah, QuranReciter } from '../types/islamic';
import { toBengaliDigits } from '../services/prayerService';

export const QuranPlayer: React.FC = () => {
  const [selectedSurah, setSelectedSurah] = useState<Surah>(ALL_SURAHS[0]); // Al-Fatihah
  const [selectedReciter, setSelectedReciter] = useState<QuranReciter>(QURAN_RECITERS[0]); // Sheikh Sudais
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'popular' | 'meccan' | 'medinan'>('all');

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Audio URL constructor
  const getAudioUrl = (surahNum: number, reciter: QuranReciter) => {
    const formatted = formatSurahNumber(surahNum);
    return `${reciter.serverUrl}/${formatted}.mp3`;
  };

  const audioSrc = getAudioUrl(selectedSurah.number, selectedReciter);

  // Update audio source when surah or reciter changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = audioSrc;
      audioRef.current.playbackRate = playbackSpeed;
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.warn('Quran audio autoplay interrupted:', err);
          setIsPlaying(false);
        });
      }
    }
  }, [selectedSurah, selectedReciter]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('Playback error:', err);
        setIsPlaying(false);
      });
    }
  };

  const handleNext = () => {
    const nextNum = selectedSurah.number >= 114 ? 1 : selectedSurah.number + 1;
    const next = ALL_SURAHS.find(s => s.number === nextNum);
    if (next) setSelectedSurah(next);
  };

  const handlePrev = () => {
    const prevNum = selectedSurah.number <= 1 ? 114 : selectedSurah.number - 1;
    const prev = ALL_SURAHS.find(s => s.number === prevNum);
    if (prev) setSelectedSurah(prev);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
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

  const formatSeconds = (sec: number) => {
    if (!sec || isNaN(sec)) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Filter Surahs
  const filteredSurahs = ALL_SURAHS.filter(s => {
    const matchesSearch = 
      s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.banglaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.includes(searchQuery) ||
      s.number.toString() === searchQuery.trim();

    if (!matchesSearch) return false;

    if (filterMode === 'popular') return POPULAR_SURAHS.includes(s.number);
    if (filterMode === 'meccan') return s.revelationType === 'Meccan';
    if (filterMode === 'medinan') return s.revelationType === 'Medinan';
    return true;
  });

  return (
    <section id="quran" className="py-12 lg:py-20 relative">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
        onError={() => setIsPlaying(false)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17C98B]/10 border border-[#17C98B]/20 text-[#17C98B] text-xs font-semibold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>পবিত্র কুরআন মজীদ</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#F5FFF9] font-bengali">
              📖 কুরআন তিলাওয়াত
            </h2>
            <p className="mt-1 text-sm text-[#A7BEB3]">
              হারামের সম্মানিত শায়খগণের সুমধুর কণ্ঠে ১১৪টি পূর্ণাঙ্গ সূরার উচ্চমানের অডিও তিলাওয়াত
            </p>
          </div>

          {/* Reciter Selector Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#A7BEB3] hidden sm:inline">কারী:</span>
            <div className="relative">
              <select
                value={selectedReciter.id}
                onChange={(e) => {
                  const r = QURAN_RECITERS.find(rec => rec.id === e.target.value);
                  if (r) setSelectedReciter(r);
                }}
                className="appearance-none px-4 py-2.5 pr-9 rounded-xl bg-[#081A14] border border-[#E7BD68]/30 hover:border-[#E7BD68] text-xs font-bold text-[#E7BD68] focus:outline-none cursor-pointer shadow-sm"
              >
                {QURAN_RECITERS.map((r) => (
                  <option key={r.id} value={r.id} className="bg-[#081A14] text-[#F5FFF9]">
                    {r.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#E7BD68] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Main Quran Player Card */}
        <div className="glass-card-gold rounded-3xl p-5 sm:p-7 md:p-8 mb-8 border border-[#E7BD68]/30 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Islamic Arch Watermark */}
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 opacity-5 pointer-events-none">
            <svg viewBox="0 0 100 100" fill="currentColor" className="text-[#E7BD68]">
              <path d="M50 0 C25 20 20 50 20 100 L80 100 C80 50 75 20 50 0 Z" />
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Surah Info Display */}
            <div className="lg:col-span-5 flex items-center gap-3.5 sm:gap-4">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#17C98B]/20 to-[#E7BD68]/20 border border-[#E7BD68]/30 flex flex-col items-center justify-center shrink-0 shadow-inner">
                <span className="text-lg sm:text-2xl font-black text-[#E7BD68] font-sans">
                  {toBengaliDigits(selectedSurah.number)}
                </span>
                <span className="text-[9px] sm:text-[10px] text-[#A7BEB3]">সূরা</span>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h3 className="text-lg sm:text-2xl font-bold text-[#F5FFF9] font-bengali truncate">
                    সূরা {selectedSurah.banglaName}
                  </h3>
                  <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded bg-[#17C98B]/15 text-[#17C98B] font-semibold border border-[#17C98B]/30">
                    {selectedSurah.revelationType === 'Meccan' ? 'মাক্কী' : 'মাদানী'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-0.5 sm:mt-1 text-xs text-[#A7BEB3]">
                  <span>{selectedSurah.englishName}</span>
                  <span>•</span>
                  <span>{toBengaliDigits(selectedSurah.numberOfAyahs)} আয়াত</span>
                </div>
                <p className="font-arabic text-base sm:text-xl text-[#E7BD68] mt-0.5 sm:mt-1">
                  سُورَةُ {selectedSurah.name}
                </p>
              </div>
            </div>

            {/* Audio Controls */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-4">
              
              {/* Timeline Progress Bar */}
              <div className="space-y-1 sm:space-y-1.5">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full accent-[#17C98B] cursor-pointer bg-gray-700 h-2 rounded-lg"
                />
                <div className="flex items-center justify-between text-[11px] sm:text-xs text-[#A7BEB3] font-mono">
                  <span>{formatSeconds(currentTime)}</span>
                  <span>{formatSeconds(duration)}</span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                
                {/* Playback Speed Chips */}
                <div className="flex items-center gap-1 bg-[#06130F] p-1 rounded-xl border border-[#17C98B]/20 self-center sm:self-auto">
                  {[0.75, 1, 1.25, 1.5].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => changeSpeed(speed)}
                      className={`px-2 py-0.5 sm:py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        playbackSpeed === speed
                          ? 'bg-[#17C98B] text-[#06130F] font-bold'
                          : 'text-[#A7BEB3] hover:text-[#F5FFF9]'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>

                {/* Primary Play/Pause Controls */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <button
                    onClick={handlePrev}
                    title="পূর্ববর্তী সূরা"
                    className="p-2.5 sm:p-3 rounded-xl bg-[#06130F] border border-[#17C98B]/20 text-[#A7BEB3] hover:text-[#F5FFF9] hover:border-[#17C98B] transition-all cursor-pointer"
                  >
                    <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  <button
                    onClick={togglePlay}
                    className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#17C98B] to-[#0E9F70] text-[#06130F] font-bold shadow-lg shadow-[#17C98B]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 sm:w-6 sm:h-6 fill-current" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current translate-x-0.5" />}
                  </button>

                  <button
                    onClick={handleNext}
                    title="পরবর্তী সূরা"
                    className="p-2.5 sm:p-3 rounded-xl bg-[#06130F] border border-[#17C98B]/20 text-[#A7BEB3] hover:text-[#F5FFF9] hover:border-[#17C98B] transition-all cursor-pointer"
                  >
                    <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Volume Controller */}
                <div className="flex items-center gap-2 self-center sm:self-auto">
                  <button
                    onClick={toggleMute}
                    className="text-[#A7BEB3] hover:text-[#17C98B] transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 sm:w-20 accent-[#17C98B] cursor-pointer bg-gray-700 h-1.5 rounded-lg"
                  />
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Surah List & Quick Filter Tabs */}
        <div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
            
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-[#17C98B] text-[#06130F] shadow-sm'
                    : 'bg-[#081A14] text-[#A7BEB3] hover:text-[#F5FFF9] border border-[#17C98B]/15'
                }`}
              >
                সব সূরা (১১৪)
              </button>

              <button
                onClick={() => setFilterMode('popular')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  filterMode === 'popular'
                    ? 'bg-[#E7BD68] text-[#06130F] font-bold shadow-sm'
                    : 'bg-[#081A14] text-[#E7BD68] hover:bg-[#E7BD68]/10 border border-[#E7BD68]/30'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>জনপ্রিয় সূরাসমূহ</span>
              </button>

              <button
                onClick={() => setFilterMode('meccan')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  filterMode === 'meccan'
                    ? 'bg-[#17C98B] text-[#06130F]'
                    : 'bg-[#081A14] text-[#A7BEB3] hover:text-[#F5FFF9] border border-[#17C98B]/15'
                }`}
              >
                মাক্কী সূরা
              </button>

              <button
                onClick={() => setFilterMode('medinan')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  filterMode === 'medinan'
                    ? 'bg-[#17C98B] text-[#06130F]'
                    : 'bg-[#081A14] text-[#A7BEB3] hover:text-[#F5FFF9] border border-[#17C98B]/15'
                }`}
              >
                মাদানী সূরা
              </button>
            </div>

            {/* Instant Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-[#A7BEB3] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="নাম বা নম্বর দিয়ে সূরা খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#081A14] border border-[#17C98B]/20 focus:border-[#17C98B] text-xs text-[#F5FFF9] placeholder-[#A7BEB3]/60 focus:outline-none transition-colors"
              />
            </div>

          </div>

          {/* Surah Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 max-h-[520px] overflow-y-auto pr-1">
            {filteredSurahs.map((surah) => {
              const isSelected = selectedSurah.number === surah.number;
              return (
                <div
                  key={surah.number}
                  onClick={() => {
                    setSelectedSurah(surah);
                    setIsPlaying(true);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#17C98B]/20 to-[#081A14] border-[#17C98B] shadow-md shadow-[#17C98B]/15'
                      : 'glass-card border-[#17C98B]/15 hover:border-[#E7BD68]/40 hover:-translate-y-0.5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isSelected
                        ? 'bg-[#17C98B] text-[#06130F]'
                        : 'bg-[#17C98B]/10 text-[#17C98B] group-hover:bg-[#E7BD68]/15 group-hover:text-[#E7BD68]'
                    } transition-colors`}>
                      {toBengaliDigits(surah.number)}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-[#F5FFF9] font-bengali block">
                        সূরা {surah.banglaName}
                      </span>
                      <span className="text-[11px] text-[#A7BEB3]">
                        {surah.englishName} • {toBengaliDigits(surah.numberOfAyahs)} আয়াত
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-arabic text-base text-[#E7BD68] block">
                      {surah.name}
                    </span>
                    <span className="text-[10px] text-[#A7BEB3]">
                      {surah.revelationType === 'Meccan' ? 'মাক্কী' : 'মাদানী'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
