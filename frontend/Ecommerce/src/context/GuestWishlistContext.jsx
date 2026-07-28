import { createContext, useContext, useState, useEffect, useCallback } from "react";

const GuestWishlistContext = createContext(null);
const STORAGE_KEY = "guest_wishlist";

const readStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeStorage = (items) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

export const GuestWishlistProvider = ({ children }) => {
  const [items, setItems] = useState(readStorage);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setItems(readStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // payload: { productId, name, slug, thumbnail, price, salePrice, inStock, hasVariants, singleVariantId }
  const addItem = useCallback((payload) => {
    setItems((prev) => {
      if (prev.some((i) => i.productId === payload.productId)) return prev;
      const next = [...prev, { _id: payload.productId, ...payload }];
      writeStorage(next);
      return next;
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.productId !== productId);
      writeStorage(next);
      return next;
    });
  }, []);

  const isWishlisted = useCallback((productId) => items.some((i) => i.productId === productId), [items]);

  const clearWishlist = useCallback(() => {
    setItems([]);
    writeStorage([]);
  }, []);

  return (
    <GuestWishlistContext.Provider value={{ items, addItem, removeItem, isWishlisted, clearWishlist }}>
      {children}
    </GuestWishlistContext.Provider>
  );
};

export const useGuestWishlist = () => {
  const ctx = useContext(GuestWishlistContext);
  if (!ctx) throw new Error("useGuestWishlist must be used within GuestWishlistProvider");
  return ctx;
};