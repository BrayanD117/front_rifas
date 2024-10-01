"use client";

import React, { useEffect, useState, useRef } from "react";
import { DetailRaffleCard } from "@/app/components/DetailRaffleCard/DetailRaffleCard";
import axios from "axios";
import { useParams } from "next/navigation";
import { Button, Container, Grid, Group, Title } from "@mantine/core";
import AnimatedDigitInput from "../../components/AnimatedDigitInput/AnimatedDigitInput";
import { motion } from "framer-motion";
import PurchaseDetailDrawer from '@/app/components/PurchaseDetailDrawer/PurchaseDetailDrawer';

interface Raffle {
  id: number;
  name: string;
  imagesUrls: string[];
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
  const [finalNumber, setFinalNumber] = useState<string>("");
  const [currentDigits, setCurrentDigits] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState<boolean[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const pinInputVariants = {
    initial: { scale: 1 },
    mixing: { scale: 1.3, transition: { duration: 0.3, ease: "easeInOut" } },
    final: { scale: 1, transition: { duration: 0.3, ease: "easeInOut" } },
  };

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

  useEffect(() => {
    if (raffle && currentDigits.length === 0) {
      setCurrentDigits(Array(raffle.numberDigits).fill(''));
      setIsAnimating(Array(raffle.numberDigits).fill(false));
    }
  }, [raffle, currentDigits.length]);

  const generateRandomNumber = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    if (raffle) {
      const max = Math.pow(10, raffle.numberDigits) - 1;
      const min = Math.pow(10, raffle.numberDigits - 1);
      const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
      const finalNumStr = randomNum.toString().padStart(raffle.numberDigits, "0");
      setFinalNumber(finalNumStr);

      setIsAnimating(Array(raffle.numberDigits).fill(true));

      for (let i = 0; i < raffle.numberDigits; i++) {
        const timeout = setTimeout(() => {
          setIsAnimating((prev) => {
            const newAnimating = [...prev];
            newAnimating[i] = false;
            return newAnimating;
          });
          setCurrentDigits((prev) => {
            const newDigits = [...prev];
            newDigits[i] = finalNumStr[i];
            return newDigits;
          });
        }, 1000 + i * 500);
        timeoutsRef.current.push(timeout);
      }
    }
  };

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const handleDigitChange = (value: string, index: number) => {
    setCurrentDigits((prev) => {
      const newDigits = [...prev];
      newDigits[index] = value;
      return newDigits;
    });
  };

  const focusNext = (index: number) => {
    if (inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const focusPrev = (index: number) => {
    if (inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!raffle) {
    return <div>No se encontró la rifa</div>;
  }

  return (
    <>
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
          <Title ta={"center"} order={2} mt={"md"}>Número a Jugar</Title>
          <Group justify="center" mt="lg">
            <motion.div
              initial="initial"
              animate={isAnimating.some((anim) => anim) ? "mixing" : "final"}
              variants={pinInputVariants}
            >
              <div style={{ display: 'flex' }}>
                {currentDigits.map((digit, index) => (
                  <AnimatedDigitInput
                    key={index}
                    value={digit}
                    onChange={handleDigitChange}
                    isAnimating={isAnimating[index]}
                    finalDigit={digit}
                    index={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}                    
                    focusNext={focusNext}
                    focusPrev={focusPrev}
                  />
                ))}
              </div>
            </motion.div>
          </Group>
          <Group mt={"lg"} justify="space-between" grow>
            <Button mt="md">Agregar Número</Button>
            <Button 
              onClick={generateRandomNumber} 
              mt="md"
            >
              Generar Número Aleatorio
            </Button>
          </Group>              <PurchaseDetailDrawer 
                prize={raffle.prize}
                lottery={raffle.lottery}
                gameDate={raffle.gameDate}
              />
        </Grid.Col>
      </Grid>
    </Container>
    </>
  );
};

export default RaffleDetailPage;
