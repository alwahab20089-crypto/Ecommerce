import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";
import useDeleteReview from "../../hooks/useDeleteReview";
import { toast } from "react-toastify";

const ReviewCard = ({ review, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const { mutate } = useDeleteReview();

  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment);
  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your review?"
    );

    if (!confirmed) return;

    mutate(
      review._id,
      {
        onSuccess: (product) => {
          toast.success("Review deleted successfully!");
          queryClient.setQueryData(
            ["product", product.slug],
            product
          );
        },

        onError: (error) => {
          toast.error(
            error.response?.data?.message ||
            "Failed to delete review"
          );
        },
      }
    );
  };

  const saveHandler = () => {
    onUpdate({
      reviewId: review._id,
      rating,
      comment,
    });

    setIsEditing(false);
  };


  return (
    <div className="border border-gray-200 rounded-xl p-6">

      {isEditing ? (

        /* EDIT MODE */
        <div>

          <div className="flex gap-2 mb-4">

            {[1, 2, 3, 4, 5].map((star) => (

              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
              >
                <FaStar
                  className={`text-3xl ${star <= rating
                    ? "text-yellow-500"
                    : "text-gray-300"
                    }`}
                />
              </button>

            ))}

          </div>


          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border rounded-xl p-4"
            rows={5}
          />


          <div className="flex gap-3 mt-4">

            <button
              onClick={saveHandler}
              className="bg-black text-white px-5 py-2 rounded-lg"
            >
              Save
            </button>


            <button
              onClick={() => setIsEditing(false)}
              className="border px-5 py-2 rounded-lg"
            >
              Cancel
            </button>

          </div>

        </div>


      ) : (


        /* NORMAL MODE */
        <div>

          <div className="flex justify-between">

            <h3 className="font-semibold">
              {review.name}
            </h3>


            <button
              onClick={() => setIsEditing(true)}
              className="text-yellow-600"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700 transition"
            >
              Delete
            </button>


          </div>


          <div className="flex text-yellow-500 mt-2">

            {Array.from({
              length: review.rating
            }).map((_, index) => (
              <FaStar key={index} />
            ))}

          </div>


          <p className="mt-4 text-gray-700">
            {review.comment}
          </p>

        </div>

      )}


    </div>
  );
};

export default ReviewCard;