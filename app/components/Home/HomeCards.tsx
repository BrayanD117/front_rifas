"use client"

import { Container, Grid } from "@mantine/core";
import CustomCard from "../CustomCard/CustomCard";

const HomeCards: React.FC = () => {
  return (
    <>
      <Container mt={"md"} size={"xl"}>
        <Grid>
          <Grid.Col span={{ base: 12, xs: 6, md: 4, lg: 3 }}>
            <CustomCard
              imageSrc="/assets/raffles/iPhone.webp"
              imageAlt="iPhone 13"
              title="¡Gana un iPhone 13!"
              badgeText="Sept. 30"
              description="¡Gánate un increíble iPhone 13! Elige tu número, agrégalo al carrito y ¡prepárate para ganar! No te quedes sin tu oportunidad."
              buttonText="Ver detalles y participar"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, xs: 6, md: 4, lg: 3 }}>
            <CustomCard
              imageSrc="/assets/raffles/dinero.webp"
              imageAlt="Dinero"
              title="Gana en grande ¡20 millones!"
              badgeText="Dic. 20"
              description="No pierdas la oportunidad de ganar 15 millones. Participa en nuestra rifa, elige tu número y únete a los que sueñan en grande. ¡Haz tu jugada ahora!"
              buttonText="Ver detalles y participar"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, xs: 6, md: 4, lg: 3 }}>
            <CustomCard
              imageSrc="/assets/raffles/nmax.webp"
              imageAlt="Moto NMax"
              title="¡Gana una Moto NMax y acelera tu destino!"
              badgeText="Oct. 15"
              description="Participa en la rifa de una increíble Moto NMax modelo 2024. Elige tu número, agrégalo al carrito y prepárate para recorrer la ciudad con estilo y potencia. ¡No te quedes sin tu oportunidad de ganar!"
              buttonText="Ver detalles y participar"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, xs: 6, md: 4, lg: 3 }}>
            <CustomCard
              imageSrc="/assets/raffles/llaveCarro.webp"
              imageAlt="Llaves de carro"
              title="¡Llévate una Tucson 0 km y conduce tus sueños!"
              badgeText="Nov. 15"
              description="Participa en la rifa de un espectacular carro Tucson. Elige tu número ganador y podrías estar manejando este increíble SUV."
              buttonText="Ver detalles y participar"
            />
          </Grid.Col>
        </Grid>
      </Container>
      
    </>
  )
}

export default HomeCards