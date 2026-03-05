"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserX, Mail, Phone, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  is_active: boolean;
  created_at: string;
  total_orders: number;
}

const MOCK_CUSTOMERS: Customer[] = [
  { id: "1", first_name: "John", last_name: "Kamau", email: "john@example.com", phone: "0712345678", is_active: true, created_at: "2026-01-15", total_orders: 12 },
  { id: "2", first_name: "Mary", last_name: "Njeri", email: "mary@example.com", phone: "0723456789", is_active: true, created_at: "2026-01-20", total_orders: 8 },
  { id: "3", first_name: "Peter", last_name: "Ochieng", email: "peter@example.com", phone: "0734567890", is_active: false, created_at: "2025-12-10", total_orders: 3 },
  { id: "4", first_name: "Susan", last_name: "Wambui", email: "susan@example.com", phone: "0745678901", is_active: true, created_at: "2026-02-01", total_orders: 15 },
  { id: "5", first_name: "James", last_name: "Mwangi", email: "james@example.com", phone: "0756789012", is_active: true, created_at: "2026-02-14", total_orders: 6 },
];

export default function AdminUsersPage() {
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const data = await api.get<{ customers: Customer[] }>(`/api/admin/customers?page=${page}&search=${search}`);
        if (data.customers?.length) setCustomers(data.customers);
      } catch {
        // use mock
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, [page, search]);

  const toggleActive = async (id: string) => {
    try {
      await api.put(`/api/admin/customers/${id}/toggle-active`);
      setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, is_active: !c.is_active } : c)));
    } catch {
      // failed
    }
  };

  const filtered = customers.filter(
    (c) => `${c.first_name} ${c.last_name} ${c.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground">Customers</h1>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Contact</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Joined</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Orders</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-4 py-3" colSpan={6}>
                      <div className="h-4 bg-muted rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-muted-foreground">
                    No customers found.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-ig-green text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {c.first_name[0]}{c.last_name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{c.first_name} {c.last_name}</p>
                          <p className="text-xs text-muted-foreground md:hidden">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Mail className="h-3 w-3" /> <span className="text-xs">{c.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
                        <Phone className="h-3 w-3" /> <span className="text-xs">{c.phone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground">
                      {new Date(c.created_at).toLocaleDateString("en-KE")}
                    </td>
                    <td className="px-4 py-3 text-center font-medium text-foreground">{c.total_orders}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        c.is_active ? "bg-ig-green-light text-ig-green" : "bg-ig-red-light text-ig-red"
                      }`}>
                        {c.is_active ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleActive(c.id)}
                        className={c.is_active ? "text-ig-red hover:text-ig-red" : "text-ig-green hover:text-ig-green"}
                      >
                        {c.is_active ? <UserX className="h-4 w-4" /> : <MoreHorizontal className="h-4 w-4" />}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">{filtered.length} customer(s)</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-foreground">Page {page}</span>
            <Button variant="outline" size="sm" onClick={() => setPage(page + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
