const recalculateRatings = (product) => {
  product.numReviews = product.reviews.length;

  product.rating =
    product.reviews.length === 0
      ? 0
      : product.reviews.reduce(
          (acc, review) => acc + review.rating,
          0
        ) / product.reviews.length;
};

export default recalculateRatings;