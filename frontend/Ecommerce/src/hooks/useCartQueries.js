import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as cartApi from "../api/cartApi";

export const CART_QUERY_KEY = ["cart"];

export const useCartQuery = (enabled) =>
  useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: cartApi.getCart,
    enabled,
    staleTime: 1000 * 30,
  });

export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cartApi.addToCart,
    onSuccess: (data) => queryClient.setQueryData(CART_QUERY_KEY, data),
  });
};

export const useUpdateCartItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cartApi.updateCartItem,
    onSuccess: (data) => queryClient.setQueryData(CART_QUERY_KEY, data),
  });
};

export const useRemoveCartItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cartApi.removeCartItem,
    onSuccess: (data) => queryClient.setQueryData(CART_QUERY_KEY, data),
  });
};

export const useClearCartMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: (data) => queryClient.setQueryData(CART_QUERY_KEY, data),
  });
};

export const useMergeCartMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cartApi.mergeCart,
    onSuccess: (data) => queryClient.setQueryData(CART_QUERY_KEY, data),
  });
};