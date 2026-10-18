"use client";

import {
  createContext,
  useContext,
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

export function InternationalRequestProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<InternationalRequestItem[]>([]);
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
      return [...current, { ...item, quantity }];
    });
  };

  return (
    <RequestContext.Provider
      value={{
        items,
        subtotal,
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
