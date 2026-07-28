import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as orderApi from "../api/orderApi";
import { CART_QUERY_KEY } from "./useCartQueries";

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderApi.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
};

export const useMyOrdersQuery = () =>
  useQuery({ queryKey: ["orders"], queryFn: orderApi.getMyOrders });

export const useOrderQuery = (id) =>
  useQuery({
    queryKey: ["orders", id],
    queryFn: () => orderApi.getOrderById(id),
    enabled: !!id,
  });

export const useCancelOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderApi.cancelOrder,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.setQueryData(["orders", data._id], data);
    },
  });
};