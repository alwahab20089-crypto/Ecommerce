import api from "../services/api";

export const getBrands = async () => {
  const { data } = await api.get("/brands");
  return data;
};