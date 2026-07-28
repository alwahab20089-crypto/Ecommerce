import api from "../services/api";

export const createCategory = async (payload) => {
  const { data } = await api.post("/categories", payload);
  return data;
};

export const updateCategory = async ({ slug, ...payload }) => {
  const { data } = await api.put(`/categories/${slug}`, payload);
  return data;
};

export const deleteCategory = async (slug) => {
  const { data } = await api.delete(`/categories/${slug}`);
  return data;
};