"use client"

import { Container, Grid } from "@mantine/core";
import HomeRaffleCard from "../HomeRaffleCard/HomeRaffleCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useFormattedDate } from "@/app/hooks/useFormattedDate";

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
  const { formatShortDate } = useFormattedDate();

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
                badgeText={formatShortDate(raffle.gameDate)}
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