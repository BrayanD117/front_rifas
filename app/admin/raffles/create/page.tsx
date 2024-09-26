"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, TextInput, NumberInput, Textarea, Button, Title, Group, Checkbox } from "@mantine/core";
import { DateInput } from '@mantine/dates';
import { NumberFormatter } from '@mantine/core';
import 'dayjs/locale/es';
import axios from "axios";

const CreateRafflePage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [prize, setPrize] = useState("");
  const [baseValue, setBaseValue] = useState<number>(0);
  const [ivaValue, setIvaValue] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [gameDate, setGameDate] = useState<Date | null>(null);
  const [closeDate, setCloseDate] = useState<Date | null>(null);
  const [bearerCheck, setBearerCheck] = useState(false);

  useEffect(() => {
    const calculatedBaseValue = totalValue / 1.19;
    const calculatedIvaValue = calculatedBaseValue * 0.19;

    setBaseValue(parseFloat(calculatedBaseValue.toFixed(2)));
    setIvaValue(parseFloat(calculatedIvaValue.toFixed(2)));
  }, [totalValue]);

  const handleCreateRaffle = async () => {
    try {
      const newRaffle = {
        name,
        description,
        prize,
        baseValue,
        ivaValue,
        totalValue,
        gameDate,
        closeDate,
        bearerCheck,
      };

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/raffles`, newRaffle, {
        withCredentials: true,
      });

      router.push("/admin/raffles");
    } catch (error) {
      console.error("Error al crear la rifa", error);
    }
  };

  return (
    <Container>
      <Title order={2} mt="xl">Crear Nueva Rifa</Title>

      <TextInput
        label="Nombre de la Rifa"
        placeholder="Ingrese el nombre de la rifa"
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
        withAsterisk
        mt="md"
      />

      <Textarea
        label="Descripción"
        placeholder="Ingrese la descripción de la rifa"
        value={description}
        onChange={(event) => setDescription(event.currentTarget.value)}
        withAsterisk
        mt="md"
      />

      <TextInput
        label="Premio"
        placeholder="Ingrese el premio de la rifa"
        value={prize}
        onChange={(event) => setPrize(event.currentTarget.value)}
        withAsterisk
        mt="md"
      />

      <Group grow mt="md">
        <NumberInput
          label="Valor Total"
          value={totalValue}
          onChange={(value) => setTotalValue(value ?? 0)}
          hideControls
          withAsterisk
        />
        <NumberInput
          label="Valor Base"
          value={baseValue}
          readOnly
          hideControls
          variant="filled"
        />
        <NumberInput
          label="Valor IVA"
          value={ivaValue}
          readOnly
          hideControls
          variant="filled"
        />
      </Group>

      <Group grow mt="md">
        <DateInput 
          locale="es"
          label="Fecha del Sorteo"
          placeholder="Seleccione la fecha del sorteo"
          value={gameDate}
          onChange={setGameDate}
          withAsterisk
        />
        <DateInput 
          locale="es"
          label="Fecha de Cierre"
          placeholder="Seleccione la fecha de cierre"
          value={closeDate}
          onChange={setCloseDate}
          withAsterisk
        />
      </Group>

      <Checkbox
        label="Cheque al portador"
        checked={bearerCheck}
        onChange={(event) => setBearerCheck(event.currentTarget.checked)}
        mt="md"
      />
      <Group mt="xl">
        <Button color="green" onClick={handleCreateRaffle}>Crear Rifa</Button>
        <Button color="red" variant="outline" onClick={() => router.push("/admin/raffles")}>
          Cancelar
        </Button>
      </Group>
    </Container>
  );
};

export default CreateRafflePage;
