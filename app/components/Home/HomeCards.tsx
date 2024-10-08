"use client"

import { Container, Grid } from "@mantine/core";
import CustomCard from "../CustomCard/CustomCard";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

interface Raffle {
  id: number;
  imagesUrls: string[];
  name: string;
  gameDate: string;
  description: string;
}

const HomeCards: React.FC = () => {
  const [raffles, setRaffles] = useState<Raffle[]>([]);

  useEffect(() => {
    const fetchRaffles = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/raffles/active`);
        console.log(response.data);
        setRaffles(response.data);
      } catch (error) {
        console.error("Error fetching raffles:", error);
      }
    };

    fetchRaffles();
  }, []);

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('DD MMM.');
  };

  const getFirstImageUrl = (imagesUrls: string[]) => {
    if (imagesUrls && imagesUrls.length > 0) {
      return `${process.env.NEXT_PUBLIC_UPLOADS_URL}/${imagesUrls[0]}`;
    }
    return '/default-image-path.webp';
  };

  return (
    <>
      <Container mt={"md"} size={"xl"}>
        <Grid>
          {raffles.map((raffle) => (
            <Grid.Col key={raffle.id} span={{ base: 12, xs: 6, md: 4, lg: 3 }}>
              <CustomCard
                imageSrc={getFirstImageUrl(raffle.imagesUrls)}
                imageAlt={raffle.name}
                title={raffle.name}
                badgeText={formatDate(raffle.gameDate)}
                description={raffle.description}
                buttonText="¡Quiero Jugar!"
              />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </>
  )
}

export default HomeCards