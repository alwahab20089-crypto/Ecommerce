import api from "../services/api";

export const createReview = async (productId, reviewData) => {
  const { data } = await api.post(
    `/products/${productId}/reviews`,
    reviewData
  );

  return data;
};
export const updateReview = async (
  reviewId,
  reviewData
) => {
  const { data } = await api.put(
    `/products/reviews/${reviewId}`,
    reviewData
  );

  return data;
};
export const deleteReview = async (reviewId) => {
  const { data } = await api.delete(
    `/products/reviews/${reviewId}`
  );

  return data;
};