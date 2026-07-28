import api from "../services/api";

export const getAddresses = async () => {
  const { data } = await api.get("/addresses");
  return data;
};

export const createAddress = async (payload) => {
  const { data } = await api.post("/addresses", payload);
  return data;
};

export const updateAddress = async ({ id, ...payload }) => {
  const { data } = await api.put(`/addresses/${id}`, payload);
  return data;
};

export const deleteAddress = async (id) => {
  const { data } = await api.delete(`/addresses/${id}`);
  return data;
};