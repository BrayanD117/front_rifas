"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

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
  const { user }: { user: any } = useAuth();

  const trackEvent = async (eventType: string, raffleId?: string, userLocation?: string) => {
    if (!user?.id && !raffleId && !userLocation && !location) {
      console.log('No userId, raffleId, or location, skipping telemetry');
      return;
    }

    try {
      const apiURL = process.env.NEXT_PUBLIC_API_URL || '';
      await axios.post(`${apiURL}/telemetries`, {
        userId: user?.id,
        eventTypeId: eventType,
        raffleId,
        ubication: userLocation || location,
      });
      console.log('Telemetry event successfully tracked');
    } catch (error) {
      console.error('Error tracking telemetry event', error);
    }
  };

  useEffect(() => {
    const requestLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const userLocation = `${latitude}, ${longitude}`;
            setLocation(userLocation);
            console.log('Location permission granted, tracking location');
            trackEvent('00cb1456-3bb1-47b0-b176-0ace180f20c5', undefined, userLocation);
          },
          () => {
            setLocation('Permission denied');
            console.log('Location permission denied');
          }
        );
      } else {
        setLocation('Geolocation not supported');
      }
    };

    requestLocation();
  }, []);

  return (
    <TelemetryContext.Provider value={{ location, trackEvent }}>
      {children}
    </TelemetryContext.Provider>
  );
};
