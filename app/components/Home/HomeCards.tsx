"use client"

import { Container, Grid } from "@mantine/core";
import HomeRaffleCard from "../HomeRaffleCard/HomeRaffleCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

interface Raffle {
  id: number;
  imagesUrls: string;
  name: string;
  gameDate: string;
  description: string;
}

const HomeCards: React.FC = () => {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchRaffles = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/raffles/active`);
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

  return (
    <>
      <Container mt={"md"} size={"xl"}>
        <Grid>
          {raffles.map((raffle) => (
            <Grid.Col key={raffle.id} span={{ base: 12, xs: 6, md: 4, lg: 3 }}>
              <HomeRaffleCard
                imageSrc={raffle.imagesUrls[0]}
                imageAlt={raffle.name}
                title={raffle.name}
                badgeText={formatDate(raffle.gameDate)}
                description={raffle.description}
                buttonText="¡Quiero Jugar!"
                onButtonClick={() => router.push(`/raffle/${raffle.id}`)}
              />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </>
  )
}

export default HomeCards