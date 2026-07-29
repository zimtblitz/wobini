import { useEffect, useState } from "react";

export interface GeoPosition {
  latitude: number;
  longitude: number;
}

export function useCurrentPosition() {
  const [position, setPosition] =
    useState<GeoPosition | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error(
        "Geolocation wird nicht unterstützt"
      );
      return;
    }

    const watchId =
      navigator.geolocation.watchPosition(
        (location) => {
          setPosition({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        },
        (error) => {
          console.error(
            "GPS Fehler:",
            error
          );
        },
        {
          enableHighAccuracy: true,
          maximumAge: 1000,
          timeout: 10000,
        }
      );

    return () => {
      navigator.geolocation.clearWatch(
        watchId
      );
    };
  }, []);

  return position;
}
