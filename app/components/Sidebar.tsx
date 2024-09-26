import { useState, useEffect } from 'react';
import { Group, Title, Modal, Button, Text } from '@mantine/core';
import {
  IconSettings,
  IconLogout,
  IconTicket,
  IconHome,
  IconSettingsFilled,
} from '@tabler/icons-react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import classes from './styles/Sidebar.module.css';

const data = [
  { link: '/admin/dashboard', label: 'Inicio', icon: IconHome },
  { link: '/admin/raffles', label: 'Rifas', icon: IconTicket },
  { link: '/admin/settings', label: 'Other Settings', icon: IconSettings },
];

export function Sidebar() {
  const [active, setActive] = useState('');
  const [logoutModalOpened, setLogoutModalOpened] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const currentRoute = data.find((item) => pathname.startsWith(item.link));
    if (currentRoute) {
      setActive(currentRoute.label);
    }
  }, [pathname]);
  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {}, { withCredentials: true });
      logout();
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  };

  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
        router.push(item.link);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group justify="center" className={classes.header}>
          <IconSettingsFilled className={classes.headerIcon} stroke={1.5} />
          <Title ta={"center"} order={4}>
            Panel de administración
          </Title>
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <a
          href="#"
          className={classes.link}
          onClick={(event) => {
            event.preventDefault();
            setLogoutModalOpened(true);
          }}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Cerrar sesión</span>
        </a>
      </div>

      <Modal
        opened={logoutModalOpened}
        onClose={() => setLogoutModalOpened(false)}
        title="Confirmar cierre de sesión"
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Text>¿Estás seguro que deseas cerrar sesión?</Text>
        <Group justify="center" mt="md">
          <Button color="red" onClick={handleLogout}>
            Cerrar sesión
          </Button>
          <Button variant="default" onClick={() => setLogoutModalOpened(false)}>
            Cancelar
          </Button>
        </Group>
      </Modal>
    </nav>
  );
}