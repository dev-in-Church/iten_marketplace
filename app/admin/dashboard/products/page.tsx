"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { formatPrice } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, EyeOff, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

interface AdminProduct {
  id: string;
  name: string;
  price: number;
  vendor_name: string;
  category_name: string;
  quantity: number;
  is_active: boolean;
  total_sold: number;
}

const MOCK: AdminProduct[] = [
  { id: "1", name: "Nike Air Zoom Pegasus 40", price: 12500, vendor_name: "Nike Store KE", category_name: "Running", quantity: 50, is_active: true, total_sold: 340 },
  { id: "2", name: "Adidas Predator Edge", price: 18000, vendor_name: "Adidas Official", category_name: "Football", quantity: 30, is_active: true, total_sold: 215 },
  { id: "3", name: "Under Armour Curry 11", price: 22000, vendor_name: "UA Sports", category_name: "Basketball", quantity: 25, is_active: true, total_sold: 156 },
  { id: "4", name: "Wilson Pro Staff Tennis Racket", price: 35000, vendor_name: "Wilson Sports", category_name: "Tennis", quantity: 15, is_active: true, total_sold: 89 },
  { id: "5", name: "PowerBlock Adjustable Dumbbells", price: 28000, vendor_name: "FitGear KE", category_name: "Gym & Fitness", quantity: 20, is_active: false, total_sold: 95 },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>(MOCK);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await api.get<{ products: AdminProduct[] }>(`/api/admin/products?page=${page}&search=${search}`);
        if (data.products?.length) setProducts(data.products);
      } catch {
        // use mock
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [page, search]);

  const toggleProduct = async (id: string) => {
    try {
      await api.put(`/api/admin/products/${id}/toggle`);
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, is_active: !p.is_active } : p)));
    } catch {
      // failed
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.del(`/api/admin/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      // failed
    }
  };

  const filtered = products.filter(
    (p) => `${p.name} ${p.vendor_name} ${p.category_name}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground">Products</h1>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Product</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Vendor</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Price</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Stock</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Sold</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-4 py-3" colSpan={7}><div className="h-4 bg-muted rounded animate-pulse" /></td>
                  </tr>
                ))
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.category_name}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{p.vendor_name}</td>
                    <td className="px-4 py-3 text-right font-medium text-foreground">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3 text-center hidden lg:table-cell text-foreground">{p.quantity}</td>
                    <td className="px-4 py-3 text-center hidden lg:table-cell text-foreground">{p.total_sold}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${p.is_active ? "bg-ig-green-light text-ig-green" : "bg-ig-red-light text-ig-red"}`}>
                        {p.is_active ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => toggleProduct(p.id)}>
                          {p.is_active ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-ig-green" />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteProduct(p.id)}>
                          <Trash2 className="h-4 w-4 text-ig-red" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">{filtered.length} product(s)</p>
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
