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
  Text,
  NavLink,
  UnstyledButton
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/navigation";  
import { IconShoppingCartFilled } from "@tabler/icons-react";
import classes from "./styles/Navbar.module.css";
import { PRIMARY_GREEN } from "../constants/colors";

export function Navbar() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const theme = useMantineTheme();
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleBrandClick = () => {
    router.push("/");
  };

  return (
    <Box>
      <header className={classes.header}>
        <Grid justify="space-between" align="center">
        <Grid.Col span={4}>
            <Flex
              visibleFrom="sm"
              mt={-35}
              mih={50}
              gap="md"
              justify="flex-start"
              align="center"
              direction="row"
              wrap="wrap"
            >
              <Button size="lg" variant="subtle" color="white" onClick={handleLoginClick}>Iniciar Sesión</Button>
            </Flex>
            <Flex>
              <Burger
                color={"white"}
                mt={-35}
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
            <Button variant="default" onClick={handleLoginClick}>Iniciar sesion</Button>
            <Button>Registrarme</Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
