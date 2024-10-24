"use client";

import { useState } from "react";
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Anchor,
  Container,
  Card,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { PRIMARY_GREEN, SECONDARY_GREEN } from "../constants/colors";
import classes from "./Login.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const toggleForm = () => {
    setIsRegister((prev) => !prev);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      const { role } = response.data.user;

      login({ id: response.data.user.id, role: response.data.user.role });

      if (role === "Admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError("Credenciales inválidas");
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      showNotification({
        title: "Registro exitoso",
        message: "Te has registrado correctamente.",
        color: "green",
      });

      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setError("");

      router.push("/");
    } catch (err) {
      if ((err as any).response?.data?.error) {
        setError((err as any).response.data.error);
      } else {
        setError("Error al registrar el usuario");
      }
    }
  };

  return (
    <Container size="xl" mt={80}>
      <div className={classes.wrapper}>
        <div
          className={`${classes.cardContainer} ${
            isRegister ? classes.slideRight : ""
          }`}
        >
          {/* Card de Iniciar Sesión */}
          <Card className={classes.card}>
            <Paper radius={0} p={30}>
              <Title
                c={PRIMARY_GREEN}
                order={1}
                className={classes.title}
                ta="center"
                mt="md"
                mb={50}
              >
                ¡Bienvenido de vuelta a Tu Fortuna!
              </Title>

              <TextInput
                c={SECONDARY_GREEN}
                label="Correo electronico"
                placeholder="ejemplo@gmail.com"
                size="md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <PasswordInput
                c={SECONDARY_GREEN}
                label="Contraseña"
                placeholder="********"
                mt="md"
                size="md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <Text color="red">{error}</Text>}
              <Button
                color={PRIMARY_GREEN}
                fullWidth
                mt="xl"
                size="md"
                onClick={handleLogin}
              >
                Iniciar Sesión
              </Button>

              <Text ta="center" mt="md">
                ¿No tienes una cuenta?{" "}
                <Anchor<"a"> fw={700} c={PRIMARY_GREEN} onClick={toggleForm}>
                  Registrarme
                </Anchor>
              </Text>
            </Paper>
          </Card>

          {/* Card de Registro */}
          <Card className={`${classes.card} ${classes.registerCard}`}>
            <Paper radius={0} p={30}>
              <Title
                c={PRIMARY_GREEN}
                order={1}
                className={classes.title}
                ta="center"
                mt="md"
                mb={50}
              >
                ¡Crea tu cuenta!
              </Title>

              <TextInput
                c={SECONDARY_GREEN}
                label="Correo electronico"
                placeholder="ejemplo@gmail.com"
                size="md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <PasswordInput
                c={SECONDARY_GREEN}
                label="Contraseña"
                placeholder="********"
                mt="md"
                size="md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <PasswordInput
                c={SECONDARY_GREEN}
                label="Confirmar Contraseña"
                placeholder="********"
                mt="md"
                size="md"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {error && <Text color="red">{error}</Text>}
              <Button
                color={PRIMARY_GREEN}
                fullWidth
                mt="xl"
                size="md"
                onClick={handleRegister}
              >
                Registrarme
              </Button>

              <Text ta="center" mt="md">
                ¿Ya tienes una cuenta?{" "}
                <Anchor<"a"> fw={700} c={PRIMARY_GREEN} onClick={toggleForm}>
                  Iniciar Sesión
                </Anchor>
              </Text>
            </Paper>
          </Card>
        </div>
      </div>
    </Container>
  );
}
