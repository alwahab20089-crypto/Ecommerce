import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as adminProductApi from "../api/adminProductApi";

const invalidateAll = (queryClient) => queryClient.invalidateQueries();

export const useAdminProductsQuery = (params) =>
  useQuery({ queryKey: ["adminProducts", params], queryFn: () => adminProductApi.getAdminProducts(params) });

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: adminProductApi.createProduct, onSuccess: () => invalidateAll(queryClient) });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: adminProductApi.updateProduct, onSuccess: () => invalidateAll(queryClient) });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: adminProductApi.deleteProduct, onSuccess: () => invalidateAll(queryClient) });
};