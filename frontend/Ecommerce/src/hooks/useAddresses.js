import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as addressApi from "../api/addressApi";

export const useAddressesQuery = () =>
  useQuery({ queryKey: ["addresses"], queryFn: addressApi.getAddresses });

export const useCreateAddressMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addressApi.createAddress,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  });
};