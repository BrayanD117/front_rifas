import type { Metadata } from "next";
import '@mantine/notifications/styles.css';
import '@mantine/core/styles.css';
import { Notifications } from '@mantine/notifications';
import { AuthProvider } from './context/AuthContext';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import RouteGuard from './components/RouteGuard';

export const metadata: Metadata = {
  title: "Rifas",
  description: "App web de venta de rifas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider defaultColorScheme="light">
          <AuthProvider>
            <Notifications />
            <RouteGuard>
              {children}
            </RouteGuard>
          </AuthProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
