"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { formatPrice } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight, Download } from "lucide-react";

interface Payment {
  id: string;
  transaction_id: string;
  type: string;
  payer_name: string;
  amount: number;
  phone: string;
  status: string;
  created_at: string;
  description: string;
}

const MOCK_PAYMENTS: Payment[] = [
  { id: "1", transaction_id: "MPX1234567890", type: "order", payer_name: "John Kamau", amount: 12500, phone: "254712345678", status: "completed", created_at: "2026-03-04T10:30:00", description: "Order #ORD-3560" },
  { id: "2", transaction_id: "MPX1234567891", type: "subscription", payer_name: "David Kipkoech (Nike Store)", amount: 20000, phone: "254711223344", status: "completed", created_at: "2026-03-03T14:15:00", description: "Yearly Subscription" },
  { id: "3", transaction_id: "MPX1234567892", type: "order", payer_name: "Mary Njeri", amount: 28000, phone: "254723456789", status: "completed", created_at: "2026-03-03T09:45:00", description: "Order #ORD-3559" },
  { id: "4", transaction_id: "MPX1234567893", type: "order", payer_name: "Susan Wambui", amount: 35000, phone: "254745678901", status: "pending", created_at: "2026-03-01T16:20:00", description: "Order #ORD-3557" },
  { id: "5", transaction_id: "MPX1234567894", type: "subscription", payer_name: "Grace Akinyi (Adidas)", amount: 2000, phone: "254722334455", status: "completed", created_at: "2026-02-28T11:00:00", description: "Monthly Subscription" },
  { id: "6", transaction_id: "MPX1234567895", type: "order", payer_name: "James Mwangi", amount: 16000, phone: "254756789012", status: "failed", created_at: "2026-02-28T08:30:00", description: "Order #ORD-3556" },
];

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPayments() {
      try {
        const data = await api.get<{ payments: Payment[] }>(`/api/admin/payments?page=${page}&type=${typeFilter}`);
        if (data.payments?.length) setPayments(data.payments);
      } catch {
        // use mock
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, [page, typeFilter]);

  const filtered = payments.filter((p) => {
    const matchSearch = `${p.transaction_id} ${p.payer_name} ${p.description}`.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || p.type === typeFilter;
    return matchSearch && matchType;
  });

  const totalCompleted = filtered.filter((p) => p.status === "completed").reduce((a, b) => a + b.amount, 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payments</h1>
          <p className="text-sm text-muted-foreground">Total completed: <strong className="text-ig-green">{formatPrice(totalCompleted)}</strong></p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search payments..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground"
          >
            <option value="all">All Types</option>
            <option value="order">Orders</option>
            <option value="subscription">Subscriptions</option>
          </select>
          <Button variant="outline" size="sm" className="hidden sm:flex gap-1 text-foreground">
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Transaction</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Payer</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Type</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Amount</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-4 py-3" colSpan={6}><div className="h-4 bg-muted rounded animate-pulse" /></td>
                  </tr>
                ))
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-mono text-xs font-medium text-foreground">{p.transaction_id}</p>
                      <p className="text-xs text-muted-foreground">{p.description}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-foreground text-sm">{p.payer_name}</p>
                      <p className="text-xs text-muted-foreground">{p.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        p.type === "order" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                      }`}>
                        {p.type === "order" ? "Order" : "Subscription"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-foreground">{formatPrice(p.amount)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        p.status === "completed" ? "bg-ig-green-light text-ig-green" :
                        p.status === "pending" ? "bg-amber-50 text-amber-600" :
                        "bg-ig-red-light text-ig-red"
                      }`}>
                        {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground">
                      {new Date(p.created_at).toLocaleString("en-KE")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">{filtered.length} payment(s)</p>
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
