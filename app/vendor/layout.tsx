import type { Metadata } from "next";
import { VendorProviders } from "./providers";

export const metadata: Metadata = {
  title: "Vendor - ItenGear",
  description: "ItenGear Vendor Dashboard - Manage your store",
};

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <VendorProviders>{children}</VendorProviders>;
}
