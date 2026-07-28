import { useGuestWishlist } from "../context/GuestWishlistContext";
import { useMergeWishlistMutation } from "./useWishlistQueries";

export const useMergeGuestWishlistOnLogin = () => {
  const { items, clearWishlist } = useGuestWishlist();
  const mergeMutation = useMergeWishlistMutation();

  const mergeIfNeeded = () => {
    if (items.length === 0) return;
    mergeMutation.mutate(
      items.map((i) => i.productId),
      { onSuccess: () => clearWishlist() }
    );
  };

  return mergeIfNeeded;
};