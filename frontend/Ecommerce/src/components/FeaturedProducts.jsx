import { Link } from "react-router-dom";
import useProducts from "../hooks/useProducts";
import ProductCard from "./ProductCard";

export default function FeaturedProducts() {
  const { data, isLoading } = useProducts({ featured: true, limit: 4 });
  const products = data?.products || [];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-5 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-600 uppercase tracking-[0.25em] text-sm">
            Best Sellers
          </span>
          <h2 className="mt-6 text-4xl md:text-5xl font-black">
            Featured<span className="text-yellow-500"> Products</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            Discover our handpicked luxury collection crafted with premium quality and timeless design.
          </p>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-400">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-400">No featured products yet — mark some as "Featured" in the admin product form.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/shop" className="inline-block bg-black text-white px-8 py-3 rounded-full hover:bg-yellow-500 hover:text-black transition">
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}