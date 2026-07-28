import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as adminOrderApi from "../api/adminOrderApi";

export const useAdminOrdersQuery = (params) =>
  useQuery({ queryKey: ["adminOrders", params], queryFn: () => adminOrderApi.getAllOrders(params) });

export const useAdminOrderQuery = (id) =>
  useQuery({ queryKey: ["adminOrders", id], queryFn: () => adminOrderApi.getAdminOrderById(id), enabled: !!id });

export const useUpdateOrderStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminOrderApi.updateOrderStatus,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminOrders"] }),
  });
};