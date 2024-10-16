"use client";

import { usePathname } from "next/navigation";
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { useMantineTheme } from '@mantine/core';

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const theme = useMantineTheme();
  const isSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
  const [sidebarOpened, setSidebarOpened] = useState(false);

  const isAdminRoute = pathname.startsWith("/admin");

  const sidebarWidth = sidebarOpened ? 200 : 80;

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
