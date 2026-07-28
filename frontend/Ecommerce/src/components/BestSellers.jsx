import { Crown } from "lucide-react";
import useProducts from "../hooks/useProducts";
import ProductCard from "./ProductCard";

export default function BestSellers() {
  const { data, isLoading } = useProducts({ sort: "rating", limit: 6 });
  const products = data?.products || [];

  return (
    <section className="relative overflow-hidden bg-gray-50 py-24">
      <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-yellow-500/10 blur-[140px]" />
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-yellow-500/10 blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-5 py-2 text-sm uppercase tracking-[0.25em] text-yellow-600">
            <Crown size={15} />
            Customer Favorites
          </span>
          <h2 className="mt-6 text-4xl md:text-5xl font-black">
            Best<span className="text-yellow-500"> Sellers</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            Our most-loved products chosen by thousands of happy customers.
          </p>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-400">No products yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}