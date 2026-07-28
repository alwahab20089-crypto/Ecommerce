import api from "../services/api";

export const getAllOrders = async (params) => {
  const { data } = await api.get("/orders/admin/all", { params });
  return data;
};

export const getAdminOrderById = async (id) => {
  const { data } = await api.get(`/orders/admin/${id}`);
  return data;
};

export const updateOrderStatus = async ({ id, orderStatus, paymentStatus }) => {
  const { data } = await api.put(`/orders/admin/${id}/status`, { orderStatus, paymentStatus });
  return data;
};