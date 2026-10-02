import React, { useState, useEffect } from 'react';
import { Compass, MapPin, Navigation, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { 
  QiblaCoordinate, DEFAULT_DHAKA_COORDS, 
  calculateQiblaDirection, calculateDistanceToKaaba 
} from '../services/qiblaService';
import { toBengaliDigits } from '../services/prayerService';

export const QiblaCompass: React.FC = () => {
  const [coords, setCoords] = useState<QiblaCoordinate>(DEFAULT_DHAKA_COORDS);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [hasCompassHardware, setHasCompassHardware] = useState(false);

  const qiblaBearing = calculateQiblaDirection(coords);
  const distanceKm = calculateDistanceToKaaba(coords);

  // Attempt device orientation for real magnetic compass on mobile
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      // webkitCompassHeading for iOS Safari, alpha for Android
      const heading = (e as any).webkitCompassHeading || (e.alpha !== null ? 360 - e.alpha : null);
      if (heading !== null && heading !== undefined) {
        setDeviceHeading(Math.round(heading));
        setHasCompassHardware(true);
      }
    };

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, []);

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('আপনার ব্রাউজারে Geolocation সমর্থিত নয়।');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          cityName: 'বর্তমান অবস্থান (জিপিএস)',
        });
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err);
        setLocationError('লোকেশন পাওয়া যায়নি। ঢাকা শহরের স্থানাঙ্ক ব্যবহৃত হচ্ছে।');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Compass needle rotation: if device orientation is active, rotate relative to device heading
  const needleRotation = deviceHeading !== null 
    ? (qiblaBearing - deviceHeading + 360) % 360 
    : qiblaBearing;

  return (
    <section id="qibla" className="py-12 lg:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17C98B]/10 border border-[#17C98B]/20 text-[#17C98B] text-xs font-semibold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>সঠিক কেবলা নির্ণয়</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#F5FFF9] font-bengali">
            🧭 Qibla Direction
          </h2>
          <p className="mt-2 text-sm text-[#A7BEB3]">
            পবিত্র কাবা শরিফের সুনির্দিষ্ট দিক ও ভৌগোলিক দূরত্ব নির্ণয়
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <div className="glass-card-gold rounded-3xl p-4 sm:p-8 md:p-10 border border-[#E7BD68]/30 shadow-2xl relative">
            
            {/* Location Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-3.5 rounded-2xl bg-[#06130F]/90 border border-[#17C98B]/20 mb-6 sm:mb-8">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#E7BD68] shrink-0" />
                <div>
                  <span className="text-xs font-bold text-[#F5FFF9] block">
                    {coords.cityName || 'Dhaka, Bangladesh'}
                  </span>
                  <span className="text-[11px] text-[#A7BEB3] block">
                    {coords.latitude.toFixed(2)}° N, {coords.longitude.toFixed(2)}° E
                  </span>
                </div>
              </div>

              <button
                onClick={handleUseLocation}
                disabled={isLocating}
                className="w-full sm:w-auto justify-center px-3.5 py-2 rounded-xl bg-[#17C98B]/15 hover:bg-[#17C98B] text-[#17C98B] hover:text-[#06130F] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'খোঁজা হচ্ছে...' : 'আমার লোকেশন'}</span>
              </button>
            </div>

            {locationError && (
              <div className="mb-6 p-3 rounded-xl bg-amber-950/40 border border-amber-500/20 text-xs text-amber-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{locationError}</span>
              </div>
            )}

            {/* Circular Compass Dial UI */}
            <div className="relative w-52 h-52 sm:w-72 sm:h-72 md:w-80 md:h-80 mx-auto my-3 sm:my-4 flex items-center justify-center">
              
              {/* Outer Glow Ring */}
              <div className="absolute inset-0 rounded-full bg-radial from-[#17C98B]/10 via-transparent to-transparent"></div>

              {/* Compass Outer Rim */}
              <div className="w-full h-full rounded-full border-4 border-[#08291E] shadow-2xl relative flex items-center justify-center bg-[#06130F]/90">
                
                {/* 12 Hour / Degree tick marks */}
                <div className="absolute inset-2 rounded-full border border-[#17C98B]/20 flex items-center justify-center pointer-events-none">
                  {/* Cardinal Directions */}
                  <span className="absolute top-1.5 sm:top-2 text-[10px] sm:text-xs font-bold text-[#E7BD68]">N (০°)</span>
                  <span className="absolute right-2 sm:right-3 text-[10px] sm:text-xs font-bold text-[#A7BEB3]">E (৯০°)</span>
                  <span className="absolute bottom-1.5 sm:bottom-2 text-[10px] sm:text-xs font-bold text-[#A7BEB3]">S (১৮০°)</span>
                  <span className="absolute left-1.5 sm:left-2 text-[10px] sm:text-xs font-bold text-[#A7BEB3]">W (২৭০°)</span>
                </div>

                {/* Rotating Needle pointing towards Kaaba */}
                <div 
                  className="w-full h-full absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-out"
                  style={{ transform: `rotate(${needleRotation}deg)` }}
                >
                  {/* Needle Pointer */}
                  <div className="w-1.5 h-38 sm:h-52 md:h-60 relative flex flex-col justify-between items-center pointer-events-none">
                    
                    {/* Top Kaaba Pointer (Green & Gold) */}
                    <div className="flex flex-col items-center">
                      <div className="p-1 sm:p-1.5 rounded-full bg-[#E7BD68] shadow-lg shadow-[#E7BD68]/50 animate-bounce">
                        {/* Kaaba Icon */}
                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[#06130F] rounded-sm flex items-center justify-center border border-[#E7BD68]">
                          <span className="text-[9px] sm:text-[10px]">🕋</span>
                        </div>
                      </div>
                      <div className="w-0.5 h-10 sm:h-14 md:h-16 bg-gradient-to-t from-[#17C98B] to-[#E7BD68]" />
                    </div>

                    {/* Bottom Tail Pointer */}
                    <div className="w-0.5 h-10 sm:h-14 md:h-16 bg-gradient-to-b from-[#17C98B]/40 to-transparent" />
                  </div>
                </div>

                {/* Center Hub */}
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#08281F] to-[#06130F] border-2 border-[#17C98B] flex flex-col items-center justify-center shadow-lg z-10">
                  <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-[#17C98B]" />
                </div>

              </div>

            </div>

            {/* Qibla Angle & Kaaba Distance Stats */}
            <div className="grid grid-cols-2 gap-3 mt-8 pt-6 border-t border-[#17C98B]/20 text-center">
              <div className="p-3.5 rounded-2xl bg-[#06130F]/80 border border-[#17C98B]/15">
                <span className="text-[11px] text-[#A7BEB3] uppercase font-bold block mb-1">
                  কিবলার কোণ
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#E7BD68] font-sans">
                  {toBengaliDigits(qiblaBearing)}°
                </span>
                <span className="text-[10px] text-[#17C98B] block mt-0.5">
                  উত্তর থেকে ঘড়ির কাঁটার দিকে
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#06130F]/80 border border-[#17C98B]/15">
                <span className="text-[11px] text-[#A7BEB3] uppercase font-bold block mb-1">
                  কাবা শরিফের দূরত্ব
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#F5FFF9] font-sans">
                  ~{toBengaliDigits(distanceKm.toLocaleString())}
                </span>
                <span className="text-[10px] text-[#A7BEB3] block mt-0.5">
                  কিলোমিটার (মক্কা আল-মুকাররমা)
                </span>
              </div>
            </div>

            {/* Device Hardware Note */}
            <p className="text-[11px] text-center text-[#A7BEB3]/80 mt-4 leading-relaxed font-bengali">
              {hasCompassHardware 
                ? 'মোবাইলের ম্যাগনেটোমিটার সেন্সর দ্বারা রিয়েল-টাইম অভিমুখ প্রদর্শিত হচ্ছে।'
                : 'ভৌগোলিক স্থানাঙ্ক ভিত্তিক গাণিতিক দিকনির্দেশনা প্রদর্শিত হচ্ছে।'}
            </p>

          </div>
        </div>

      </div>
    </section>
  );
};
