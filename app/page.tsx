"use client";

import React, { useContext, useEffect }  from 'react'
import CarouselComponent from './components/Carousel'
import { Container } from '@mantine/core'
import HomeCards from './components/Home/HomeCards'
import { TelemetryContext } from './context/TelemetryProvider';

const HomePage = () => {
  const { trackEvent, location } = useContext(TelemetryContext);

  useEffect(() => {
    if (location) {
      trackEvent('42ae8659-620f-4030-9562-a38383b55128');
    }
  }, [location]);

  return (
    <>
      <CarouselComponent />
      <Container size={"xl"}>
        <HomeCards />
      </Container>
    </>
  );
};

export default HomePage;