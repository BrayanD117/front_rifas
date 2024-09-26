import { useState } from 'react';
import { Group, Title } from '@mantine/core';
import {
  IconSettings,
  IconLogout,
  IconTicket,
  IconHome,
  IconSettingsFilled,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import classes from './styles/Sidebar.module.css';

const data = [
  { link: '/admin/dashboard', label: 'Inicio', icon: IconHome },
  { link: '/admin/raffles', label: 'Rifas', icon: IconTicket },
  { link: '/admin/settings', label: 'Other Settings', icon: IconSettings },
];

export function Sidebar() {
  const [active, setActive] = useState('Billing');
  const router = useRouter();
  const { logout } = useAuth();
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
            <Title ta={"center"} order={4}>Panel de administración</Title>
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <a
          href="#"
          className={classes.link}
          onClick={(event) => {
            event.preventDefault();
            handleLogout();
          }}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Cerrar sesión</span>
        </a>
      </div>
    </nav>
  );
}