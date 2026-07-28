import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as adminCategoryApi from "../api/adminCategoryApi";

const invalidateAll = (queryClient) => queryClient.invalidateQueries();

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: adminCategoryApi.createCategory, onSuccess: () => invalidateAll(queryClient) });
};

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: adminCategoryApi.updateCategory, onSuccess: () => invalidateAll(queryClient) });
};

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: adminCategoryApi.deleteCategory, onSuccess: () => invalidateAll(queryClient) });
};