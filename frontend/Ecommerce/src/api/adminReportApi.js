import api from "../services/api";

export const getSalesReport = async (params) => {
  const { data } = await api.get("/reports/sales", { params });
  return data;
};