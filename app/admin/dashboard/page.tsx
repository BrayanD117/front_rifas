"use client";

import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader, Container, Title, Text } from "@mantine/core";

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
      <Container>
        <Title>Panel de Administración</Title>
        <Text>¡Bienvenido administrador! Aquí puedes gestionar todo.</Text>
      </Container>
    );
}

export default AdminDashboard