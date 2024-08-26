import type { Metadata } from "next";
import '@mantine/core/styles.css';
import { Navbar } from './components/Navbar';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';

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
        <MantineProvider>
          <>
            <Navbar/>
            {children}
          </>
        </MantineProvider>
      </body>
    </html>
  );
}
