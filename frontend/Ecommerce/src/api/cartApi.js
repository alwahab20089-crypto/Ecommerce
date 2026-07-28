import api from "../services/api";



export const getCart = async () => {
  const { data } = await api.get("/cart");
  return data;
};

export const addToCart = async ({ productId, variantId = null, quantity = 1 }) => {
  const { data } = await api.post("/cart", { productId, variantId, quantity });
  return data;
};

export const updateCartItem = async ({ itemId, quantity }) => {
  const { data } = await api.put(`/cart/${itemId}`, { quantity });
  return data;
};

export const removeCartItem = async (itemId) => {
  const { data } = await api.delete(`/cart/${itemId}`);
  return data;
};

export const clearCart = async () => {
  const { data } = await api.delete("/cart");
  return data;
};

export const mergeCart = async (items) => {
  const { data } = await api.post("/cart/merge", { items });
  return data;
};