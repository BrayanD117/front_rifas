"use client";

import { usePathname, useRouter } from "next/navigation";
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { useMantineTheme } from '@mantine/core';

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const theme = useMantineTheme();
  const isSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
  const [sidebarOpened, setSidebarOpened] = useState(false);

  const isAdminRoute = pathname.startsWith("/admin");

  const sidebarWidth = sidebarOpened ? 200 : 80;

  useEffect(() => {
    if (!loading) {
      if (isAdminRoute && (!isLoggedIn || user?.role !== "Admin")) {
        router.push("/unauthorized");
      }
    }
  }, [isAdminRoute, isLoggedIn, user, loading, router]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <div style={{ display: "flex" }}>
        {isAdminRoute && <Sidebar opened={sidebarOpened} setOpened={setSidebarOpened} />}
        <div
          style={{
            flexGrow: 1,
            paddingLeft: isAdminRoute ? (sidebarWidth + 10) + 'px' : '0',
            transition: 'padding-left 0.3s ease',
          }}
        >
          {children}
        </div>
      </div>
      {!isAdminRoute && <Footer />}
    </>
  );
}
