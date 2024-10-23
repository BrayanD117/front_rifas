import { useState } from "react";
import { Table, Button, TextInput, Select, Divider, Group, Center, NumberInput, Title } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useCurrencyFormatter } from "@/app/hooks/useCurrencyFormatter";

interface Drawing {
  drawType: string;
  drawDate: Date | null;
  description: string;
  lottery: string;
  prizes: Prize[];
}

interface Prize {
  name: string;
  commercialValuation: number;
  specifications: string;
}

interface DrawingsTableProps {
  onDrawingsChange: (drawings: Drawing[]) => void;
}

const DrawingsTable: React.FC<DrawingsTableProps> = ({ onDrawingsChange }) => {
  const [drawings, setDrawings] = useState<Drawing[]>([
    { drawType: "", drawDate: null, description: "", lottery: "", prizes: [] },
  ]);

  const formatCurrency = useCurrencyFormatter();

  const handleAddRow = () => {
    const newDrawings: Drawing[] = [...drawings, { drawType: "", drawDate: null, description: "", lottery: "", prizes: [] }];
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
    const updatedPrizes: Prize[] = [...updatedDrawings[drawingIndex].prizes, { name: "", commercialValuation: 0, specifications: "" }];
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

  const handleCommercialValuationChange = (drawingIndex: number, prizeIndex: number, value: number | string) => {
    const numericValue = typeof value === 'string' ? parseFloat(value.replace(/\D/g, "")) : value;
    handlePrizeChange(drawingIndex, prizeIndex, "commercialValuation", numericValue);
  };

  return (
    <div>
      <Title mt={"md"} ta={"center"}>Sorteos</Title>
      {drawings.map((drawing, drawingIndex) => (
        <div key={drawingIndex}>
          <Divider mt={"md"} mb={"md"} label={`Sorteo ${drawingIndex + 1}`} labelPosition="center" />
          
          <Table striped withRowBorders withColumnBorders withTableBorder highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Tipo de Sorteo</Table.Th>
                <Table.Th>Fecha del Sorteo</Table.Th>
                <Table.Th>Descripción</Table.Th>
                <Table.Th>Lotería</Table.Th>
                <Center><Table.Th>Acciones</Table.Th></Center>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td>
                  <Select
                    placeholder="Selecciona tipo"
                    data={[
                      { value: "principal", label: "Principal" },
                      { value: "anticipado", label: "Anticipado" },
                    ]}
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
                    onChange={(e) => handleChange(drawingIndex, "description", e.currentTarget.value)}
                  />
                </Table.Td>
                <Table.Td>
                  <TextInput
                    placeholder="Lotería"
                    value={drawing.lottery}
                    onChange={(e) => handleChange(drawingIndex, "lottery", e.currentTarget.value)}
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
          
          <Table striped withRowBorders withColumnBorders withTableBorder highlightOnHover>
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
                      onChange={(e) => handlePrizeChange(drawingIndex, prizeIndex, "name", e.currentTarget.value)}
                    />
                  </Table.Td>
                  <Table.Td>
                    <NumberInput
                      placeholder="Avaluo comercial"
                      value={prize.commercialValuation}
                      onChange={(value) => handleCommercialValuationChange(drawingIndex, prizeIndex, value || 0)}
                    />
                  </Table.Td>
                  <Table.Td>
                    <TextInput
                      placeholder="Especificaciones del premio"
                      value={prize.specifications}
                      onChange={(e) => handlePrizeChange(drawingIndex, prizeIndex, "specifications", e.currentTarget.value)}
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
