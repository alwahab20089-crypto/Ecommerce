import FilterSidebar from "../components/FilterSidebar";
import ProductGrid from "../components/ProductGrid";
import SortDropdown from "../components/SortDropdown";
import useProducts from "../hooks/useProducts";
import useDebounce from "../hooks/useDebounce";
import useCategories from "../hooks/useCategories";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Pagination from "../components/Pagination";
import MobileFilterDrawer from "../components/MobileFilterDrawer";
import useBrands from "../hooks/useBrands";
import Footer from "../components/Footer";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();


  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    brand: searchParams.get("brand") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    rating: searchParams.get("rating") || "",
    sort: searchParams.get("sort") || "newest",
    page: Number(searchParams.get("page")) || 1,
    onSale: searchParams.get("onSale") || "",
  });
  const productsRef = useRef(null);
  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };
  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      rating: "",
      sort: "newest",
      page: 1,
      onSale: "",
    });
  };
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const {
    data: categoriesData,
    isLoading: categoriesLoading
  } = useCategories();

  const {
    data: brandsData,
    isLoading: brandsLoading
  } = useBrands();
  useEffect(() => {
    const params = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined &&
        value !== 1) {
        params[key] = value;
      }
    });

    setSearchParams(params);
  }, [filters, setSearchParams]);
  const debouncedSearch = useDebounce(filters.search, 500);
  const { data, isLoading, error } = useProducts({
    ...filters,
    search: debouncedSearch,
  });
  useEffect(() => {
    if (debouncedSearch.trim()) {
      productsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [debouncedSearch]);

  return (
    <section className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        <MobileFilterDrawer
          open={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          filters={filters}
          updateFilter={updateFilter}
          clearFilters={clearFilters}
          categories={categoriesData}
          brands={brandsData}
        />

        <Navbar />
        <Header
          value={filters.search}
          onChange={(value) => updateFilter("search", value)}
        />
        {/* Page Header */}
        <section className="relative overflow-hidden bg-black rounded-[48px] px-10 py-14 md:py-16 text-white mb-12">

          {/* Gold Glow */}
          <div className="absolute -top-24 -right-20 w-80 h-80 rounded-full bg-yellow-500/10 blur-[130px]" />

          {/* Left */}
          <div className="relative">

            <span className="inline-block rounded-full border border-yellow-500/30 bg-yellow-500/10 px-5 py-2 shadow-lg shadow-yellow-500/20 text-sm uppercase tracking-[0.3em] text-yellow-400">
              Luxury Shopping Experience
            </span>

            <h1 className="mt-7 text-5xl md:text-7xl font-black leading-tight">

              Discover

              <span className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                {" "}TrendCart
              </span>

            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-300">
              Browse our exclusive collection of fashion, electronics,
              home essentials, and premium lifestyle products carefully
              selected to elevate your everyday experience.
            </p>

            {/* Stats */}

            <div className="mt-12 flex flex-wrap gap-12">

              <div>
                <h3 className="text-3xl font-black text-yellow-500">
                  500+
                </h3>
                <p className="text-gray-400">
                  Premium
                  Products
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-black text-yellow-500">
                  50K+
                </h3>
                <p className="text-gray-400">
                  Happy Customers
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-black text-yellow-500">
                  99%
                </h3>
                <p className="text-gray-400">
                  Satisfaction Rate
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* Search + Sort */}
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-8">

          <div className="flex items-center justify-between mb-6">

            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl hover:bg-primary transition"
            >
              ☰ Filters
            </button>

            <SortDropdown
              value={filters.sort}
              onChange={(value) => updateFilter("sort", value)}
            />

          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <FilterSidebar
              filters={filters}
              updateFilter={updateFilter}
              clearFilters={clearFilters}
              categories={categoriesData || []}
              brands={brandsData || []}
              loading={
                categoriesLoading ||
                brandsLoading
              }
            />
          </aside>

          {/* Products */}
          <main
            ref={productsRef}
            className="lg:col-span-3"
          >
            <ProductGrid
              products={data?.products || []}
              loading={isLoading}
            />
            <Pagination
              currentPage={data?.currentPage || 1}
              totalPages={data?.totalPages || 1}
              onPageChange={(page) => updateFilter("page", page)}
            />
          </main>

        </div>
        <Footer />
      </div>
    </section>
  );
};

export default Shop;