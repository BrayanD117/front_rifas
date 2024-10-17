"use client";

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { Container, Text, Group, Button, Table, Checkbox, Modal, Title, Stack, Divider, Paper } from '@mantine/core';
import { useState } from 'react';
import { removeSelectedItems } from '../../features/cart/cartSlice';

const CartPage = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [opened, setOpened] = useState(false);
  const dispatch = useDispatch();

  const handleSelectItem = (raffleId: number) => {
    setSelectedItems((prev) =>
      prev.includes(raffleId) ? prev.filter((id) => id !== raffleId) : [...prev, raffleId]
    );
  };

  const handleRemoveItems = () => {
    dispatch(removeSelectedItems());
    setSelectedItems([]);
    setOpened(false);
  };

  const totalTickets = cartItems.length;
  const totalPrice = cartItems.reduce((acc, item) => acc + parseFloat(item.totalValue), 0).toFixed(2);

  return (
    <Container mt={50}>
      <Title order={2} ta="center" mb={30}>
        Tu Carrito
      </Title>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Text size="xl" w={500} mb="md">
            No tienes rifas en el carrito.
          </Text>
          <Button size="lg" onClick={() => window.location.href = '/'}>
            Volver al Inicio
          </Button>
        </div>
      ) : (
        <>
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th><Checkbox /></Table.Th>
                <Table.Th>Imagen</Table.Th>
                <Table.Th>Rifa</Table.Th>
                <Table.Th>Premio</Table.Th>
                <Table.Th>Precio Base</Table.Th>
                <Table.Th>IVA</Table.Th>
                <Table.Th>Total</Table.Th>
                <Table.Th>Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {cartItems.map((item, index) => (
                <Table.Tr key={item.raffleId}>
                  <Table.Td>
                    <Checkbox
                      checked={selectedItems.includes(item.raffleId)}
                      onChange={() => handleSelectItem(item.raffleId)}
                    />
                  </Table.Td>
                  <Table.Td>
                    <img src={item.imageUrl} alt={item.raffleName} width={50} height={50} />
                  </Table.Td>
                  <Table.Td>{item.raffleName}</Table.Td>
                  <Table.Td>{item.prize}</Table.Td>
                  <Table.Td>{item.baseValue}</Table.Td>
                  <Table.Td>{item.tax}</Table.Td>
                  <Table.Td>{item.totalValue}</Table.Td>
                  <Table.Td>
                    <Button color="red" onClick={() => setOpened(true)}>Eliminar</Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

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
                <Text>{totalPrice}</Text>
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
