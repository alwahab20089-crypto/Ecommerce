import { Link } from "react-router-dom";
import { Grid2X2, ArrowRight } from "lucide-react";
import useCategories from "../hooks/useCategories";

export default function Categories() {
  const { data: categoriesData, isLoading } = useCategories();
  const categories = (categoriesData || []).filter((c) => c.isActive);

  return (
    <section id="categories" className="relative overflow-hidden bg-gray-50 py-24">
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-yellow-500/10 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-yellow-500/10 blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block rounded-full border border-yellow-500/30 bg-yellow-500/10 px-5 py-2 text-sm uppercase tracking-[0.3em] text-yellow-600">
            Browse Collection
          </span>
          <h2 className="mt-6 text-4xl md:text-5xl font-black">
            Shop by<span className="text-yellow-500"> Category</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-gray-500">
            Explore premium collections designed for every lifestyle.
          </p>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-400">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-400">No categories yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/shop?category=${cat.slug}`}
                className="group cursor-pointer rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-3 hover:border-yellow-500 hover:shadow-2xl"
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500 transition-all duration-500 group-hover:bg-yellow-500 group-hover:text-white group-hover:rotate-6 overflow-hidden">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
                  ) : cat.icon ? (
                    <span className="text-3xl">{cat.icon}</span>
                  ) : (
                    <Grid2X2 size={38} />
                  )}
                </div>
                <h3 className="mt-6 text-center text-lg font-bold transition-colors duration-300 group-hover:text-yellow-600">
                  {cat.name}
                </h3>
                <div className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-gray-400 transition-all duration-300 group-hover:text-yellow-500">
                  Explore
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-2" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}