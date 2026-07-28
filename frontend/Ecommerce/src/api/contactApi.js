import api from "../services/api";

export const submitContactForm = async (payload) => {
  const { data } = await api.post("/contact", payload);
  return data;
};