import { Drawer, Button, Card, Text, Group, Badge, Table } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './PurchaseDetailDrawer.module.css';
import { useFormattedDate } from '@/app/hooks/useFormattedDate';
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter';

interface Element {
  number: string;
  value: string;
}

interface PurchaseDetailDrawerProps {
  name: string;
  prize: string;
  gameDate: string;
  elements: Element[];
}

const PurchaseDetailDrawer: React.FC<PurchaseDetailDrawerProps> = ({ name, prize, gameDate, elements }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { formatShortDate } = useFormattedDate();
  const formatCurrency = useCurrencyFormatter();

  const totalWithoutTax = elements.reduce((acc, element) => acc + Number(element.value), 0);
  console.log(totalWithoutTax);
  const tax = totalWithoutTax * 0.19;
  //console.log(tax);
  const totalWithTax = totalWithoutTax + tax;
  //console.log(totalWithTax);

  const rows = elements.map((element) => (
    <Table.Tr key={element.number}>
      <Table.Td>{element.number}</Table.Td>
      <Table.Td>{formatCurrency(element.value)}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Button onClick={open}>Abrir Información</Button>
      <Drawer position="right" offset={8} radius="md" zIndex={1100} opened={opened} onClose={close} title="Detalle de tu compra">

        <Card withBorder radius="md" className={classes.card}>

          <Group justify="space-between">
            <div>
              <Text fw={500}>{name}</Text>
              <Text fz="xs" c="dimmed">
                {prize}
              </Text>
            </div>
            <Badge variant="outline">
              {formatShortDate(gameDate)}
            </Badge>
          </Group>

          <Card.Section className={classes.section} mt="md">
            <Text fz="sm" c="dimmed" className={classes.label}>
              Números a jugar
            </Text>

            <Group gap={8} mb={-8}>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Número</Table.Th>
                    <Table.Th>Valor</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </Group>
          </Card.Section>

          <Card.Section className={classes.section}>
            <Group gap={30}>
              <div className={classes.root}>
                <div className={classes.stat}>
                  <Text className={classes.count}>{formatCurrency(totalWithoutTax)}</Text>
                  <Text className={classes.title}>Base</Text>
                  <Text className={classes.description}>Importe base sin impuestos</Text>
                </div>

                <div className={classes.stat}>
                  <Text className={classes.count}>{formatCurrency(tax)}</Text>
                  <Text className={classes.title}>IVA (19%)</Text>
                  <Text className={classes.description}>Impuesto sobre el valor añadido</Text>
                </div>

                <div className={classes.stat}>
                  <Text className={classes.count}>{formatCurrency(totalWithTax)}</Text>
                  <Text className={classes.title}>Total a pagar</Text>
                  <Text className={classes.description}>Importe total con impuestos incluidos</Text>
                </div>
              </div>

              
            </Group>
            <Button radius="xl" style={{ flex: 1 }}>
                Rent now
              </Button>
          </Card.Section>
        </Card>
      </Drawer>
    </>
  );
};

export default PurchaseDetailDrawer;