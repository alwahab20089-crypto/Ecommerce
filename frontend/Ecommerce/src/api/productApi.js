import api from "../services/api";

export const getProducts = async (params) => {
    const { data } = await api.get("/products", {
        params,
    });

    return data;
};




export const getProduct = async (slug) => {
  const { data } = await api.get(`/products/${slug}`);
  return data;
};

export const getCategories = async () => {
    const { data } = await api.get("/categories");
    return data;
};

export const getBrands = async () => {
    const { data } = await api.get("/brands");
    return data;
};
export const getRelatedProducts = async (
  categoryId,
  productId
) => {
  const { data } = await api.get(
    `/products/related/${categoryId}`,
    {
      params: {
        exclude: productId,
        limit: 4,
      },
    }
  );

  return data;
};