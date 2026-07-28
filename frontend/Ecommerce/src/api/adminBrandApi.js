import api from "../services/api";

export const createBrand = async (payload) => {
  const { data } = await api.post("/brands", payload);
  return data;
};

export const updateBrand = async ({ slug, ...payload }) => {
  const { data } = await api.put(`/brands/${slug}`, payload);
  return data;
};

export const deleteBrand = async (slug) => {
  const { data } = await api.delete(`/brands/${slug}`);
  return data;
};