import { useQuery } from "@tanstack/react-query";
import { getBrands } from "../api/brandApi";

const useBrands = () => {
  return useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
    staleTime: 1000 * 60 * 10,
  });
};

export default useBrands;