"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { formatPrice } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Package, Search } from "lucide-react";

interface VendorProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_price?: number;
  currency: string;
  thumbnail?: string;
  quantity: number;
  is_active: boolean;
  total_sold: number;
}

export default function VendorProductsPage() {
  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", price: "", comparePrice: "", quantity: "", categoryId: "",
    shortDescription: "", description: "", brand: "", thumbnailUrl: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const data = await api.get<{ products: VendorProduct[] }>("/api/vendor/products");
      setProducts(data.products || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const resetForm = () => {
    setForm({ name: "", price: "", comparePrice: "", quantity: "", categoryId: "", shortDescription: "", description: "", brand: "", thumbnailUrl: "" });
    setEditId(null);
    setShowForm(false);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
        quantity: parseInt(form.quantity) || 0,
        categoryId: form.categoryId || null,
        shortDescription: form.shortDescription,
        description: form.description,
        brand: form.brand,
        thumbnailUrl: form.thumbnailUrl,
      };

      if (editId) {
        await api.put(`/api/vendor/products/${editId}`, payload);
      } else {
        await api.post("/api/vendor/products", payload);
      }
      resetForm();
      fetchProducts();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/api/vendor/products/${id}`);
      fetchProducts();
    } catch {
      // silent
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Products</h1>
        <Button onClick={() => { resetForm(); setShowForm(true); }} className="bg-ig-green hover:bg-ig-green/90 text-white gap-1.5">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white border border-border rounded-lg p-6 mb-6">
          <h2 className="font-semibold text-foreground mb-4">{editId ? "Edit Product" : "Add New Product"}</h2>
          {error && <div className="bg-ig-red-light text-ig-red text-sm p-3 rounded-lg mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-foreground">Product Name *</Label>
                <Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required className="mt-1.5" placeholder="Nike Air Max 90" />
              </div>
              <div>
                <Label className="text-foreground">Brand</Label>
                <Input value={form.brand} onChange={(e) => setForm({...form, brand: e.target.value})} className="mt-1.5" placeholder="Nike" />
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label className="text-foreground">Price (KES) *</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} required className="mt-1.5" placeholder="12000" />
              </div>
              <div>
                <Label className="text-foreground">Compare Price (KES)</Label>
                <Input type="number" value={form.comparePrice} onChange={(e) => setForm({...form, comparePrice: e.target.value})} className="mt-1.5" placeholder="15000" />
              </div>
              <div>
                <Label className="text-foreground">Stock Quantity *</Label>
                <Input type="number" value={form.quantity} onChange={(e) => setForm({...form, quantity: e.target.value})} className="mt-1.5" placeholder="50" />
              </div>
            </div>
            <div>
              <Label className="text-foreground">Thumbnail URL</Label>
              <Input value={form.thumbnailUrl} onChange={(e) => setForm({...form, thumbnailUrl: e.target.value})} className="mt-1.5" placeholder="https://example.com/image.jpg" />
            </div>
            <div>
              <Label className="text-foreground">Short Description</Label>
              <Input value={form.shortDescription} onChange={(e) => setForm({...form, shortDescription: e.target.value})} className="mt-1.5" placeholder="Brief product description" />
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={saving} className="bg-ig-green hover:bg-ig-green/90 text-white">
                {saving ? "Saving..." : editId ? "Update Product" : "Create Product"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm} className="text-foreground">Cancel</Button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      {/* Products table */}
      {loading ? (
        <div className="bg-white border border-border rounded-lg p-8 text-center text-muted-foreground">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-border rounded-lg p-12 text-center">
          <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-semibold text-foreground mb-1">No products yet</p>
          <p className="text-sm text-muted-foreground">Add your first product to start selling.</p>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="text-left px-4 py-3">Product</th>
                  <th className="text-left px-4 py-3">Price</th>
                  <th className="text-center px-4 py-3">Stock</th>
                  <th className="text-center px-4 py-3">Sold</th>
                  <th className="text-center px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id} className="border-t border-border hover:bg-secondary/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground max-w-[200px] truncate">{product.name}</td>
                    <td className="px-4 py-3 text-foreground">{formatPrice(product.price, product.currency)}</td>
                    <td className="px-4 py-3 text-center text-foreground">{product.quantity}</td>
                    <td className="px-4 py-3 text-center text-foreground">{product.total_sold}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${product.is_active ? "bg-ig-green-light text-ig-green" : "bg-muted text-muted-foreground"}`}>
                        {product.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditId(product.id);
                            setForm({
                              name: product.name,
                              price: String(product.price),
                              comparePrice: product.compare_price ? String(product.compare_price) : "",
                              quantity: String(product.quantity),
                              categoryId: "",
                              shortDescription: "",
                              description: "",
                              brand: "",
                              thumbnailUrl: product.thumbnail || "",
                            });
                            setShowForm(true);
                          }}
                          className="p-1.5 text-muted-foreground hover:text-ig-green transition-colors"
                          aria-label="Edit product"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-1.5 text-muted-foreground hover:text-ig-red transition-colors" aria-label="Delete product">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
