"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Container,
  TextInput,
  NumberInput,
  Textarea,
  Button,
  Title,
  Group,
  Switch,
  Select,
  Divider,
  Grid,
  Text,
  Center,
  ActionIcon,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { DropzoneButton } from "@/app/components/Dropzone/DropzoneButton";
import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import dynamic from "next/dynamic";

const MapComponent = dynamic(
  () => import("@/app/components/MapComponent/MapComponent"),
  { ssr: false }
);

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);
};

const parseCurrency = (value: string) => {
  return Number(value.replace(/\D/g, "")) || 0;
};

const EditRafflePage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [center] = useState<[number, number]>([4.4447, -75.2421]);
  const [loading, setLoading] = useState(true);

  // States for fields
  const [name, setName] = useState<string>("");
  const [slogan, setSlogan] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [prize, setPrize] = useState<string>("");
  const [prizeSpecifications, setPrizeSpecifications] = useState<string>("");
  const [prizeCommercialValue, setPrizeCommercialValue] = useState<string>(
    "0"
  );
  const [baseValue, setBaseValue] = useState<number>(0);
  const [ivaValue, setIvaValue] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<string>("0");
  const [gameDate, setGameDate] = useState<Date | null>(null);
  const [daysCloseDate, setDaysCloseDate] = useState<number>(2);
  const [closeDate, setCloseDate] = useState<Date | null>(null);
  const [daysExpirationDate, setDaysExpirationDate] = useState<number>(30);
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [publicationDateTime, setPublicationDateTime] =
    useState<Date | null>(null);
  const [saleDateTime, setSaleDateTime] = useState<Date | null>(null);
  const [lottery, setLottery] = useState<string>("");
  const [numberDigits, setNumberDigits] = useState<number>(4);
  const [numberSeries, setNumberSeries] = useState<number>(1);
  const [coverageId, setCoverageId] = useState<string | null>(null);
  const [authorityId, setAuthorityId] = useState<string | null>(null);
  const [coverages, setCoverages] = useState<
    { value: string; label: string }[]
  >([]);
  const [authorities, setAuthorities] = useState<
    { value: string; label: string }[]
  >([]);
  const [bearerCheck, setBearerCheck] = useState(false);
  const [active, setActive] = useState(true);
  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [category, setCategory] = useState<string | null>(null);
  const [raffleManager, setRaffleManager] = useState<string>("");
  const [contactManagerRaffle, setContactManagerRaffle] = useState<string>("");
  const [addressManagerRaffle, setAddressManagerRaffle] = useState<string>("");

  const [images, setImages] = useState<
    Array<{ id: string; url: string; file?: File; isNew: boolean }>
  >([]);

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
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/coverages`
        );
        setCoverages(
          data.map((coverage: any) => ({
            value: coverage.id,
            label: coverage.name,
          }))
        );
      } catch (error) {
        console.error("Error fetching coverages", error);
      }
    };

    const fetchAuthorities = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/authorities`
        );
        setAuthorities(
          data.map((authority: any) => ({
            value: authority.id,
            label: authority.name,
          }))
        );
      } catch (error) {
        console.error("Error fetching authorities", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`
        );
        setCategories(
          data.map((category: any) => ({
            value: category.id,
            label: category.name,
          }))
        );
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchCoverages();
    fetchAuthorities();
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchRaffle = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/raffles/${id}`
        );

        setName(data.name);
        setSlogan(data.slogan);
        setDescription(data.description);
        setPrize(data.prize);
        setPrizeSpecifications(data.prizeSpecifications);
        setPrizeCommercialValue(formatCurrency(data.prizeCommercialValuation));
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
        setSaleDateTime(
          data.dateTimeSale ? new Date(data.dateTimeSale) : null
        );
        setRaffleManager(data.managerName);
        setContactManagerRaffle(data.managerContact);
        setAddressManagerRaffle(data.managerAddress);
        setCategory(data.categoryId);

        const existingImagesFormatted = (data.imagesUrls || []).map(
          (url: string) => ({
            id: url,
            url: `${process.env.NEXT_PUBLIC_UPLOADS_URL}/${url}`,
            isNew: false,
          })
        );
        setImages(existingImagesFormatted);

        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los datos de la rifa", error);
        setLoading(false);
      }
    };

    fetchRaffle();
  }, [id]);

  const handleRemoveImage = async (index: number) => {
    const imageToRemove = images[index];

    if (!imageToRemove.isNew) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/upload/file`,
          {
            data: { imagePath: imageToRemove.id },
            headers: { "Content-Type": "application/json" },
          }
        );
      } catch (error) {
        console.error("Error al eliminar la imagen del servidor", error);
      }
    }

    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedImages = Array.from(images);
    const [removed] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, removed);

    setImages(reorderedImages);
  };

  const handleUpdateRaffle = async () => {
    try {
      const numericTotalValue = parseCurrency(totalValue);
      const numericPrizeCommercialValue = parseCurrency(prizeCommercialValue);
      const formattedGameDate = formatDateToDB(gameDate);
      const formattedCloseDate = formatDateToDB(closeDate);
      const formattedExpirationDate = formatDateToDB(expirationDate);
      const dateTimePublication = formatDateToDB(publicationDateTime);

      const raffleTitle = name;
      const normalizedRaffleName = name.replace(/\s+/g, "_");

      const existingImagesUrls = images
        .filter((img) => !img.isNew)
        .map((img) => img.id);

      const newImages = images.filter((img) => img.isNew && img.file);

      const getNextImageIndex = () => {
        const indices = existingImagesUrls.map((imageUrl) => {
          const filename = imageUrl.split("/").pop();
          const match = filename ? filename.match(/_(\d+)\./) : null;
          return match ? parseInt(match[1], 10) : 0;
        });
        const maxIndex = indices.length > 0 ? Math.max(...indices) : 0;
        return maxIndex + 1;
      };

      const nextImageIndex = getNextImageIndex();

      const newImageFilenames = newImages.map((_, index) => {
        return `${normalizedRaffleName}_${
          nextImageIndex + index
        }.webp`;
      });

      const updatedImagesUrls: string[] = [];
      let newImageIndex = 0;

      images.forEach((img) => {
        if (img.isNew) {
          updatedImagesUrls.push(
            `${normalizedRaffleName}/${newImageFilenames[newImageIndex]}`
          );
          newImageIndex++;
        } else {
          updatedImagesUrls.push(img.id);
        }
      });

      const raffleData = {
        name: raffleTitle,
        slogan,
        description,
        prize,
        prizeSpecifications,
        prizeCommercialValuation: numericPrizeCommercialValue,
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
        dateTimeSale: formatDateToDB(saleDateTime),
        imagesUrls: updatedImagesUrls,
        managerName: raffleManager,
        managerContact: contactManagerRaffle,
        managerAddress: addressManagerRaffle,
        categoryId: category,
      };

      if (newImages.length > 0) {
        await uploadFilesToServer(
          newImages.map((img) => img.file!),
          normalizedRaffleName,
          newImageFilenames
        );
      }

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/raffles/${id}`,
        raffleData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      showNotification({
        title: "Rifa actualizada con éxito",
        message: "La rifa se ha actualizado correctamente.",
        color: "green",
      });

      router.push("/admin/raffles");
    } catch (error) {
      console.error("Error al actualizar la rifa", error);
      showNotification({
        title: "Error al actualizar la rifa",
        message:
          "Ocurrió un error al actualizar la rifa. Por favor, inténtalo de nuevo.",
        color: "red",
      });
    }
  };

  const uploadFilesToServer = async (
    files: File[],
    raffleName: string,
    filenames: string[]
  ) => {
    const data = new FormData();

    files.forEach((file, index) => {
      data.append("files", file, filenames[index]);
    });
    data.append("raffleName", raffleName);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/files`,
        data
      );
    } catch (error) {
      console.error("Error al subir los archivos", error);
    }
  };

  const formatDateToDB = (date: Date | null) => {
    if (!date) return "";
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().replace("T", " ").split(".")[0];
  };

  const handlePublishImmediately = () => {
    const currentDate = new Date();
    setPublicationDateTime(currentDate);
  };

  const handleSellImmediately = () => {
    const currentDate = new Date();
    setSaleDateTime(currentDate);
  };

  const normalizedRaffleName = name.replace(/\s+/g, "_");

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
        label="Eslogan"
        placeholder="Ingrese el eslogan de la rifa"
        value={slogan}
        onChange={(event) => setSlogan(event.currentTarget.value)}
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

      <Textarea
        label="Especificaciones del premio"
        placeholder="Ingrese las especificaciones del premio"
        value={prizeSpecifications}
        onChange={(event) => setPrizeSpecifications(event.currentTarget.value)}
        withAsterisk
        mt="md"
      />

      <Select
        label="Categoría"
        placeholder="Seleccione una categoría"
        data={categories}
        value={category}
        onChange={setCategory}
        searchable
        allowDeselect={false}
        mt="md"
        withAsterisk
      />
      
      <TextInput
        label="Avaluo comercial del premio"
        placeholder="Ingrese el avaluo comercial del premio"
        value={prizeCommercialValue}
        onChange={(event) => setPrizeCommercialValue(formatCurrency(parseCurrency(event.currentTarget.value)))}
        withAsterisk
        mt="md"
      />

      <Group grow mt="md">
        <Grid>
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <TextInput
              label="Valor Total"
              value={totalValue}
              onChange={(event) => setTotalValue(formatCurrency(parseCurrency(event.currentTarget.value)))}
              placeholder="Ingrese el valor total"
              withAsterisk
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <TextInput
              label="Valor Base"
              value={formatCurrency(baseValue)}
              readOnly
              variant="filled"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <TextInput
              label="Valor IVA"
              value={formatCurrency(ivaValue)}
              readOnly
              variant="filled"
            />
          </Grid.Col>
        </Grid>
      </Group>

      <Divider my="md" />

      <Group grow>
        <Grid>
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <DateTimePicker
              locale="es"
              label="Fecha del Sorteo"
              placeholder="Seleccione la fecha y hora del sorteo"
              value={gameDate}
              onChange={setGameDate}
              withAsterisk
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Switch
              label="Activar publicación"
              description="Esta opción activará la publicación de la rifa"
              checked={active}
              onChange={(event) => setActive(event.currentTarget.checked)}
              mt="md"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Switch
              label="Cheque al portador"
              checked={bearerCheck}
              onChange={(event) => setBearerCheck(event.currentTarget.checked)}
              description="Esta opción hará que el premio sea entregado al portador de la boleta"
              mt="md"
            />
          </Grid.Col>
        </Grid>
      </Group>
      <Group grow mt="md">
        <Grid align="center">
          <Grid.Col span={{ base: 12, lg: 3 }}>
            <DateTimePicker
              locale="es"
              label="Fecha de Publicación"
              placeholder="Seleccione la fecha y hora"
              value={publicationDateTime}
              onChange={setPublicationDateTime}
              withAsterisk
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 3 }}>
            <Button fullWidth onClick={handlePublishImmediately}>
              Publicar inmediatamente
            </Button>
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 3 }}>
            <DateTimePicker
              locale="es"
              label="Fecha de Inicio de Venta"
              placeholder="Seleccione la fecha y hora"
              value={saleDateTime}
              onChange={setSaleDateTime}
              withAsterisk
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 3 }}>
            <Button fullWidth onClick={handleSellImmediately}>
              Iniciar venta inmediatamente
            </Button>
          </Grid.Col>
        </Grid>
      </Group>
      <Group grow mt="md">
        <Grid>
          <Grid.Col span={{ base: 12, lg: 3 }}>
            <NumberInput
              label="Fecha de Cierre"
              description="Días antes de la fecha del sorteo"
              placeholder="Ingrese el número de días"
              value={daysCloseDate}
              onChange={(value) => setDaysCloseDate(typeof value === 'number' ? value : 2)}
              withAsterisk
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 3 }}>
            <DateTimePicker
              locale="es"
              label="Fecha de Cierre"
              description="Fecha según días fijados"
              placeholder="Seleccione la fecha y hora"
              value={closeDate}
              onChange={setCloseDate}
              disabled
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 3 }}>
            <NumberInput
              label="Término Caducidad Premio"
              description="Días después de la fecha del sorteo"
              placeholder="Ingrese el número de días"
              value={daysExpirationDate}
              onChange={(value) => setDaysExpirationDate(typeof value === 'number' ? value : 30)}
              withAsterisk
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 3 }}>
            <DateTimePicker
              locale="es"
              label="Término Caducidad Premio"
              description="Fecha según días fijados"
              placeholder="Seleccione la fecha y hora"
              value={expirationDate}
              onChange={setExpirationDate}
              disabled
            />
          </Grid.Col>
        </Grid>
      </Group>
      <TextInput
        label="Lotería"
        placeholder="Ingrese la lotería"
        value={lottery}
        onChange={(event) => setLottery(event.currentTarget.value)}
        mt="md"
      />

      <Group grow mt="md">
        <Grid>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <NumberInput
              label="Número de Dígitos"
              value={numberDigits}
              onChange={(value: string | number) => setNumberDigits(typeof value === 'number' ? value : 4)}
              hideControls
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <NumberInput
              label="Número de Series"
              value={numberSeries}
              onChange={(value: string | number) => setNumberSeries(typeof value === 'number' ? value : 1)}
              hideControls
            />
          </Grid.Col>
        </Grid>
      </Group>
      <Divider mt="md" />
      <Group grow>
        <Grid>
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <TextInput
              label="Responsable de la Rifa"
              placeholder="Ingrese el nombre del responsable"
              value={raffleManager}
              onChange={(event) => setRaffleManager(event.currentTarget.value)}
              mt="md"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <TextInput
              label="Contacto del Responsable"
              placeholder="Ingrese el contacto"
              value={contactManagerRaffle}
              onChange={(event) => setContactManagerRaffle(event.currentTarget.value)}
              mt="md"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <TextInput
              label="Dirección del Responsable"
              placeholder="Ingrese la dirección"
              value={addressManagerRaffle}
              onChange={(event) => setAddressManagerRaffle(event.currentTarget.value)}
              mt="md"
            />
          </Grid.Col>
        </Grid>
      </Group>

      <Group grow>
        <Grid align="center">
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Select
              label="Cobertura"
              placeholder="Seleccione la cobertura"
              data={coverages}
              value={coverageId}
              onChange={setCoverageId}
              mt="md"
              withAsterisk
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Select
              label="Autoridad"
              placeholder="Seleccione la autoridad"
              data={authorities}
              value={authorityId}
              onChange={setAuthorityId}
              mt="md"
              withAsterisk
            />
          </Grid.Col>
        </Grid>
      </Group>

      <Group grow mt="md">
        <MapComponent center={center} />
      </Group>

      <Divider my="md" />

      <DropzoneButton
        onFilesAdded={(newFiles) =>
          setImages((prev) => [...prev, ...newFiles])
        }
        raffleName={name}
        />

        <Divider my="md" />
        {images.length > 0 && (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="images" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    padding: "10px 0",
                  }}
                  >
                    {images.map((image, index) => (
                      <Draggable
                        key={image.id}
                        draggableId={image.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              width: 170,
                              height: 170,
                              margin: "5px",
                              position: "relative",
                              backgroundColor: snapshot.isDragging
                                ? "lightgray"
                                : "white",
                              transition: "background-color 0.2s ease",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              ...provided.draggableProps.style,
                            }}
                          >
                            <img
                              src={image.url}
                              alt={`Imagen ${index + 1}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "8px",
                                objectFit: "cover",
                              }}
                            />
                            <ActionIcon
                              color="red"
                              variant="filled"
                              style={{
                                position: "absolute",
                                top: "5px",
                                right: "5px",
                                zIndex: 10,
                              }}
                              onClick={() => handleRemoveImage(index)}
                            >
                              <IconX size={16} />
                            </ActionIcon>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder && (
                      <div
                        style={{ width: 170, height: 170, margin: "5px" }}
                      >
                        {provided.placeholder}
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}

          <Group mt="xl" mb="xl">
            <Button color="green" onClick={handleUpdateRaffle}>
              Guardar Cambios
            </Button>
            <Button
              color="red"
              variant="outline"
              onClick={() => router.push("/admin/raffles")}
            >
              Cancelar
            </Button>
          </Group>
        </>
      )}
    </Container>
  );
};

export default EditRafflePage;
