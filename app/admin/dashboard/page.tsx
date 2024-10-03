"use client";

import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader, Container, Title, Text, Card, Divider, Grid, Button, Group } from "@mantine/core";

const AdminDashboard = () => {
  const { isLoggedIn, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!isLoggedIn || role !== "Admin")) {
      router.push("/unauthorized");
    }
  }, [isLoggedIn, role, loading, router]);

  if (loading) {
    return (
      <Container>
        <Loader size="xl" />
      </Container>
    );
  }

  return (
    <Container mt={20}>
      <Card shadow="sm" padding="md">
        <Title ta={"center"}>Panel de Administración</Title>
        <Text ta={"center"}>¡Bienvenido administrador! Aquí puedes gestionar todo.</Text>
        <Divider m={15} />
        <Grid>
          <Grid.Col span={4}>
            <Card shadow="sm" padding="lg">
              <Title order={4}>Total Rifas</Title>
              <Text>120</Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={4}>
            <Card shadow="sm" padding="lg">
              <Title order={4}>Rifas Activas</Title>
              <Text>20</Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={4}>
            <Card shadow="sm" padding="lg">
              <Title order={4}>Ventas Totales</Title>
              <Text>$5,000,000</Text>
            </Card>
          </Grid.Col>
        </Grid>

        <Group mt="xl">
          <Button onClick={() => router.push("/admin/raffles")}>Gestionar Rifas</Button>
        </Group>
      </Card>
    </Container>
  );
};

export default AdminDashboard;