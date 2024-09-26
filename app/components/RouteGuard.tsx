"use client";

import { usePathname } from "next/navigation";
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {isAdminRoute && <Sidebar />}
        <div style={{ flexGrow: 1 }}>
          {children}
        </div>
      </div>
      {!isAdminRoute && <Footer />}
    </>
  );
}
