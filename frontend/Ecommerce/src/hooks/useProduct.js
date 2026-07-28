import { useQuery } from "@tanstack/react-query";
import { getProduct } from "../api/productApi";

const useProduct = (slug) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProduct(slug),
    enabled: !!slug,
  });
};

export default useProduct;