import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import useUpdateReview from "../../hooks/useUpdateReview";
import { toast } from "react-toastify";

const ReviewsTab = ({ product }) => {
  const hasReviews = product.reviews?.length > 0;
  const { mutate } = useUpdateReview();
  const handleWriteReview = () => {
    document.getElementById("review-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  const handleUpdate = ({ reviewId, rating, comment }) => {
  mutate(
    {
      reviewId,
      reviewData: {
        rating,
        comment,
      },
    },
    {
      onSuccess: () => {
        toast.success("Review updated successfully!");
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message ||
          "Failed to update review"
        );
      },
    }
  );
};

  return (
    <div>

      {/* Summary + Form */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 pb-8 border-b border-gray-200">
        <div>
          <h3 className="text-xl sm:text-2xl font-semibold text-black">
            Customer reviews
          </h3>
          <p className="text-gray-500 text-sm sm:text-base mt-1">
            {hasReviews
              ? `${product.numReviews} review${product.numReviews === 1 ? "" : "s"} for this product`
              : "Share your experience with this product"}
          </p>
        </div>

        <button
          onClick={handleWriteReview}
          className="shrink-0 bg-black text-yellow-400 px-5 sm:px-6 py-3 rounded-xl font-medium hover:bg-gray-900 transition-all duration-300"
        >
          Write a review
        </button>
      </div>

      {/* Reviews list */}
      <div className="mt-8 sm:mt-10 space-y-6">
        {hasReviews ? (
          product.reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))
        ) : (
          <div className="text-center py-12 sm:py-16 border border-dashed border-gray-200 rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center mx-auto mb-4">
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
            </div>

            <h3 className="text-xl sm:text-2xl font-semibold text-black">
              No reviews yet
            </h3>

            <p className="text-gray-500 text-sm sm:text-base mt-2">
              Be the first person to review this product.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ReviewsTab;