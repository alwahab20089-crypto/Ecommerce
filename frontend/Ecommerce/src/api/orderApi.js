import api from "../services/api";

export const createOrder = async (payload) => {
  const { data } = await api.post("/orders", payload);
  return data;
};

export const getMyOrders = async () => {
  const { data } = await api.get("/orders");
  return data;
};

export const getOrderById = async (id) => {
  const { data } = await api.get(`/orders/${id}`);
  return data;
};

export const cancelOrder = async (id) => {
  const { data } = await api.put(`/orders/${id}/cancel`);
  return data;
};