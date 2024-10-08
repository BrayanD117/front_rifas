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
      <div style={{ display: "flex" }}>
        {isAdminRoute && <Sidebar />}
        <div style={{ flexGrow: 1, paddingLeft: isAdminRoute ? '300px' : '0', transition: 'padding-left 0.3s ease' }}>
          {children}
        </div>
      </div>
      {!isAdminRoute && <Footer />}
    </>
  );
}
