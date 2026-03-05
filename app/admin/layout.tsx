import type { Metadata } from "next";
import { AdminProviders } from "./providers";

export const metadata: Metadata = {
  title: "Admin - ItenGear",
  description: "ItenGear Admin Dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminProviders>{children}</AdminProviders>;
}
