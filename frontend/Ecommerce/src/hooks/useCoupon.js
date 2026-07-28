// hooks/useCoupon.js
import { useMutation } from "@tanstack/react-query";
import { applyCoupon } from "../api/couponApi";

export const useApplyCouponMutation = () => useMutation({ mutationFn: applyCoupon });