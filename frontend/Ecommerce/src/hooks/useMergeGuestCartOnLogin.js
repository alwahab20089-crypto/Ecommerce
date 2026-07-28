import { useGuestCart } from "../context/GuestCartContext";
import { useMergeCartMutation } from "./useCartQueries";

export const useMergeGuestCartOnLogin = () => {
  const { items, clearCart } = useGuestCart();
  const mergeMutation = useMergeCartMutation();

  const mergeIfNeeded = () => {
    if (items.length === 0) return;

    mergeMutation.mutate(
      items.map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        quantity: i.quantity,
      })),
      { onSuccess: () => clearCart() }
    );
  };

  return mergeIfNeeded;
};