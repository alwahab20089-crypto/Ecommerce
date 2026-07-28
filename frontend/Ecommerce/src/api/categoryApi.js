import api from "../services/api";

export const getCategories = async () => {
  const { data } = await api.get("/categories");
  return data;
};