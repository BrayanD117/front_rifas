"use client"

import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { Container, Title, Text, Image, Badge, Grid, Group } from "@mantine/core";
import dayjs from "dayjs";
import "dayjs/locale/es";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.locale("es");
dayjs.extend(advancedFormat);

interface Raffle {
  id: number;
  name: string;
  imageUrl: string;
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

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("dddd, D [de] MMMM [de] YYYY");
  };

  return (
    <Container mt={90} size={"xl"}>
        <Title order={1}>{raffle.name}</Title>
        <Grid>
            <Grid.Col span={6}>
                <Image src={raffle.imageUrl} alt={raffle.name} height={300} fit="contain" mt="md" />
                <Text mt="md" size="lg">
                    {raffle.description}
                </Text>
                <Text mt="md" size="lg">
                    Premio: {raffle.prize}
                </Text>
                <Text size="lg">
                    Lotería: {raffle.lottery}
                </Text>
                <Text size="lg">
  Fecha de juego:
  <Group inline>
    <Badge color="yellow" mt={0}>
      {formatDate(raffle.gameDate)}
    </Badge>
  </Group>
</Text>
                
            </Grid.Col>
            <Grid.Col span={6}>
                
            </Grid.Col>
        </Grid>
    </Container>
  )
}

export default RaffleDetailPage