import { createContext, useContext, useState, useEffect, useCallback } from "react";

const GuestCartContext = createContext(null);
const STORAGE_KEY = "guest_cart";

const readStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeStorage = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const lineId = (productId, variantId) => `${productId}_${variantId || "none"}`;

export const GuestCartProvider = ({ children }) => {
  const [items, setItems] = useState(readStorage);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setItems(readStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = useCallback((next) => {
    setItems(next);
    writeStorage(next);
  }, []);

  const addItem = useCallback((payload) => {
    setItems((prev) => {
      const id = lineId(payload.productId, payload.variantId);
      const existing = prev.find((i) => i._id === id);
      let next;

      if (existing) {
        const newQty = Math.min(existing.quantity + (payload.quantity || 1), payload.stock ?? Infinity);
        next = prev.map((i) => (i._id === id ? { ...i, quantity: newQty } : i));
      } else {
        next = [...prev, { _id: id, ...payload, quantity: payload.quantity || 1 }];
      }

      writeStorage(next);
      return next;
    });
  }, []);

  const updateItem = useCallback((itemId, quantity) => {
    setItems((prev) => {
      const next = prev.map((i) => (i._id === itemId ? { ...i, quantity } : i));
      writeStorage(next);
      return next;
    });
  }, []);

  const removeItem = useCallback((itemId) => {
    setItems((prev) => {
      const next = prev.filter((i) => i._id !== itemId);
      writeStorage(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => persist([]), [persist]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <GuestCartContext.Provider
      value={{ items, addItem, updateItem, removeItem, clearCart, totalItems, totalPrice }}
    >
      {children}
    </GuestCartContext.Provider>
  );
};

export const useGuestCart = () => {
  const ctx = useContext(GuestCartContext);
  if (!ctx) throw new Error("useGuestCart must be used within GuestCartProvider");
  return ctx;
};