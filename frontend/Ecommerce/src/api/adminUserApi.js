import api from "../services/api";

export const getUsers = async (params) => {
  const { data } = await api.get("/users", { params });
  return data;
};

export const updateUser = async ({ id, ...payload }) => {
  const { data } = await api.put(`/users/${id}`, payload);
  return data;
};