import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as wishlistApi from "../api/wishlistApi";

export const WISHLIST_QUERY_KEY = ["wishlist"];

export const useWishlistQuery = (enabled) =>
  useQuery({ queryKey: WISHLIST_QUERY_KEY, queryFn: wishlistApi.getWishlist, enabled });

export const useAddToWishlistMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: wishlistApi.addToWishlist,
    onSuccess: (data) => queryClient.setQueryData(WISHLIST_QUERY_KEY, data),
  });
};

export const useRemoveFromWishlistMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: wishlistApi.removeFromWishlist,
    onSuccess: (data) => queryClient.setQueryData(WISHLIST_QUERY_KEY, data),
  });
};

export const useMergeWishlistMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: wishlistApi.mergeWishlist,
    onSuccess: (data) => queryClient.setQueryData(WISHLIST_QUERY_KEY, data),
  });
};