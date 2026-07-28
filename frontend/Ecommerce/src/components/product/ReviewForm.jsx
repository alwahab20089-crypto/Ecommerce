import { useState } from "react";
import useCreateReview from "../../hooks/useCreateReview";
import { FaStar } from "react-icons/fa";

const ReviewForm = ({ product }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const {
    mutate,
    error,
    isPending
  } = useCreateReview();

  const submitHandler = (e) => {
    e.preventDefault();
    if (comment.trim().length < 10) {
      return alert("Review must be at least 10 characters.");
    }

    mutate(
      {
        productId: product._id,
        reviewData: {
          rating,
          comment,
        },
      },
      {
        onSuccess: () => {
          setRating(5);
          setComment("");
        },
      }
    );
  };

  return (
    <form
      onSubmit={submitHandler}
      className="relative border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-300" />

      <h2 className="text-lg sm:text-xl font-semibold text-black mb-6 tracking-wide">
        Write a review
      </h2>

      {/* Rating */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3 tracking-wide">
          Your rating
        </p>

        <div className="flex gap-1.5 sm:gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            >
              <FaStar
                className={`text-2xl sm:text-3xl transition-all duration-150 ${
                  star <= (hoverRating || rating)
                    ? "text-yellow-500"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Comment */}
      <textarea
        rows={6}
        maxLength={500}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full rounded-xl border border-gray-300 p-4 text-sm sm:text-base text-gray-800 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none resize-none transition-all duration-200"
        placeholder="Tell others what you liked or disliked about this product..."
      />

      <div className="text-right text-xs sm:text-sm text-gray-400 mt-2">
        {comment.length}/500
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-4">
          {error.response?.data?.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending || comment.trim().length < 10}
        className="w-full bg-black text-yellow-400 py-3 sm:py-4 rounded-xl font-medium tracking-wide hover:bg-gray-900 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed mt-2"
      >
        {isPending ? "Submitting..." : "Submit review"}
      </button>
    </form>
  );
};

export default ReviewForm;  