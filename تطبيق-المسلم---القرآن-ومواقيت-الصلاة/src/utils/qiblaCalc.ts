// Mecca Kaaba coordinates
export const MECCA_LAT = 21.4225;
export const MECCA_LNG = 39.8262;

export function calculateQiblaBearing(lat: number, lng: number): number {
  const phi1 = (lat * Math.PI) / 180;
  const phi2 = (MECCA_LAT * Math.PI) / 180;
  const deltaLambda = ((MECCA_LNG - lng) * Math.PI) / 180;

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

  let bearing = (Math.atan2(y, x) * 180) / Math.PI;
  bearing = (bearing + 360) % 360; // Normalize to 0-360
  return Math.round(bearing);
}

export function getDistanceToMeccaKm(lat: number, lng: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((MECCA_LAT - lat) * Math.PI) / 180;
  const dLng = ((MECCA_LNG - lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat * Math.PI) / 180) *
      Math.cos((MECCA_LAT * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}
