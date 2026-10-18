"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface InternationalRequestItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  thumbnail: string | null;
  quantity: number;
  currency: string;
  vendorName: string;
}

interface RequestContextValue {
  items: InternationalRequestItem[];
  subtotal: number;
  count: number;
  addItem: (
    item: Omit<InternationalRequestItem, "quantity">,
    quantity?: number,
  ) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
}

const RequestContext = createContext<RequestContextValue | undefined>(
  undefined,
);

const REQUEST_STORAGE_KEY = "itengear-international-request-list";

export function InternationalRequestProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<InternationalRequestItem[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(REQUEST_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as InternationalRequestItem[];
        if (Array.isArray(parsed))
          setItems(
            parsed.filter((item) => item?.productId && item.quantity > 0),
          );
      }
    } catch {
      window.localStorage.removeItem(REQUEST_STORAGE_KEY);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    if (items.length)
      window.localStorage.setItem(REQUEST_STORAGE_KEY, JSON.stringify(items));
    else window.localStorage.removeItem(REQUEST_STORAGE_KEY);
  }, [items, hasHydrated]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );
  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const addItem = (
    item: Omit<InternationalRequestItem, "quantity">,
    quantity = 1,
  ) => {
    setItems((current) => {
      const existing = current.find(
        (entry) => entry.productId === item.productId,
      );
      if (existing)
        return current.map((entry) =>
          entry.productId === item.productId
            ? { ...entry, quantity: entry.quantity + quantity }
            : entry,
        );
      return [...current, { ...item, currency: "USD", quantity }];
    });
  };

  return (
    <RequestContext.Provider
      value={{
        items,
        subtotal,
        count,
        addItem,
        updateQuantity: (productId, quantity) =>
          setItems((current) =>
            current.map((item) =>
              item.productId === productId
                ? { ...item, quantity: Math.max(1, quantity) }
                : item,
            ),
          ),
        removeItem: (productId) =>
          setItems((current) =>
            current.filter((item) => item.productId !== productId),
          ),
        clear: () => setItems([]),
      }}
    >
      {children}
    </RequestContext.Provider>
  );
}

export function useInternationalRequest() {
  const context = useContext(RequestContext);
  if (!context)
    throw new Error(
      "useInternationalRequest must be used within InternationalRequestProvider",
    );
  return context;
}
