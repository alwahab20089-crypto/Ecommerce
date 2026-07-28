// hooks/useAdminCoupons.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as adminCouponApi from "../api/adminCouponApi";

export const useAdminCouponsQuery = () => useQuery({ queryKey: ["adminCoupons"], queryFn: adminCouponApi.getCoupons });

export const useCreateCouponMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: adminCouponApi.createCoupon, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminCoupons"] }) });
};

export const useUpdateCouponMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: adminCouponApi.updateCoupon, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminCoupons"] }) });
};

export const useDeleteCouponMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: adminCouponApi.deleteCoupon, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminCoupons"] }) });
};