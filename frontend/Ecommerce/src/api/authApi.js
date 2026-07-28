import api from "../services/api";


export const registerUser = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};

export const loginUser = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};
export const forgotPassword = async (email) => {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
};

export const resetPassword = async ({ token, password }) => {
  const { data } = await api.post(`/auth/reset-password/${token}`, { password });
  return data;
};
export const googleAuth = async (credential) => {
  const { data } = await api.post("/auth/google", { credential });
  return data;
};