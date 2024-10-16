"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface TelemetryContextProps {
  location: string | null;
  trackEvent: (eventType: string, raffleId?: string) => void;
}

export const TelemetryContext = React.createContext<TelemetryContextProps>({
  location: null,
  trackEvent: () => {},
});

export const TelemetryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<string | null>(null);

  useEffect(() => {
    const requestLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation(`${latitude}, ${longitude}`);
            trackEvent('location_access', undefined, `${latitude}, ${longitude}`);
          },
          () => {
            setLocation('Permission denied');
          }
        );
      } else {
        setLocation('Geolocation not supported');
      }
    };

    requestLocation();
  }, []);

  const trackEvent = async (eventType: string, raffleId?: string, userLocation?: string) => {
    try {
      const apiURL = process.env.NEXT_PUBLIC_API_URL || '';
      await axios.post(`${apiURL}/telemetries`, {
        eventTypeId: eventType,
        raffleId,
        ubication: userLocation || location,
      });
    } catch (error) {
      console.error('Error tracking telemetry event', error);
    }
  };

  return (
    <TelemetryContext.Provider value={{ location, trackEvent }}>
      {children}
    </TelemetryContext.Provider>
  );
};
