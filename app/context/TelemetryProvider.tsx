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
  const [hasTrackedEvent, setHasTrackedEvent] = useState<boolean>(false);

  const trackEvent = async (eventType: string, raffleId?: string, userLocation?: string) => {
    if (hasTrackedEvent) return;

    if (!user?.id && !raffleId && (!userLocation || userLocation === 'Permission denied' || userLocation === 'Geolocation not supported')) {
      console.log('No valid user, raffleId, or location, skipping telemetry');
      return;
    }

    setHasTrackedEvent(true);

    try {
      const apiURL = process.env.NEXT_PUBLIC_API_URL || '';
      await axios.post(`${apiURL}/telemetries`, {
        userId: user?.id || null,
        eventTypeId: eventType,
        raffleId: raffleId || null,
        ubication: userLocation || location || null,
      });
      console.log('Telemetry event successfully tracked');
    } catch (error) {
      console.error('Error tracking telemetry event', error);
      setHasTrackedEvent(false);
    }
  };

  useEffect(() => {
    const requestLocation = () => {
      if (navigator.geolocation && !hasTrackedEvent) {
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
      } else if (!navigator.geolocation) {
        setLocation('Geolocation not supported');
      }
    };

    if (!hasTrackedEvent) {
      requestLocation();
    }
  }, [hasTrackedEvent]);

  return (
    <TelemetryContext.Provider value={{ location, trackEvent }}>
      {children}
    </TelemetryContext.Provider>
  );
};
