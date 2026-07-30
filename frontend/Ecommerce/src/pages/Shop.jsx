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
import api from "../services/api"

// --- Small utility: animates a number up when its container enters view ---
const useCountUp = (target, start, duration = 1400) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf;
    let startTime;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return value;
};

const Stat = ({ end, suffix, label, start }) => {
  const value = useCountUp(end, start);
  return (
    <div>
      <h3 className="text-3xl md:text-4xl font-semibold text-[#D8B978] font-display">
        {value}
        {suffix}
      </h3>
      <p className="text-gray-400 mt-1">{label}</p>
    </div>
  );
};
const getShopStats = async () => {
  const { data } = await api.get("/stats");
  return data;
};
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
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

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
  
const [stats, setStats] = useState(null);
useEffect(() => {
  getShopStats().then((data) => {
    setStats(data);
  });
}, []);

  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const { data: brandsData, isLoading: brandsLoading } = useBrands();

  useEffect(() => {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined && value !== 1) {
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
      productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [debouncedSearch]);

  // Trigger the stat count-up once the hero stats scroll into view
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scrollToProducts = () =>
    productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <section className="bg-[#FBF9F5] min-h-screen py-10 font-body text-[#1a1a1a]">
      {/* Fonts + custom motion, scoped to this page */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,450;9..144,550;9..144,650&family=Inter:wght@400;500;600;700&display=swap');

        .font-display { font-family: 'Fraunces', serif; }
        .font-body { font-family: 'Inter', sans-serif; }

        @media (prefers-reduced-motion: no-preference) {
          .animate-kenburns { animation: kenburns 14s ease-out forwards; }
          .animate-drawline { animation: drawline 1.4s 0.4s cubic-bezier(.16,1,.3,1) forwards; }
          .animate-rise { animation: rise 0.8s cubic-bezier(.16,1,.3,1) both; }
          .foil-sweep::after { content: ""; }
          .foil-sweep { position: relative; overflow: hidden; }
          .foil-sweep::before {
            content: "";
            position: absolute;
            top: 0; left: -60%;
            width: 40%; height: 100%;
            background: linear-gradient(115deg, transparent, rgba(255,255,255,0.45), transparent);
            transform: skewX(-20deg);
            transition: left 0.7s ease;
          }
          .foil-sweep:hover::before { left: 130%; }
        }

        @keyframes kenburns {
          0% { transform: scale(1) translate(0,0); }
          100% { transform: scale(1.14) translate(-2%,-1%); }
        }
        @keyframes drawline {
          from { width: 0%; opacity: 0; }
          to { width: 100%; opacity: 1; }
        }
        @keyframes rise {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

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
        <Header value={filters.search} onChange={(value) => updateFilter("search", value)} />

        {/* Hero Banner */}
        <section className="relative isolate overflow-hidden rounded-[48px] mb-14 text-white">
          {/* Background image + Ken Burns */}
          <div className="absolute inset-0 -z-20">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2000&q=80"
              alt=""
              className="w-full h-full object-cover animate-kenburns"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/50" />
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-transparent to-black/40" />
          </div>

          {/* Ambient gold glow */}
          <div className="absolute -top-24 -right-20 w-80 h-80 rounded-full bg-[#C6A15B]/20 blur-[130px] -z-10" />
          <div className="absolute -bottom-32 -left-16 w-72 h-72 rounded-full bg-[#C6A15B]/10 blur-[120px] -z-10" />

          <div className="relative px-10 py-16 md:py-24">
            <span className="animate-rise inline-flex items-center gap-2 rounded-full border border-[#D8B978]/40 bg-[#D8B978]/10 px-5 py-2 shadow-lg shadow-[#D8B978]/10 text-xs uppercase tracking-[0.3em] text-[#E8D3A0] backdrop-blur-sm">
              ✦ Luxury Shopping Experience
            </span>

            <h1
              className="animate-rise font-display mt-7 text-5xl md:text-7xl font-semibold leading-[1.05]"
              style={{ animationDelay: "0.1s" }}
            >
              Discover
              <span className="bg-gradient-to-r from-[#E8D3A0] via-[#D8B978] to-[#A5793C] bg-clip-text text-transparent">
                {" "}TrendCart
              </span>
            </h1>

            <p
              className="animate-rise mt-6 max-w-2xl text-lg leading-8 text-gray-300"
              style={{ animationDelay: "0.2s" }}
            >
              Browse our exclusive collection of fashion, electronics, home
              essentials, and premium lifestyle products, carefully selected
              to elevate your everyday experience.
            </p>

            <div
              className="animate-rise mt-9 flex flex-wrap gap-4"
              style={{ animationDelay: "0.3s" }}
            >
              <button
                onClick={scrollToProducts}
                className="foil-sweep bg-gradient-to-r from-[#D8B978] to-[#A5793C] text-black font-semibold px-8 py-3.5 rounded-full shadow-lg shadow-[#D8B978]/20 transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
              >
                Shop Now
              </button>
              <button className="border border-white/25 px-8 py-3.5 rounded-full font-medium text-white/90 backdrop-blur-sm transition-all duration-300 hover:border-[#D8B978]/60 hover:text-[#E8D3A0] hover:bg-white/5">
                View Lookbook
              </button>
            </div>

            {/* Stats */}
            <div ref={statsRef} className="mt-14 flex flex-wrap gap-12">
              <Stat
  end={stats?.totalProducts || 0}
  suffix="+"
  label="Premium Products"
  start={statsVisible}
/>

<Stat
  end={stats?.totalCustomers || 0}
  suffix="+"
  label="Happy Customers"
  start={statsVisible}
/>

<Stat
  end={stats?.totalOrders || 0}
  suffix="+"
  label="Orders Delivered"
  start={statsVisible}
/>
            </div>
          </div>

          {/* Signature gold hairline */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5 overflow-hidden">
            <div className="animate-drawline h-full bg-gradient-to-r from-transparent via-[#D8B978] to-transparent" />
          </div>
        </section>

        {/* Search + Sort toolbar */}
        <div className="sticky top-4 z-20 flex flex-col md:flex-row gap-4 justify-between items-center mb-10 bg-white/85 backdrop-blur-md border border-black/[0.06] rounded-2xl px-5 py-4 shadow-sm shadow-black/5">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl transition-all duration-300 hover:bg-[#1a1a1a] hover:shadow-lg hover:shadow-black/20 active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
            </svg>
            Filters
          </button>

          <SortDropdown value={filters.sort} onChange={(value) => updateFilter("sort", value)} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28 rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm shadow-black/5 before:content-[''] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#D8B978] via-[#A5793C] to-[#D8B978]" />
              <FilterSidebar
                filters={filters}
                updateFilter={updateFilter}
                clearFilters={clearFilters}
                categories={categoriesData || []}
                brands={brandsData || []}
                loading={categoriesLoading || brandsLoading}
              />
            </div>
          </aside>

          {/* Products */}
          <main
            ref={productsRef}
            className={`lg:col-span-3 transition-opacity duration-300 ${
              isLoading ? "opacity-60" : "opacity-100"
            }`}
          >
            <ProductGrid products={data?.products || []} loading={isLoading} />
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