import React from 'react'
import CarouselComponent from './components/Carousel'
import { Container } from '@mantine/core'

const HomePage = () => {
  return (
    <>
      <CarouselComponent />
      <Container size={"xl"}>
        <h1>HomePage</h1>
      </Container>
    </>
  )
}

export default HomePage