import api from "../services/api";

export const getAdminProducts = async (params) => {
  const { data } = await api.get("/products/admin/list", { params });
  return data;
};

export const createProduct = async (payload) => {
  const { data } = await api.post("/products", payload);
  return data;
};

export const updateProduct = async ({ slug, ...payload }) => {
  const { data } = await api.put(`/products/${slug}`, payload);
  return data;
};

export const deleteProduct = async (slug) => {
  const { data } = await api.delete(`/products/${slug}`);
  return data;
};