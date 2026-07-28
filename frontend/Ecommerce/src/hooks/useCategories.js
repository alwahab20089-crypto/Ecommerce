import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/categoryApi";

const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 10,
  });
};

export default useCategories;