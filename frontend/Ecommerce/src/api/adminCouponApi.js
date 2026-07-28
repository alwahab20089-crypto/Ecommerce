// api/adminCouponApi.js
import api from "../services/api";

export const getCoupons = async () => {
  const { data } = await api.get("/coupons/admin/all");
  return data;
};

export const createCoupon = async (payload) => {
  const { data } = await api.post("/coupons", payload);
  return data;
};

export const updateCoupon = async ({ code, ...payload }) => {
  const { data } = await api.put(`/coupons/${code}`, payload);
  return data;
};

export const deleteCoupon = async (code) => {
  const { data } = await api.delete(`/coupons/${code}`);
  return data;
};