"use client"

import { Container, Title, Text, Group, Button } from "@mantine/core";
import { useRouter } from "next/navigation";
import { PRIMARY_GREEN } from '@/app/constants/colors';
import { IconArrowBigLeftLinesFilled } from "@tabler/icons-react";

export default function UnauthorizedPage() {
  const router = useRouter();
    return (
      <Container mt={90}>
          <Title ta={"center"} order={2}>No autorizado</Title>
          <Text mt={"md"} ta={"center"}>No tienes permisos para acceder a esta página.</Text>
        <Group mt={"md"} justify="center">
          <Button leftSection={<IconArrowBigLeftLinesFilled size={20} />} color={PRIMARY_GREEN} onClick={() => router.push("/")}>Volver al inicio</Button>
        </Group>
      </Container>
      
    );
  }
  