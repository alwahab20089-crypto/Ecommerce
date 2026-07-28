import { useAuth } from "../context/AuthContext";
import { useGuestCart } from "../context/GuestCartContext";
import {
  useCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} from "./useCartQueries";

const normalizeServerItem = (item) => ({
  _id: item._id,
  productId: item.product._id,
  variantId: item.variant?._id || null,
  name: item.product.name,
  slug: item.product.slug,
  thumbnail: item.product.thumbnail,
  price: item.price,
  quantity: item.quantity,
  stock: item.stock,
  variantLabel: item.variant ? `${item.variant.size} / ${item.variant.color?.name}` : null,
  available: item.available,
});

const normalizeGuestItem = (item) => ({
  _id: item._id,
  productId: item.productId,
  variantId: item.variantId || null,
  name: item.name,
  slug: item.slug,
  thumbnail: item.thumbnail,
  price: item.price,
  quantity: item.quantity,
  stock: item.stock,
  variantLabel: item.variantLabel || null,
  available: item.stock === undefined || item.quantity <= item.stock,
});

export const useCart = () => {
  const { isAuthenticated } = useAuth();
  const guestCart = useGuestCart();
  const { data: serverCart, isLoading } = useCartQuery(isAuthenticated);

  const addMutation = useAddToCartMutation();
  const updateMutation = useUpdateCartItemMutation();
  const removeMutation = useRemoveCartItemMutation();
  const clearMutation = useClearCartMutation();

  if (isAuthenticated) {
    return {
      items: (serverCart?.items || []).map(normalizeServerItem),
      totalItems: serverCart?.totalItems || 0,
      totalPrice: serverCart?.totalPrice || 0,
      isLoading,
      addItem: (payload, options) => addMutation.mutate(payload, options),
      updateItem: (itemId, quantity) => updateMutation.mutate({ itemId, quantity }),
      removeItem: (itemId) => removeMutation.mutate(itemId),
      clearCart: () => clearMutation.mutate(),
      isGuest: false,
    };
  }

  return {
    items: guestCart.items.map(normalizeGuestItem),
    totalItems: guestCart.totalItems,
    totalPrice: guestCart.totalPrice,
    isLoading: false,
    // guest branch
    addItem: (payload, options) => {
      try {
        guestCart.addItem(payload);
        options?.onSuccess?.();
      } catch (err) {
        options?.onError?.(err);
      }
    },
    updateItem: guestCart.updateItem,
    removeItem: guestCart.removeItem,
    clearCart: guestCart.clearCart,
    isGuest: true,
  };
};