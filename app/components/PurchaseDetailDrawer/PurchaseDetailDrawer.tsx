import { Drawer, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

interface PurchaseDetailDrawerProps {
  prize: string;
  lottery: string;
  gameDate: string;
}

const PurchaseDetailDrawer: React.FC<PurchaseDetailDrawerProps> = ({ prize, lottery, gameDate }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button onClick={open}>Abrir Información</Button>
      <Drawer position="right" offset={8} radius="md" zIndex={1100} opened={opened} onClose={close} title="Información Adicional">
        {/* Contenido del Drawer */}
        <div>
          <p><strong>Premio:</strong> {prize}</p>
          <p><strong>Lotería:</strong> {lottery}</p>
          <p><strong>Fecha del Juego:</strong> {gameDate}</p>
        </div>
      </Drawer>
    </>
  );
};

export default PurchaseDetailDrawer;