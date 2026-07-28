import { useAuth } from "../context/AuthContext";
import { useGuestWishlist } from "../context/GuestWishlistContext";
import {
  useWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "./useWishlistQueries";

const normalizeServerItem = (item) => ({
  _id: item._id,
  productId: item.product._id,
  name: item.product.name,
  slug: item.product.slug,
  thumbnail: item.product.thumbnail,
  price: item.product.salePrice || item.product.price,
  inStock: item.inStock,
  hasVariants: item.hasVariants,
  singleVariantId: item.singleVariantId,
});

const normalizeGuestItem = (item) => ({
  _id: item.productId,
  productId: item.productId,
  name: item.name,
  slug: item.slug,
  thumbnail: item.thumbnail,
  price: item.salePrice || item.price,
  inStock: item.inStock,
  hasVariants: item.hasVariants,
  singleVariantId: item.singleVariantId,
});

export const useWishlist = () => {
  const { isAuthenticated } = useAuth();
  const guestWishlist = useGuestWishlist();
  const { data: serverWishlist, isLoading } = useWishlistQuery(isAuthenticated);

  const addMutation = useAddToWishlistMutation();
  const removeMutation = useRemoveFromWishlistMutation();

  if (isAuthenticated) {
    const items = (serverWishlist?.items || []).map(normalizeServerItem);
    const productIds = new Set(items.map((i) => i.productId));

    return {
      items,
      isLoading,
      isWishlisted: (productId) => productIds.has(productId),
      addItem: (payload, options) => addMutation.mutate(payload.productId, options),
      removeItem: (productId, options) => removeMutation.mutate(productId, options),
      isGuest: false,
    };
  }

  return {
    items: guestWishlist.items.map(normalizeGuestItem),
    isLoading: false,
    isWishlisted: guestWishlist.isWishlisted,
    addItem: (payload, options) => {
      try {
        guestWishlist.addItem(payload);
        options?.onSuccess?.();
      } catch (err) {
        options?.onError?.(err);
      }
    },
    removeItem: (productId, options) => {
      try {
        guestWishlist.removeItem(productId);
        options?.onSuccess?.();
      } catch (err) {
        options?.onError?.(err);
      }
    },
    isGuest: true,
  };
};