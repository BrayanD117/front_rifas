"use client"

import React from 'react'
import { useEffect, useState } from "react";
import { DetailRaffleCard } from '@/app/components/DetailRaffleCard/DetailRaffleCard';
import axios from "axios";
import { useParams } from "next/navigation";
import { Container, Grid} from "@mantine/core";

interface Raffle {
  id: number;
  name: string;
  imagesUrls: string;
  description: string;
  prize: string;
  lottery: string;
  gameDate: string;
}

const RaffleDetailPage: React.FC = () => {
  const { id } = useParams();
  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRaffle = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/raffles/${id}`);
        setRaffle(response.data);
      } catch (error) {
        console.error("Error fetching raffle:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRaffle();
    }
  }, [id]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!raffle) {
    return <div>No se encontró la rifa</div>;
  }

  return (
    <Container mt={90} size={"xl"}>
        <Grid>
            <Grid.Col span={{base: 12, md: 6}}>
              <DetailRaffleCard
                image={raffle.imagesUrls[0]}
                title={raffle.name}
                description={raffle.description}
                moreInfo={{
                  prize: raffle.prize,
                  lottery: raffle.lottery,
                  gameDate: raffle.gameDate
                }}
              />
            </Grid.Col>
            <Grid.Col span={{base: 12, md: 6}}>

            </Grid.Col>
        </Grid>
    </Container>
  )
}

export default RaffleDetailPage