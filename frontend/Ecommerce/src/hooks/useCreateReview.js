import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReview } from "../api/reviewApi";

const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, reviewData }) =>
      createReview(productId, reviewData),

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

export default useCreateReview;