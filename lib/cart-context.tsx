"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  thumbnail: string | null;
  quantity: number;
  stock: number;
  currency: string;
  vendorName: string;
}

interface CartContextType {
  items: CartItem[];
  count: number;
  subtotal: number;
  loading: boolean;
  addToCart: (product: { id: string; name: string; slug: string; price: number; comparePrice?: number | null; thumbnail?: string | null; currency?: string; vendorName?: string; quantity?: number }) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_CART_KEY = "itengear_cart";

function getLocalCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(LOCAL_CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setLocalCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // Sync local cart to DB when user logs in
  const syncCartToDb = useCallback(async () => {
    const localItems = getLocalCart();
    if (localItems.length > 0) {
      try {
        await api.post("/api/cart/sync", {
          items: localItems.map(i => ({ productId: i.productId, quantity: i.quantity }))
        });
        localStorage.removeItem(LOCAL_CART_KEY);
      } catch {
        // Silent fail
      }
    }
  }, []);

  const fetchDbCart = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<{ items: CartItem[] }>("/api/cart");
      setItems(data.items);
    } catch {
      setItems(getLocalCart());
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshCart = useCallback(async () => {
    if (user && user.role === "customer") {
      await fetchDbCart();
    } else {
      setItems(getLocalCart());
    }
  }, [user, fetchDbCart]);

  useEffect(() => {
    if (user && user.role === "customer") {
      syncCartToDb().then(fetchDbCart);
    } else {
      setItems(getLocalCart());
    }
  }, [user, syncCartToDb, fetchDbCart]);

  const addToCart = async (product: { id: string; name: string; slug: string; price: number; comparePrice?: number | null; thumbnail?: string | null; currency?: string; vendorName?: string; quantity?: number }) => {
    const qty = product.quantity || 1;
    if (user && user.role === "customer") {
      try {
        await api.post("/api/cart", { productId: product.id, quantity: qty });
        await fetchDbCart();
      } catch (err) {
        console.error("Add to cart error:", err);
      }
    } else {
      // Local storage cart
      const current = getLocalCart();
      const existingIdx = current.findIndex(i => i.productId === product.id);
      if (existingIdx >= 0) {
        current[existingIdx].quantity += qty;
      } else {
        current.push({
          id: `local-${Date.now()}`,
          productId: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          comparePrice: product.comparePrice,
          thumbnail: product.thumbnail || null,
          quantity: qty,
          stock: 99,
          currency: product.currency || "KES",
          vendorName: product.vendorName || "",
        });
      }
      setLocalCart(current);
      setItems(current);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;
    if (user && user.role === "customer") {
      try {
        await api.put(`/api/cart/${id}`, { quantity });
        await fetchDbCart();
      } catch {
        // silent
      }
    } else {
      const current = getLocalCart();
      const idx = current.findIndex(i => i.id === id);
      if (idx >= 0) {
        current[idx].quantity = quantity;
        setLocalCart(current);
        setItems([...current]);
      }
    }
  };

  const removeItem = async (id: string) => {
    if (user && user.role === "customer") {
      try {
        await api.delete(`/api/cart/${id}`);
        await fetchDbCart();
      } catch {
        // silent
      }
    } else {
      const current = getLocalCart().filter(i => i.id !== id);
      setLocalCart(current);
      setItems(current);
    }
  };

  const clearCart = async () => {
    if (user && user.role === "customer") {
      try {
        await api.delete("/api/cart");
        setItems([]);
      } catch {
        // silent
      }
    } else {
      localStorage.removeItem(LOCAL_CART_KEY);
      setItems([]);
    }
  };

  return (
    <CartContext.Provider value={{ items, count, subtotal, loading, addToCart, updateQuantity, removeItem, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
