import { useQuery } from "@tanstack/react-query";
import { getRelatedProducts } from "../api/productApi";

const useRelatedProducts = (
  categoryId,
  productId
) => {
  return useQuery({
    queryKey: [
      "related-products",
      categoryId,
      productId,
    ],
    queryFn: () =>
      getRelatedProducts(categoryId, productId),
    enabled: !!categoryId,
  });
};

export default useRelatedProducts;