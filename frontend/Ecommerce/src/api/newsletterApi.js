import api from "../services/api";

export const subscribeNewsletter = async (email) => {
  const { data } = await api.post("/newsletter/subscribe", { email });
  return data;
};