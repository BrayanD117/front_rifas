import React from 'react'
import CarouselComponent from './components/Carousel'
import { Container } from '@mantine/core'
import HomeCards from './components/Home/HomeCards'

const HomePage = () => {
  return (
    <>
      <CarouselComponent />
      <Container size={"xl"}>
        <HomeCards />
      </Container>
    </>
  )
}

export default HomePage