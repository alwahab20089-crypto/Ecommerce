import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/productApi";

const useProducts = (params) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
  });
};

export default useProducts;

