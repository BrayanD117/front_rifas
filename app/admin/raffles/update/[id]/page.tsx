"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Container, TextInput, NumberInput, Textarea, Button, Title, Group, Switch, Select, SimpleGrid, ActionIcon } from "@mantine/core";
import { DateTimePicker } from '@mantine/dates';
import { DropzoneButton } from "@/app/components/Dropzone/DropzoneButton";
import { showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
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

const EditRafflePage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

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
  const [existingImages, setExistingImages] = useState<string[]>([]);
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

  useEffect(() => {
    const fetchRaffle = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/raffles/${id}`);
        setName(data.name);
        setDescription(data.description);
        setPrize(data.prize);
        setTotalValue(formatCurrency(data.totalValue));
        setGameDate(new Date(data.gameDate));
        setCloseDate(new Date(data.closeDate));
        setExpirationDate(new Date(data.expirationDate));
        setLottery(data.lottery);
        setNumberDigits(data.numberDigits);
        setNumberSeries(data.numberSeries);
        setCoverageId(data.coverageId);
        setAuthorityId(data.authorityId);
        setBearerCheck(data.bearerCheck);
        setActive(data.active);
        setPublicationDateTime(new Date(data.dateTimePublication));
        setExistingImages(data.imagesUrls || []);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los datos de la rifa", error);
        setLoading(false);
      }
    };

    fetchRaffle();
  }, [id]);

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateRaffle = async () => {
    try {
      const numericTotalValue = parseCurrency(totalValue);

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
        gameDate: formatDateToDB(gameDate),
        closeDate: formatDateToDB(closeDate),
        expirationDate: formatDateToDB(expirationDate),
        coverageId,
        authorityId,
        active: active.toString(),
        dateTimePublication: formatDateToDB(publicationDateTime),
        imagesUrls: [
          ...existingImages,
          ...imageUrl.map((file, index) => `/assets/raffles/${name}/${name}-${index + 1}${file.name.substring(file.name.lastIndexOf('.'))}`),
        ],
      };

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/raffles/${id}`, raffleData, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });

      if (imageUrl.length > 0) {
        await uploadFilesToServer(imageUrl, name);
      }
      showNotification({
        title: 'Rifa actualizada con éxito',
        message: 'La rifa se ha actualizado correctamente.',
        color: 'green',
      });

      router.push("/admin/raffles");
    } catch (error) {
      console.error("Error al actualizar la rifa", error);
      showNotification({
        title: 'Error al actualizar la rifa',
        message: 'Ocurrió un error al actualizar la rifa. Por favor, inténtalo de nuevo.',
        color: 'red',
      });
    }
  };

  const uploadFilesToServer = async (files: File[], raffleName: string) => {
    console.log('Inicio de uploadFilesToServer');
    console.log('Archivos recibidos para subir:', files);
    console.log('Nombre de la rifa al subir archivos:', raffleName);
  
    const data = new FormData();
  
    files.forEach((file) => {
      console.log('Agregando archivo al FormData:', file.name);
      data.append('files', file);
    });
  
    data.append('raffleName', raffleName);
    console.log('Nombre de la rifa agregado al FormData:', raffleName);
  
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/upload/files`, data);
      console.log('Archivos subidos con éxito', response.data);
    } catch (error) {
      console.error('Error al subir los archivos', error);
    }
  };

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

  return (
    <Container>
      <Title order={2} mt="xl">Editar Rifa</Title>

      {loading ? <p>Cargando...</p> : (
        <>
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
              description={"Esta opción activará la publicación de la rifa"}
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
          <Title order={3} mt="xl">Imágenes Existentes</Title>
          <SimpleGrid cols={3} mt="md">
            {existingImages.map((imageUrl, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <img
                  src={imageUrl}
                  alt={`Rifa ${name} Imagen ${index + 1}`}
                  style={{ width: '100%', borderRadius: '8px' }}
                />
                <ActionIcon
                  color="red"
                  variant="filled"
                  style={{ position: 'absolute', top: '5px', right: '5px', zIndex: 10 }}
                  onClick={() => handleRemoveExistingImage(index)}
                >
                  <IconX size={16} />
                </ActionIcon>
              </div>
            ))}
          </SimpleGrid>

          <Group mt="xl" mb="xl">
            <Button color="green" onClick={handleUpdateRaffle}>Guardar Cambios</Button>
            <Button color="red" variant="outline" onClick={() => router.push("/admin/raffles")}>
              Cancelar
            </Button>
          </Group>
        </>
      )}
    </Container>
  );
};

export default EditRafflePage;
