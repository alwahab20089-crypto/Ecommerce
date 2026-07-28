import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import useProducts from "../hooks/useProducts";
import ProductCard from "./ProductCard";

export default function NewArrivals() {
  const { data, isLoading } = useProducts({ sort: "newest", limit: 4 });
  const products = data?.products || [];

  return (
    <section id="new-arrivals" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-5 py-2 text-sm uppercase tracking-[0.25em] text-yellow-600">
            <Sparkles size={15} />
            Just Landed
          </span>
          <h2 className="mt-6 text-4xl md:text-5xl font-black">
            New<span className="text-yellow-500"> Arrivals</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            The latest additions to our collection — fresh in, not to be missed.
          </p>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-400">No products yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/shop?sort=newest" className="inline-block bg-black text-white px-8 py-3 rounded-full hover:bg-yellow-500 hover:text-black transition">
            View All New Arrivals
          </Link>
        </div>
      </div>
    </section>
  );
}