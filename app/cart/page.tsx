"use client";

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { Container, Text, Group, Button, Table, Checkbox, Modal, Title, Stack, Divider, Paper, Image, Center } from '@mantine/core';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { removeSelectedItems } from '../../features/cart/cartSlice';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';

const CartPage = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [opened, setOpened] = useState(false);
  const dispatch = useDispatch();
  const formatCurrency = useCurrencyFormatter();
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  const handleSelectItem = (cartItemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(cartItemId) ? prev.filter((id) => id !== cartItemId) : [...prev, cartItemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      const allIds = cartItems.map((item) => item.cartItemId);
      setSelectedItems(allIds);
    }
  };

  const handleRemoveItems = () => {
    dispatch(removeSelectedItems(selectedItems));
    setSelectedItems([]);
    setOpened(false);
  };

  const totalTickets = cartItems.length;
  const totalPrice = cartItems.reduce((acc, item) => acc + parseFloat(item.totalValue), 0).toFixed(2);

  const getFullImageUrl = (imageUrl: string) => {
    return `${process.env.NEXT_PUBLIC_UPLOADS_URL}/${imageUrl}`;
  };

  return (
    <Container mt={80}>
      <Title order={2} ta="center" mb={30}>
        Tu Carrito
      </Title>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center' }}>
          <Text size="xl" ta='center'mb="md">
            No tienes rifas en el carrito.
          </Text>
          <Button size="lg" onClick={handleGoHome}>
            Volver al Inicio
          </Button>
        </div>
      ) : (
        <>
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>
                  <Checkbox
                    checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                    indeterminate={selectedItems.length > 0 && selectedItems.length < cartItems.length}
                    onChange={handleSelectAll}
                  />
                </Table.Th>
                <Table.Th>Imagen</Table.Th>
                <Table.Th>Rifa</Table.Th>
                <Table.Th>Numero Jugado</Table.Th>
                <Table.Th>Premio</Table.Th>
                <Table.Th>Precio Base</Table.Th>
                <Table.Th>IVA</Table.Th>
                <Table.Th>Total</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {cartItems.map((item, index) => (
                <Table.Tr key={item.cartItemId}>
                  <Table.Td>
                    <Checkbox
                      checked={selectedItems.includes(item.cartItemId)}
                      onChange={() => handleSelectItem(item.cartItemId)}
                    />
                  </Table.Td>
                  <Table.Td>
                    <Image
                      src={getFullImageUrl(item.imageUrl)}
                      alt={item.raffleName}
                      width={50}
                      height={50}
                      radius="md"
                    />
                  </Table.Td>
                  <Table.Td>{item.raffleName}</Table.Td>
                  <Table.Td><Text fw={700}>{item.number}</Text></Table.Td>
                  <Table.Td>{item.prize}</Table.Td>
                  <Table.Td>{formatCurrency(item.baseValue)}</Table.Td>
                  <Table.Td>{formatCurrency(item.tax)}</Table.Td>
                  <Table.Td>{formatCurrency(item.totalValue)}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          <Group justify="center" mt="xl">
            <Button color="red" onClick={() => setOpened(true)} disabled={selectedItems.length === 0}>
              Eliminar seleccionados
            </Button>
          </Group>

          <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            title="Confirmar eliminación"
            centered
          >
            <Text>¿Estás seguro de que deseas eliminar los artículos seleccionados?</Text>
            <Group justify="center" mt="md">
              <Button onClick={handleRemoveItems} color="red">
                Sí, eliminar
              </Button>
              <Button onClick={() => setOpened(false)}>Cancelar</Button>
            </Group>
          </Modal>

          <Paper shadow="md" p="lg" mt="xl" radius="md">
            <Stack>
              <Title order={3}>Resumen de la compra</Title>
              <Divider my="xs" />
              <Group justify="apart">
                <Text>Total de Rifas:</Text>
                <Text>{totalTickets}</Text>
              </Group>
              <Group justify="apart">
                <Text>Total a pagar:</Text>
                <Text>{formatCurrency(totalPrice)}</Text>
              </Group>
              <Button fullWidth size="lg" color="blue">
                Ir a Pagar
              </Button>
            </Stack>
          </Paper>
        </>
      )}
    </Container>
  );
};

export default CartPage;
