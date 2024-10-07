"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, TextInput, NumberInput, Textarea, Button, Title, Group, Switch, Select } from "@mantine/core";
import { DateTimePicker } from '@mantine/dates';
import { DropzoneButton } from "@/app/components/Dropzone/DropzoneButton";
import { showNotification } from '@mantine/notifications';
import 'dayjs/locale/es';
import axios from "axios";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value);
};

const parseCurrency = (value: string) => {
  return Number(value.replace(/\D/g, "")) || 0;
};

const CreateRafflePage = () => {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [prize, setPrize] = useState<string>("");
  const [baseValue, setBaseValue] = useState<number>(0);
  const [ivaValue, setIvaValue] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<string>("0");
  const [gameDate, setGameDate] = useState<Date | null>(null);
  const [closeDate, setCloseDate] = useState<Date | null>(null);
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [publicationDateTime, setPublicationDateTime] = useState<Date | null>(null);
  const [lottery, setLottery] = useState<string>("");
  const [numberDigits, setNumberDigits] = useState<number>(4);
  const [numberSeries, setNumberSeries] = useState<number>(1);
  const [imageUrl, setImageUrl] = useState<File[]>([]);
  const [coverageId, setCoverageId] = useState<string | null>(null);
  const [authorityId, setAuthorityId] = useState<string | null>(null);
  const [coverages, setCoverages] = useState<{ value: string; label: string }[]>([]);
  const [authorities, setAuthorities] = useState<{ value: string; label: string }[]>([]);
  const [bearerCheck, setBearerCheck] = useState(false);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const numericTotalValue = parseCurrency(totalValue);
    const calculatedBaseValue = numericTotalValue / 1.19;
    const calculatedIvaValue = numericTotalValue - calculatedBaseValue;

    setBaseValue(parseFloat(calculatedBaseValue.toFixed(2)));
    setIvaValue(parseFloat(calculatedIvaValue.toFixed(2)));
  }, [totalValue]);

  useEffect(() => {
    const fetchCoverages = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/coverages`);
        setCoverages(data.map((coverage: any) => ({ value: coverage.id, label: coverage.name })));
      } catch (error) {
        console.error('Error fetching coverages', error);
      }
    };

    const fetchAuthorities = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/authorities`);
        setAuthorities(data.map((authority: any) => ({ value: authority.id, label: authority.name })));
      } catch (error) {
        console.error('Error fetching authorities', error);
      }
    };

    fetchCoverages();
    fetchAuthorities();
  }, []);

  const formatDateToDB = (date: Date | null) => {
    if (!date) return '';
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().replace('T', ' ').split('.')[0];
  };

  const handlePublishImmediately = () => {
    const currentDate = new Date();
    setPublicationDateTime(currentDate);
  };

  const handleCreateRaffle = async () => {
    try {
      const numericTotalValue = parseCurrency(totalValue);
      const formattedGameDate = formatDateToDB(gameDate);
      const formattedCloseDate = formatDateToDB(closeDate);
      const formattedExpirationDate = formatDateToDB(expirationDate);
      const dateTimePublication = formatDateToDB(publicationDateTime);
  
      const raffleData = {
        name,
        description,
        prize,
        baseValue,
        ivaValue,
        totalValue: numericTotalValue,
        lottery,
        numberDigits,
        numberSeries,
        bearerCheck: bearerCheck.toString(),
        gameDate: formattedGameDate,
        closeDate: formattedCloseDate,
        expirationDate: formattedExpirationDate,
        coverageId,
        authorityId,
        active: active.toString(),
        dateTimePublication,
        imagesUrls: imageUrl.map((file, index) => `/uploads/raffles/${name}Image${index + 1}.webp`)
      };

      if (imageUrl.length > 0) {
        await uploadFilesToServer(imageUrl, name);
      }

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/raffles`, raffleData, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });
  
      showNotification({
        title: 'Rifa creada con éxito',
        message: 'La rifa se ha creado correctamente.',
        color: 'green',
      });
  
      router.push("/admin/raffles");
    } catch (error) {
      console.error("Error al crear la rifa", error);
      showNotification({
        title: 'Error al crear la rifa',
        message: 'Ocurrió un error al crear la rifa. Por favor, inténtalo de nuevo.',
        color: 'red',
      });
    }
  };  

  const uploadFilesToServer = async (files: File[], raffleName: string) => {

    const data = new FormData();

    files.forEach((file) => {
      data.append('files', file);
    });

    data.append('raffleName', raffleName);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/upload/files`, data);
    } catch (error) {
      console.error('Error al subir los archivos', error);
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
        <TextInput
          label="Valor Total"
          value={totalValue}
          onChange={(event) => setTotalValue(formatCurrency(parseCurrency(event.currentTarget.value)))}
          placeholder="Ingrese el valor total"
          withAsterisk
        />
        <TextInput
          label="Valor Base"
          value={formatCurrency(baseValue)}
          readOnly
          variant="filled"
        />
        <TextInput
          label="Valor IVA"
          value={formatCurrency(ivaValue)}
          readOnly
          variant="filled"
        />
      </Group>

      <Group grow mt="md">
        <DateTimePicker
          locale="es"
          label="Fecha del Sorteo"
          placeholder="Seleccione la fecha y hora del sorteo"
          value={gameDate}
          onChange={setGameDate}
          withAsterisk
        />
        <DateTimePicker
          locale="es"
          label="Fecha de Cierre"
          placeholder="Seleccione la fecha y hora de cierre"
          value={closeDate}
          onChange={setCloseDate}
          withAsterisk
        />
        <DateTimePicker
          locale="es"
          label="Fecha de Expiración"
          placeholder="Seleccione la fecha y hora de expiración"
          value={expirationDate}
          onChange={setExpirationDate}
          withAsterisk
        />
      </Group>
      <Group mt="md" justify="space-between">
        <Switch
          label="Activar publicación"
          description="Esta opción activará la publicación de la rifa"
          checked={active}
          onChange={(event) => setActive(event.currentTarget.checked)}
          mt="md"
        />
        <Switch
          label="Cheque al portador"
          checked={bearerCheck}
          onChange={(event) => setBearerCheck(event.currentTarget.checked)}
          description="Esta opción hará que el premio sea entregado al portador de la boleta"
          mt="md"
        />
      </Group>
      <Group grow mt="md" align="center">
        <DateTimePicker
          locale="es"
          label="Fecha de Publicación"
          placeholder="Seleccione la fecha y hora de publicación"
          value={publicationDateTime}
          onChange={setPublicationDateTime}
          withAsterisk
        />
        <Button mt="md" onClick={handlePublishImmediately}>
          Publicar inmediatamente
        </Button>
      </Group>

      <TextInput
        label="Lotería"
        placeholder="Ingrese la lotería"
        value={lottery}
        onChange={(event) => setLottery(event.currentTarget.value)}
        mt="md"
      />

      <Group grow mt="md">
        <NumberInput
          label="Número de Dígitos"
          value={numberDigits}
          onChange={(value: string | number) => setNumberDigits(typeof value === 'number' ? value : 4)}
          hideControls
        />
        <NumberInput
          label="Número de Series"
          value={numberSeries}
          onChange={(value: string | number) => setNumberSeries(typeof value === 'number' ? value : 1)}
          hideControls
        />
      </Group>

      <Select
        label="Cobertura"
        placeholder="Seleccione la cobertura"
        data={coverages}
        value={coverageId}
        onChange={setCoverageId}
        mt="md"
        withAsterisk
      />

      <Select
        label="Autoridad"
        placeholder="Seleccione la autoridad"
        data={authorities}
        value={authorityId}
        onChange={setAuthorityId}
        mt="md"
        withAsterisk
      />
      
      <DropzoneButton setImageUrl={setImageUrl} raffleName={name}/>
      <Group mt="xl" mb="xl">
        <Button color="green" onClick={handleCreateRaffle}>Crear Rifa</Button>
        <Button color="red" variant="outline" onClick={() => router.push("/admin/raffles")}>
          Cancelar
        </Button>
      </Group>
    </Container>
  );
};

export default CreateRafflePage;
