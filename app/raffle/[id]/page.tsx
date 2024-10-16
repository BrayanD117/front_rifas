"use client";

import React, { useEffect, useState, useRef } from "react";
import { DetailRaffleCard } from "@/app/components/DetailRaffleCard/DetailRaffleCard";
import axios from "axios";
import { useParams } from "next/navigation";
import { Button, Container, Grid, Group, Title } from "@mantine/core";
import AnimatedDigitInput from "../../components/AnimatedDigitInput/AnimatedDigitInput";
import { motion } from "framer-motion";
import PurchaseDetailDrawer from '@/app/components/PurchaseDetailDrawer/PurchaseDetailDrawer';
import { useDispatch } from "react-redux";
import { addToCart } from "@/features/cart/cartSlice";

interface Raffle {
  id: number;
  slogan: string;
  imagesUrls: string[];
  description: string;
  totalValue: string;
  baseValue: string;
  ivaValue: string;
  prize: string;
  prizeCommercialValuation: string;
  lottery: string;
  gameDate: string;
  numberDigits: number;
  numberSeries: string;
  managerName: string;
  managerContact: string;
  managerAddress: string;
}

const RaffleDetailPage: React.FC = () => {
  const { id } = useParams();
  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [loading, setLoading] = useState(true);
  const [finalNumber, setFinalNumber] = useState<string>("");
  const [currentDigits, setCurrentDigits] = useState<string[]>([]);
  const [raffleNumbers, setRaffleNumbers] = useState<any[]>([]);
  const [isAnimating, setIsAnimating] = useState<boolean[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const dispatch = useDispatch();

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

  const handleAddToCart = () => {
    if (raffle && currentDigits.length === raffle.numberDigits) {
      const numberPlayed = currentDigits.join('');
      const newPlayedNumber = {
        number: numberPlayed,
        baseValue: raffle.baseValue,
        tax: raffle.ivaValue,
        totalValue: raffle.totalValue,
        raffleId: raffle.id,
        raffleName: raffle.slogan,
      };

      setRaffleNumbers([...raffleNumbers, newPlayedNumber]);

      dispatch(addToCart(newPlayedNumber));
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!raffle) {
    return <div>No se encontró la rifa</div>;
  }

  const getAllImagesUrls = (imagesUrls: string[]) => {
    if (imagesUrls && imagesUrls.length > 0) {
      return imagesUrls.map((imageUrl) => `${process.env.NEXT_PUBLIC_UPLOADS_URL}/${imageUrl}`);
    }
    return ['/default-image-path.webp'];
  };

  return (
    <>
      <Container mt={90} size={"xl"}>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <DetailRaffleCard
              imagesUrls={getAllImagesUrls(raffle.imagesUrls)}
              slogan={raffle.slogan}
              totalValue={raffle.totalValue}
              description={raffle.description}
              moreInfo={{
                prize: raffle.prize,
                prizeCommercialValuation: raffle.prizeCommercialValuation,
                lottery: raffle.lottery,
                gameDate: raffle.gameDate,
                winnerNumbers: raffle.numberSeries
              }}
              numberDigits={raffle.numberDigits}
              managerName={raffle.managerName}
              managerContact={raffle.managerContact}
              managerAddress={raffle.managerAddress}

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
              <Button mt="md" onClick={handleAddToCart}>Añadir al Carrito</Button>
              <Button
                onClick={generateRandomNumber}
                mt="md"
              >
                Generar Número Aleatorio
              </Button>
            </Group>
            <PurchaseDetailDrawer
              name={raffle.slogan}
              prize={raffle.prize}
              gameDate={raffle.gameDate}
              elements={[
                { number: '4842', baseValue: raffle.baseValue, tax: raffle.ivaValue, totalValue: raffle.totalValue },
                { number: '7845', baseValue: raffle.baseValue, tax: raffle.ivaValue, totalValue: raffle.totalValue },
                { number: '9742', baseValue: raffle.baseValue, tax: raffle.ivaValue, totalValue: raffle.totalValue },
              ]}
            />
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
};

export default RaffleDetailPage;