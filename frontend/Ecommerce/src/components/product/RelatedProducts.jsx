import ProductCard from "../ProductCard";
import useRelatedProducts from "../../hooks/useRelatedProducts";

const RelatedProducts = ({ product }) => {
  const {
    data: products = [],
    isLoading,
  } = useRelatedProducts(
    product.category?._id,
    product._id
  );

  if (isLoading) {
    return (
      <div className="mt-20">
        <h2 className="text-3xl font-bold mb-8">
          You May Also Like
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-96 bg-gray-200 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!products.length) {
  return (
    <section className="mt-24">
      <h2 className="text-3xl font-bold text-black mb-10">
        You May Also Like
      </h2>

      <p className="text-gray-500">
        No related products found.
      </p>
    </section>
  );
}

  return (
    <section className="mt-24">

      <h2 className="text-3xl font-bold text-black mb-10">
        You May Also Like
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))}

      </div>

    </section>
  );
};

export default RelatedProducts;