"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  BadgeCheck,
  XCircle,
  Store,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Vendor {
  id: string;
  store_name: string;
  owner_name: string;
  email: string;
  is_verified: boolean;
  subscription_status: string;
  total_products: number;
  total_sales: number;
  rating: number;
  created_at: string;
}

const MOCK_VENDORS: Vendor[] = [
  { id: "1", store_name: "Nike Store KE", owner_name: "David Kipkoech", email: "david@nikestore.co.ke", is_verified: true, subscription_status: "active", total_products: 45, total_sales: 890000, rating: 4.8, created_at: "2025-06-15" },
  { id: "2", store_name: "Adidas Official", owner_name: "Grace Akinyi", email: "grace@adidas.co.ke", is_verified: true, subscription_status: "active", total_products: 38, total_sales: 720000, rating: 4.7, created_at: "2025-07-20" },
  { id: "3", store_name: "FitGear KE", owner_name: "Samuel Otieno", email: "sam@fitgear.co.ke", is_verified: true, subscription_status: "active", total_products: 62, total_sales: 540000, rating: 4.6, created_at: "2025-08-10" },
  { id: "4", store_name: "Sprint Shoes", owner_name: "Anne Wanjiru", email: "anne@sprint.co.ke", is_verified: false, subscription_status: "expired", total_products: 15, total_sales: 120000, rating: 4.2, created_at: "2025-11-01" },
  { id: "5", store_name: "Ball Masters", owner_name: "Brian Oduor", email: "brian@ballmasters.co.ke", is_verified: false, subscription_status: "none", total_products: 22, total_sales: 85000, rating: 4.0, created_at: "2026-01-05" },
];

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVendors() {
      try {
        const data = await api.get<{ vendors: Vendor[] }>(`/api/admin/vendors?page=${page}&search=${search}`);
        if (data.vendors?.length) setVendors(data.vendors);
      } catch {
        // use mock
      } finally {
        setLoading(false);
      }
    }
    fetchVendors();
  }, [page, search]);

  const handleVerify = async (id: string) => {
    try {
      await api.put(`/api/admin/vendors/${id}/verify`);
      setVendors((prev) => prev.map((v) => (v.id === id ? { ...v, is_verified: true } : v)));
    } catch {
      // failed
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      await api.put(`/api/admin/vendors/${id}/revoke`);
      setVendors((prev) => prev.map((v) => (v.id === id ? { ...v, is_verified: false } : v)));
    } catch {
      // failed
    }
  };

  const filtered = vendors.filter(
    (v) => `${v.store_name} ${v.owner_name} ${v.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground">Vendors</h1>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search vendors..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Store</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Owner</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Products</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Subscription</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Verified</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-4 py-3" colSpan={6}><div className="h-4 bg-muted rounded animate-pulse" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No vendors found.</td></tr>
              ) : (
                filtered.map((v) => (
                  <tr key={v.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-ig-green-light flex items-center justify-center shrink-0">
                          <Store className="h-4 w-4 text-ig-green" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{v.store_name}</p>
                          <p className="text-xs text-muted-foreground">Rating: {v.rating}/5</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-foreground">{v.owner_name}</p>
                      <p className="text-xs text-muted-foreground">{v.email}</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-center font-medium text-foreground">{v.total_products}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        v.subscription_status === "active" ? "bg-ig-green-light text-ig-green" :
                        v.subscription_status === "expired" ? "bg-ig-red-light text-ig-red" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {v.subscription_status === "active" ? "Active" : v.subscription_status === "expired" ? "Expired" : "None"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {v.is_verified ? (
                        <BadgeCheck className="h-5 w-5 text-ig-green mx-auto" />
                      ) : (
                        <XCircle className="h-5 w-5 text-muted-foreground mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {v.is_verified ? (
                        <Button variant="outline" size="sm" onClick={() => handleRevoke(v.id)} className="text-ig-red border-ig-red/30 hover:bg-ig-red-light text-xs">
                          Revoke
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => handleVerify(v.id)} className="bg-ig-green hover:bg-ig-green/90 text-white text-xs">
                          Verify
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">{filtered.length} vendor(s)</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}><ChevronLeft className="h-4 w-4" /></Button>
            <span className="text-sm text-foreground">Page {page}</span>
            <Button variant="outline" size="sm" onClick={() => setPage(page + 1)}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
