"use client";

import {
  Group,
  Button,
  Divider,
  Box,
  Burger,
  Drawer,
  ScrollArea,
  rem,
  useMantineTheme,
  Image,
  Flex,
  Center,
  Grid,
  UnstyledButton,
  Modal,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useAuth } from "../context/AuthContext"; // Importamos el contexto de autenticación
import { useRouter } from "next/navigation";
import { IconShoppingCartFilled } from "@tabler/icons-react";
import classes from "./styles/Navbar.module.css";
import { PRIMARY_GREEN } from "../constants/colors";

export function Navbar() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [logoutModalOpened, { open: openLogoutModal, close: closeLogoutModal }] = useDisclosure(false);
  const theme = useMantineTheme();
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleLogout = async () => {
    await logout();
    closeLogoutModal();
    router.push("/login");
  };

  const handleBrandClick = () => {
    router.push("/");
  };

  const handleGoToCart = () => {
    router.push('/cart');
  };

  return (
    <Box>
      <header className={classes.header}>
        <Grid justify="space-between" align="center">
          <Grid.Col span={4}>
            <Flex
              visibleFrom="sm"
              mt={-20}
              mih={50}
              gap="md"
              justify="flex-start"
              align="center"
              direction="row"
              wrap="wrap"
            >
              {isLoggedIn ? (
                <Button
                  size="lg"
                  variant="subtle"
                  color="white"
                  onClick={openLogoutModal}
                >
                  Cerrar Sesión
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="subtle"
                  color="white"
                  onClick={handleLoginClick}
                >
                  Iniciar Sesión
                </Button>
              )}
            </Flex>
            <Flex>
              <Burger
                color={"white"}
                mt={-20}
                opened={drawerOpened}
                onClick={toggleDrawer}
                hiddenFrom="sm"
              />
            </Flex>
          </Grid.Col>
          <Grid.Col span={4}>
            <Group justify="center">
              <Center>
                <UnstyledButton component="a" onClick={handleBrandClick}>
                  <Image
                    mt={-20}
                    alt="Rifa Mania"
                    h={90}
                    w="auto"
                    src="/assets/Logo-Rifa-Manía.webp"
                  />
                </UnstyledButton>
              </Center>
            </Group>
          </Grid.Col>
          <Grid.Col span={4}>
            <Group justify="flex-end">
              <Button
                h={110}
                mt={-10}
                color={PRIMARY_GREEN}
                className={classes.buttonHover}
                styles={{
                  root: {
                    right: "-20px",
                    bottom: "0px",
                    height: "80px",
                    width: "100px",
                    borderBottomLeftRadius: "40px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1001,
                  },
                }}
                onClick={handleGoToCart}
              >
                <IconShoppingCartFilled
                  className={classes.cartIcon}
                  style={{ width: rem(45), height: rem(45) }}
                  stroke={1.5}
                />
              </Button>
            </Group>
          </Grid.Col>
        </Grid>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Rifas"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />
          <Group justify="center" grow pb="xl" px="md">
            {isLoggedIn ? (
              <Button variant="default" onClick={openLogoutModal}>
                Cerrar Sesión
              </Button>
            ) : (
              <Button variant="default" onClick={handleLoginClick}>
                Iniciar sesión
              </Button>
            )}
            {!isLoggedIn && <Button>Registrarme</Button>}
          </Group>
        </ScrollArea>
      </Drawer>
      <Modal
        opened={logoutModalOpened}
        onClose={closeLogoutModal}
        title="Confirmar Cierre de Sesión"
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Text>¿Estás seguro que deseas cerrar sesión?</Text>
        <Group justify="center" mt="md">
          <Button color="red" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
          <Button variant="default" onClick={closeLogoutModal}>
            Cancelar
          </Button>
        </Group>
      </Modal>
    </Box>
  );
}
