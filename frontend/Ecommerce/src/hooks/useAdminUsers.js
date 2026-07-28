import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as adminUserApi from "../api/adminUserApi";

export const useAdminUsersQuery = (params) =>
  useQuery({ queryKey: ["adminUsers", params], queryFn: () => adminUserApi.getUsers(params) });

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminUserApi.updateUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminUsers"] }),
  });
};