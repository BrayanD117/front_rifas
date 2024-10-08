'use client';

import '@mantine/carousel/styles.css';
import { Image } from '@mantine/core';
import Autoplay from 'embla-carousel-autoplay';
import { Carousel } from '@mantine/carousel';
import classes from './styles/Carousel.module.css';
import { useRef, useState, useEffect } from 'react';

const desktopImages = [
    '/assets/raffles/principal_banner_350.webp',
    '/assets/raffles/principal_banner_350.webp',
    '/assets/raffles/principal_banner_350.webp',
    '/assets/raffles/principal_banner_350.webp',
    '/assets/raffles/principal_banner_350.webp',
];

const mobileImages = [
  '/assets/raffles/principal_banner_mobile.webp',
  '/assets/raffles/principal_banner_mobile.webp',
  '/assets/raffles/principal_banner_mobile.webp',
  '/assets/raffles/principal_banner_mobile.webp',
  '/assets/raffles/principal_banner_mobile.webp'
];

const CarouselComponent = () => {
  const autoplay = useRef(Autoplay({ delay: 4000 }));
  const [images, setImages] = useState<string[]>([]);
  const [carouselKey, setCarouselKey] = useState<number>(0);

  useEffect(() => {
    const updateImages = () => {
      if (window.innerWidth <= 768) {
        setImages(mobileImages);
      } else {
        setImages(desktopImages);
      }
      setCarouselKey(prevKey => prevKey + 1);
    };

    updateImages();

    window.addEventListener('resize', updateImages);

    return () => {
      window.removeEventListener('resize', updateImages);
    };
  }, []);

  const slides = images.map((url) => (
    <Carousel.Slide key={url}>
        <Image src={url} alt="Carousel image"/>
    </Carousel.Slide>
  ));

  return (
    <Carousel key={carouselKey} withIndicators height={350} loop classNames={classes} plugins={[autoplay.current]}>
        {slides}
    </Carousel>
  );
};

export default CarouselComponent;