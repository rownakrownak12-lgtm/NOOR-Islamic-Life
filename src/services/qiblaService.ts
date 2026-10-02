export interface QiblaCoordinate {
  latitude: number;
  longitude: number;
  cityName?: string;
}

// Kaaba Coordinates in Makkah al-Mukarramah
export const KAABA_COORDS = {
  latitude: 21.422487,
  longitude: 39.826206,
};

// Default location: Dhaka, Bangladesh
export const DEFAULT_DHAKA_COORDS: QiblaCoordinate = {
  latitude: 23.8103,
  longitude: 90.4125,
  cityName: 'Dhaka, Bangladesh',
};

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Calculates the forward azimuth / bearing from user location to the Holy Kaaba
 */
export function calculateQiblaDirection(userCoords: QiblaCoordinate): number {
  const phi1 = toRadians(userCoords.latitude);
  const phi2 = toRadians(KAABA_COORDS.latitude);
  const deltaLambda = toRadians(KAABA_COORDS.longitude - userCoords.longitude);

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

  let qiblaBearing = toDegrees(Math.atan2(y, x));
  qiblaBearing = (qiblaBearing + 360) % 360;

  return Math.round(qiblaBearing * 10) / 10;
}

/**
 * Calculates approximate great-circle distance to Kaaba in kilometers
 */
export function calculateDistanceToKaaba(userCoords: QiblaCoordinate): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = toRadians(KAABA_COORDS.latitude - userCoords.latitude);
  const dLon = toRadians(KAABA_COORDS.longitude - userCoords.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(userCoords.latitude)) *
      Math.cos(toRadians(KAABA_COORDS.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}
