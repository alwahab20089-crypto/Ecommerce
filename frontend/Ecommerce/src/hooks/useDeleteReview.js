import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReview } from "../api/reviewApi";

const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReview,

    onSuccess: (product) => {
      queryClient.setQueryData(
        ["product", product.slug],
        product
      );

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
};

export default useDeleteReview;