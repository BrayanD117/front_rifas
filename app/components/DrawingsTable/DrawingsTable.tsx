import { useEffect, useState } from "react";
import { Table, Button, TextInput, Select, Divider, Group, Center, Title } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import axios from "axios";

interface Drawing {
  drawType: string;
  drawDate: Date | null;
  description: string;
  lottery: string;
  closeDate: Date | null;
  expirationDate: Date | null;
  prizes: Prize[];
}

interface Prize {
  name: string;
  commercialValuation: string;
  specifications: string;
}

interface DrawingsTableProps {
  onDrawingsChange: (drawings: Drawing[]) => void;
}

const DrawingsTable: React.FC<DrawingsTableProps> = ({ onDrawingsChange }) => {
  const [drawings, setDrawings] = useState<Drawing[]>([
    { drawType: "", drawDate: null, description: "", lottery: "", closeDate: null, expirationDate: null, prizes: [] },
  ]);
  const [drawTypes, setDrawTypes] = useState([]);

  useEffect(() => {
    const fetchDrawTypes = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/draw-types`);
        setDrawTypes(data.map((type: any) => ({ value: type.id, label: type.name })));
      } catch (error) {
        console.error("Error fetching draw types", error);
      }
    };
    fetchDrawTypes();
  }, []);

  const handleAddRow = () => {
    const newDrawings: Drawing[] = [...drawings, { drawType: "", drawDate: null, description: "", lottery: "", closeDate: null, expirationDate: null, prizes: [] }];
    setDrawings(newDrawings);
    onDrawingsChange(newDrawings);
  };

  const handleRemoveRow = (index: number) => {
    const updatedDrawings = drawings.filter((_, i) => i !== index);
    setDrawings(updatedDrawings);
    onDrawingsChange(updatedDrawings);
  };

  const handleChange = (index: number, field: keyof Drawing, value: any) => {
    const updatedDrawings = [...drawings];
    updatedDrawings[index][field] = value;
    setDrawings(updatedDrawings);
    onDrawingsChange(updatedDrawings);
  };

  const handleAddPrize = (drawingIndex: number) => {
    const updatedDrawings = [...drawings];
    const updatedPrizes: Prize[] = [
      ...updatedDrawings[drawingIndex].prizes,
      { name: "", commercialValuation: "0", specifications: "" },
    ];
    updatedDrawings[drawingIndex].prizes = updatedPrizes;
    setDrawings(updatedDrawings);
    onDrawingsChange(updatedDrawings);
  };

  const handlePrizeChange = (drawingIndex: number, prizeIndex: number, field: keyof Prize, value: any) => {
    const updatedDrawings = [...drawings];
    const updatedPrizes = [...updatedDrawings[drawingIndex].prizes];
    updatedPrizes[prizeIndex] = { ...updatedPrizes[prizeIndex], [field]: value };
    updatedDrawings[drawingIndex].prizes = updatedPrizes;
    setDrawings(updatedDrawings);
    onDrawingsChange(updatedDrawings);
  };

  const handleRemovePrize = (drawingIndex: number, prizeIndex: number) => {
    const updatedDrawings = [...drawings];
    const updatedPrizes = updatedDrawings[drawingIndex].prizes.filter((_, i) => i !== prizeIndex);
    updatedDrawings[drawingIndex].prizes = updatedPrizes;
    setDrawings(updatedDrawings);
    onDrawingsChange(updatedDrawings);
  };

  return (
    <div>
      <Title mt={"md"} ta={"center"}>Sorteos</Title>
      {drawings.map((drawing, drawingIndex) => (
        <div key={drawingIndex}>
          <Divider mt={"md"} mb={"md"} label={`Sorteo ${drawingIndex + 1}`} labelPosition="center" />
          
          <Table striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Tipo de Sorteo</Table.Th>
                <Table.Th>Fecha del Sorteo</Table.Th>
                <Table.Th>Descripción</Table.Th>
                <Table.Th>Lotería</Table.Th>
                <Table.Th>Fecha de Cierre</Table.Th>
                <Table.Th>Término Caducidad Premio</Table.Th>
                <Center><Table.Th>Acciones</Table.Th></Center>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td>
                  <Select
                    placeholder="Selecciona tipo"
                    data={drawTypes}
                    value={drawing.drawType}
                    onChange={(value) => handleChange(drawingIndex, "drawType", value)}
                  />
                </Table.Td>
                <Table.Td>
                  <DateTimePicker
                    locale="es"
                    value={drawing.drawDate}
                    onChange={(value) => handleChange(drawingIndex, "drawDate", value)}
                  />
                </Table.Td>
                <Table.Td>
                  <TextInput
                    placeholder="Descripción del sorteo"
                    value={drawing.description}
                    onChange={(e) => handleChange(drawingIndex, "description", e.target.value)}
                  />
                </Table.Td>
                <Table.Td>
                  <TextInput
                    placeholder="Lotería"
                    value={drawing.lottery}
                    onChange={(e) => handleChange(drawingIndex, "lottery", e.target.value)}
                    required
                  />
                </Table.Td>
                <Table.Td>
                  <DateTimePicker
                    locale="es"
                    value={drawing.closeDate}
                    onChange={(value) => handleChange(drawingIndex, "closeDate", value)}
                  />
                </Table.Td>
                <Table.Td>
                  <DateTimePicker
                    locale="es"
                    value={drawing.expirationDate}
                    onChange={(value) => handleChange(drawingIndex, "expirationDate", value)}
                  />
                </Table.Td>
                <Table.Td>
                  <Center>
                    <Button
                      color="red"
                      variant="outline"
                      onClick={() => handleRemoveRow(drawingIndex)}
                    >
                      <IconTrash size={16} />
                    </Button>
                  </Center>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>

          <Divider mt={"md"} mb={"md"} label={`Premios del Sorteo ${drawingIndex + 1}`} labelPosition="center" />
          
          <Table striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nombre del Premio</Table.Th>
                <Table.Th>Avaluo Comercial</Table.Th>
                <Table.Th>Especificaciones</Table.Th>
                <Center><Table.Th>Acciones</Table.Th></Center>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {drawing.prizes.map((prize, prizeIndex) => (
                <Table.Tr key={prizeIndex}>
                  <Table.Td>
                    <TextInput
                      placeholder="Nombre del premio"
                      value={prize.name}
                      onChange={(e) => handlePrizeChange(drawingIndex, prizeIndex, "name", e.target.value)}
                    />
                  </Table.Td>
                  <Table.Td>
                    <TextInput
                      placeholder="Avaluo comercial"
                      value={prize.commercialValuation}
                      onChange={(e) => handlePrizeChange(drawingIndex, prizeIndex, "commercialValuation", e.currentTarget.value)}
                    />
                  </Table.Td>
                  <Table.Td>
                    <TextInput
                      placeholder="Especificaciones del premio"
                      value={prize.specifications}
                      onChange={(e) => handlePrizeChange(drawingIndex, prizeIndex, "specifications", e.target.value)}
                    />
                  </Table.Td>
                  <Table.Td>
                    <Center>
                      <Button
                        color="red"
                        variant="outline"
                        onClick={() => handleRemovePrize(drawingIndex, prizeIndex)}
                      >
                        <IconTrash size={16} />
                      </Button>
                    </Center>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          <Group justify="center">
            <Button mt="md" onClick={() => handleAddPrize(drawingIndex)}>
              <IconPlus size={16} /> Añadir premio
            </Button>
          </Group>
        </div>
      ))}

      <Group justify="center">
        <Button mt="md" onClick={handleAddRow}>
          <IconPlus size={16} /> Añadir sorteo
        </Button>
      </Group>
    </div>
  );
};

export default DrawingsTable;
