import { Drawer, Button, Card, Text, Group, Badge, Table } from '@mantine/core';
import classes from './PurchaseDetailDrawer.module.css';
import { useFormattedDate } from '@/app/hooks/useFormattedDate';
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter';

interface Element {
  number: string;
  baseValue: string;
  tax: string;
  totalValue: string;
}

interface PurchaseDetailDrawerProps {
  name: string;
  prize: string;
  gameDate: string;
  elements: Element[];
  opened: boolean;
  close: () => void;
}

const PurchaseDetailDrawer: React.FC<PurchaseDetailDrawerProps> = ({ name, prize, gameDate, elements, opened, close }) => {
  const { formatShortDate } = useFormattedDate();
  const formatCurrency = useCurrencyFormatter();

  const totalWithoutTax = elements.reduce((acc, element) => acc + Number(element.baseValue), 0);
  console.log(totalWithoutTax);
  const tax = totalWithoutTax * 0.19;
  const totalWithTax = totalWithoutTax + tax;

  const rows = elements.map((element) => (
    <Table.Tr key={element.number}>
      <Table.Td>{element.number}</Table.Td>
      <Table.Td>{formatCurrency(element.baseValue)}</Table.Td>
      <Table.Td>{formatCurrency(element.tax)}</Table.Td>
      <Table.Td>{formatCurrency(element.totalValue)}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
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
                    <Table.Th>Precio Base</Table.Th>
                    <Table.Th>IVA</Table.Th>
                    <Table.Th>Total</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </Group>
          </Card.Section>

          <Card.Section className={classes.section}>
            <Card withBorder radius="md" p="xl" className={classes.valueCard}>
              <Text fz="xs" tt="uppercase" fw={700} className={classes.valueTitle}>
                Precio base: { formatCurrency(totalWithoutTax.toFixed()) }
              </Text>
              <Text fz="xs" tt="uppercase" fw={700} className={classes.valueTitle}>
                Total a pagar:
              </Text>
              <Text fz="lg" fw={500} className={classes.valueStats}>
                { formatCurrency(totalWithTax.toFixed()) }
              </Text>
            </Card>
          </Card.Section>
        </Card>
      </Drawer>
    </>
  );
};

export default PurchaseDetailDrawer;