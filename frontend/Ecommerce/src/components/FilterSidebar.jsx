import { FaFilter } from "react-icons/fa";
import { ChevronRight } from "lucide-react";

const FilterSidebar = ({
  filters,
  updateFilter,
  clearFilters,
  categories,
  brands,
  mobile = false,
}) => {
  return (
    <aside
      className={
        mobile
          ? "p-6"
          : "sticky top-24 rounded-3xl border border-gray-200 bg-white p-7 shadow-xl"
      }
    >
      {/* Header */}
      <div className="mb-8 flex items-center gap-3 border-b border-gray-200 pb-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500">
          <FaFilter />
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-yellow-500">
            TrendCart
          </p>

          <h2 className="text-2xl font-black">
            Filters
          </h2>
        </div>
      </div>

      {/* Categories */}
      <FilterGroup title="Categories">

        {categories.map((category) => (
          <label
            key={category._id}
            className="group flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 transition hover:bg-yellow-50"
          >
            <div className="flex items-center gap-3">

              <input
                type="radio"
                name="category"
                checked={filters.category === category.slug}
                onChange={() =>
                  updateFilter("category", category.slug)
                }
                className="accent-yellow-500"
              />

              <span className="transition group-hover:text-yellow-600">
                {category.name}
              </span>

            </div>

            <ChevronRight
              size={15}
              className="text-gray-400 group-hover:text-yellow-500"
            />

          </label>
        ))}

      </FilterGroup>

      {/* Brands */}
      <FilterGroup title="Brands">

        {brands.map((brand) => (
          <label
            key={brand._id}
            className="group flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 transition hover:bg-yellow-50"
          >
            <div className="flex items-center gap-3">

              <input
                type="radio"
                name="brand"
                checked={filters.brand === brand.slug}
                onChange={() =>
                  updateFilter("brand", brand.slug)
                }
                className="accent-yellow-500"
              />

              <span className="transition group-hover:text-yellow-600">
                {brand.name}
              </span>

            </div>

            <ChevronRight
              size={15}
              className="text-gray-400 group-hover:text-yellow-500"
            />

          </label>
        ))}

      </FilterGroup>

      {/* Price */}
      <FilterGroup title="Price">

        <div className="grid grid-cols-2 gap-3">

          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) =>
              updateFilter("minPrice", e.target.value)
            }
            className="rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
          />

          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) =>
              updateFilter("maxPrice", e.target.value)
            }
            className="rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
          />

        </div>

      </FilterGroup>

      {/* Rating */}
      <FilterGroup title="Customer Rating">

        {[5, 4, 3].map((rating) => (
          <label
            key={rating}
            className="group flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 transition hover:bg-yellow-50"
          >
            <div className="flex items-center gap-3">

              <input
                type="radio"
                name="rating"
                checked={Number(filters.rating) === rating}
                onChange={() =>
                  updateFilter("rating", rating)
                }
                className="accent-yellow-500"
              />

              <span className="transition group-hover:text-yellow-600">
                ⭐ {rating} Stars & Up
              </span>

            </div>

          </label>
        ))}

      </FilterGroup>

      {/* Button */}
      <button
        onClick={clearFilters}
        className="mt-6 w-full rounded-xl bg-black py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-yellow-500 hover:text-black hover:shadow-lg hover:shadow-yellow-500/30"
      >
        Clear Filters
      </button>

    </aside>
  );
};

function FilterGroup({ title, children }) {
  return (
    <div className="mb-8">
      <h3 className="mb-4 border-l-4 border-yellow-500 pl-3 text-lg font-bold">
        {title}
      </h3>

      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}

export default FilterSidebar;