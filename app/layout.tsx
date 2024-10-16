import type { Metadata } from "next";
import '@mantine/notifications/styles.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import { Notifications } from '@mantine/notifications';
import { AuthProvider } from './context/AuthContext';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import RouteGuard from './components/RouteGuard';
import ClientProvider from "./context/ClientProvider";

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
    <html lang="es">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider defaultColorScheme="light">
          <AuthProvider>
              <Notifications />
              <RouteGuard>
                <ClientProvider>
                  {children}
                </ClientProvider> 
              </RouteGuard>
          </AuthProvider>
        </MantineProvider>
      </body>
    </html>
  );
}