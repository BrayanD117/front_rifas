"use client";

import React, { useEffect, useState } from "react";
import { DetailRaffleCard } from "@/app/components/DetailRaffleCard/DetailRaffleCard";
import axios from "axios";
import { useParams } from "next/navigation";
import { Button, Container, Grid, PinInput, Group } from "@mantine/core";
import styles from './RaffleDetail.module.css';

interface Raffle {
  id: number;
  name: string;
  imagesUrls: string;
  description: string;
  totalValue: string;
  prize: string;
  lottery: string;
  gameDate: string;
  numberDigits: number;
}

const RaffleDetailPage: React.FC = () => {
  const { id } = useParams();
  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [loading, setLoading] = useState(true);
  const [manualNumber, setManualNumber] = useState<string>("");

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

  const generateRandomNumber = () => {
    if (raffle) {
      const max = Math.pow(10, raffle.numberDigits) - 1;
      const min = Math.pow(10, raffle.numberDigits - 1);
      const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
      let intervalId: NodeJS.Timeout;
      let currentIteration = 0;
      const totalIterations = 20;
      
      intervalId = setInterval(() => {
        const intermediateNum = Math.floor(Math.random() * (max - min + 1)) + min;
        setManualNumber(intermediateNum.toString().padStart(raffle.numberDigits, "0"));
        
        currentIteration++;
        if (currentIteration >= totalIterations) {
          clearInterval(intervalId);
          setManualNumber(randomNum.toString().padStart(raffle.numberDigits, "0"));
        }
      }, 50);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!raffle) {
    return <div>No se encontró la rifa</div>;
  }

  return (
    <Container mt={90} size={"xl"}>
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <DetailRaffleCard
            image={raffle.imagesUrls[0]}
            title={raffle.name}
            totalValue={raffle.totalValue}
            description={raffle.description}
            moreInfo={{
              prize: raffle.prize,
              lottery: raffle.lottery,
              gameDate: raffle.gameDate,
            }}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Group justify="center" mt="md">
            <PinInput
              size="xl"
              length={raffle.numberDigits}
              value={manualNumber}
              onChange={setManualNumber}
              classNames={{
                input: styles.pinInput,
              }}
            />
          </Group>
          <Group justify="space-between" grow>
            <Button mt="md">Añadir al Carrito</Button>
            <Button onClick={generateRandomNumber} mt="md">
              Generar Número Aleatorio
            </Button>
          </Group>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default RaffleDetailPage;
