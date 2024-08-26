'use client';

import '@mantine/carousel/styles.css';
import { Image } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import classes from './styles/Carousel.module.css';

const images = [
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-1.png',
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-2.png',
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png',
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png',
    'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-5.png',
  ];

const CarouselComponent = () => {
const slides = images.map((url) => (
    <Carousel.Slide key={url}>
        <Image src={url} />
    </Carousel.Slide>
    ));
  return (
    <Carousel withIndicators height={250} loop classNames={classes}>
        {slides}
    </Carousel>
  )
}

export default CarouselComponent