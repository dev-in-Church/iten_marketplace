"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard, ProductCardSkeleton } from "@/components/product-card";
import { MOCK_PRODUCTS, MOCK_CATEGORIES, type Product } from "@/lib/mock-data";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, X } from "lucide-react";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "";
  const searchParam = searchParams.get("search") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params: Record<string, string> = { limit: "50" };
        if (selectedCategory) params.category = selectedCategory;
        if (searchQuery) params.search = searchQuery;
        if (sortBy) params.sort = sortBy;
        const data = await api.get<{ products: Product[] }>("/api/products", params);
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        } else {
          let filtered = [...MOCK_PRODUCTS];
          if (selectedCategory) filtered = filtered.filter((p) => p.category_slug === selectedCategory);
          if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q));
          }
          setProducts(filtered);
        }
      } catch {
        let filtered = [...MOCK_PRODUCTS];
        if (selectedCategory) filtered = filtered.filter((p) => p.category_slug === selectedCategory);
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q));
        }
        if (sortBy === "price_asc") filtered.sort((a, b) => a.price - b.price);
        if (sortBy === "price_desc") filtered.sort((a, b) => b.price - a.price);
        setProducts(filtered);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
        <a href="/" className="hover:text-ig-green">Home</a>
        <span>/</span>
        <span className="text-foreground font-medium">
          {selectedCategory
            ? MOCK_CATEGORIES.find((c) => c.slug === selectedCategory)?.name || "Products"
            : "All Products"}
        </span>
      </nav>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          {selectedCategory
            ? MOCK_CATEGORIES.find((c) => c.slug === selectedCategory)?.name || "Products"
            : searchQuery
            ? `Results for "${searchQuery}"`
            : "All Products"}
        </h1>
        <Button
          variant="outline"
          size="sm"
          className="md:hidden gap-1.5"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <aside className={`${showFilters ? "fixed inset-0 z-50 bg-white p-6 overflow-y-auto" : "hidden"} md:block md:static md:w-56 shrink-0`}>
          {showFilters && (
            <div className="flex items-center justify-between mb-4 md:hidden">
              <h2 className="font-semibold text-foreground">Filters</h2>
              <button onClick={() => setShowFilters(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
          {/* Search */}
          <div className="mb-6">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Search</label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-8"
              />
              <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Category</label>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => { setSelectedCategory(""); setShowFilters(false); }}
                  className={`block w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${!selectedCategory ? "bg-ig-green text-white font-medium" : "text-foreground hover:bg-secondary"}`}
                >
                  All Categories
                </button>
              </li>
              {MOCK_CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <button
                    onClick={() => { setSelectedCategory(cat.slug); setShowFilters(false); }}
                    className={`block w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${selectedCategory === cat.slug ? "bg-ig-green text-white font-medium" : "text-foreground hover:bg-secondary"}`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Sort */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-border text-sm bg-white text-foreground"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-4">
            {loading ? "Loading..." : `${products.length} product${products.length !== 1 ? "s" : ""} found`}
          </p>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg font-medium text-foreground mb-2">No products found</p>
              <p className="text-sm text-muted-foreground mb-4">Try adjusting your search or filters</p>
              <Button variant="outline" onClick={() => { setSearchQuery(""); setSelectedCategory(""); }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
