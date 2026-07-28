import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateReview } from "../api/reviewApi";

const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, reviewData }) =>
      updateReview(reviewId, reviewData),

    onSuccess: (product) => {
      queryClient.setQueryData(
        ["product", product.slug],
        product
      );
    },
  });
};

export default useUpdateReview;