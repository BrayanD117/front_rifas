"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Title, Table, Button, Loader, Group, Center } from "@mantine/core";
import axios from "axios";

interface Raffle {
  id: string;
  name: string;
  description: string;
  prize: string;
  baseValue: number;
  ivaValue: number;
  totalValue: number;
  gameDate: string;
  closeDate: string;
  active: boolean;
}

const AdminRafflesPage = () => {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchRaffles = async () => {
    try {
      const response = await axios.get<Raffle[]>(`${process.env.NEXT_PUBLIC_API_URL}/raffles`, {
        withCredentials: true,
      });
      setRaffles(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener las rifas", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRaffles();
  }, []);

  const handleDeleteRaffle = async (raffleId: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/raffles/${raffleId}`, {
        withCredentials: true,
      });
      fetchRaffles();
    } catch (error) {
      console.error("Error al eliminar la rifa", error);
    }
  };

  if (loading) {
    return (
      <Container>
        <Center style={{ height: "100vh" }}>
          <Loader size="xl" />
        </Center>
      </Container>
    );
  }

  return (
    <Container>
      <Title order={2} mt="xl">Administrar Rifas</Title>
      <Group mt="md">
        <Button color="green" onClick={() => router.push("/admin/raffles/create")}>
          Crear Nueva Rifa
        </Button>
      </Group>

      <Table mt="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nombre</Table.Th>
            <Table.Th>Descripción</Table.Th>
            <Table.Th>Premio</Table.Th>
            <Table.Th>Valor Total</Table.Th>
            <Table.Th>Fecha del Sorteo</Table.Th>
            <Table.Th>Acciones</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {raffles.map((raffle) => (
            <Table.Tr key={raffle.id}>
              <Table.Td>{raffle.name}</Table.Td>
              <Table.Td>{raffle.description}</Table.Td>
              <Table.Td>{raffle.prize}</Table.Td>
              <Table.Td>{raffle.totalValue}</Table.Td>
              <Table.Td>{new Date(raffle.gameDate).toLocaleDateString()}</Table.Td>
              <Table.Td>
                <Button color="blue" onClick={() => router.push(`/admin/raffles/update/${raffle.id}`)}>
                  Editar
                </Button>
                <Button color="red" variant="outline" onClick={() => handleDeleteRaffle(raffle.id)}>
                  Eliminar
                </Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Container>
  );
};

export default AdminRafflesPage;
