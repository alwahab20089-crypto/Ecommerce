import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as adminBrandApi from "../api/adminBrandApi";

const invalidateAll = (queryClient) => queryClient.invalidateQueries();

export const useCreateBrandMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: adminBrandApi.createBrand, onSuccess: () => invalidateAll(queryClient) });
};

export const useUpdateBrandMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: adminBrandApi.updateBrand, onSuccess: () => invalidateAll(queryClient) });
};

export const useDeleteBrandMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: adminBrandApi.deleteBrand, onSuccess: () => invalidateAll(queryClient) });
};