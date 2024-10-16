import type { Metadata } from "next";
import '@mantine/notifications/styles.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import { Notifications } from '@mantine/notifications';
import { AuthProvider } from './context/AuthContext';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import RouteGuard from './components/RouteGuard';
import { Provider } from "react-redux";
import store from "../store";

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
            <Provider store={store}>
              <Notifications />
              <RouteGuard>
                {children}
              </RouteGuard>
            </Provider>
          </AuthProvider>
        </MantineProvider>
      </body>
    </html>
  );
}