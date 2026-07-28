// api/couponApi.js
import api from "../services/api";

export const applyCoupon = async ({ code, subtotal }) => {
  const { data } = await api.post("/coupons/apply", { code, subtotal });
  return data; // { code, discountAmount }
};