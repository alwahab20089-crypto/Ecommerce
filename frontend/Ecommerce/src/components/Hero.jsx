import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowRight, Sparkles, Star } from "lucide-react";

// Default stats shown until real data arrives (or if none is ever provided).
const DEFAULT_STATS = [
  { label: "Happy Customers", value: "50K+" },
  { label: "Luxury Products", value: "500+" },
  { label: "Summer Discounts", value: "70%" },
];

export default function Hero({
  shopNowPath = "/shop",
  exploreCollectionPath = "/collections",
  // Simplest option: point this at your API and Hero will axios.get it on mount.
  // Expects the response body to be [{ label, value }, { label, value }, { label, value }]
  // e.g. statsEndpoint="/api/stats"
  statsEndpoint,
  // Escape hatch for custom logic (auth headers, different shape, etc).
  // Pass an async function that resolves to [{ label, value }, ...]
  // e.g. () => axios.get("/api/stats", { headers: {...} }).then(r => r.data)
  // If both statsEndpoint and fetchStats are given, fetchStats wins.
  fetchStats,
}) {
  const navigate = useNavigate();
  const [stats, setStats] = useState(DEFAULT_STATS);

  useEffect(() => {
    const loadStats = fetchStats
      ? fetchStats
      : statsEndpoint
      ? () => axios.get(statsEndpoint).then((res) => res.data)
      : null;

    if (!loadStats) return;

    let cancelled = false;

    loadStats()
      .then((data) => {
        if (!cancelled && Array.isArray(data) && data.length) {
          setStats(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load hero stats, falling back to defaults:", err);
      });

    return () => {
      cancelled = true;
    };
  }, [fetchStats, statsEndpoint]);

  return (
    <section className="relative overflow-hidden min-h-[85vh] bg-black text-white py-20 px-6 sm:px-10">

      {/* Background Glow */}
      <div aria-hidden="true" className="absolute -top-40 -left-32 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl motion-safe:animate-[float_9s_ease-in-out_infinite]" />
      <div aria-hidden="true" className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-yellow-500/10 rounded-full blur-3xl motion-safe:animate-[float_11s_ease-in-out_infinite_reverse]" />
      <div aria-hidden="true" className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-600/5 rounded-full blur-3xl" />

      {/* Grid Pattern, faded toward the edges */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,#ffffff20_1px,transparent_1px),linear-gradient(to_bottom,#ffffff20_1px,transparent_1px)] bg-[size:60px_60px]"
        style={{
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />

      {/* Subtle grain for a printed, premium finish */}
      <svg aria-hidden="true" className="absolute inset-0 w-full h-full opacity-[0.035] mix-blend-overlay pointer-events-none">
        <defs>
          <filter id="grainFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#grainFilter)" />
      </svg>

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* LEFT — copy */}
        <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left">

          <span
            className="motion-safe:opacity-0 motion-safe:animate-[fadeUp_0.7s_ease_forwards] mb-6 inline-flex items-center gap-2 rounded-full border border-yellow-500/40 bg-yellow-500/10 px-5 py-2 text-xs sm:text-sm uppercase tracking-[0.3em] text-yellow-400"
          >
            <Sparkles size={14} /> Luxury Collection 2026
          </span>

          <h1
            className="motion-safe:opacity-0 motion-safe:animate-[fadeUp_0.7s_ease_forwards] max-w-xl text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight"
            style={{ animationDelay: "120ms" }}
          >
            Discover{" "}
            <span className="hero-accent bg-gradient-to-r from-amber-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Premium
            </span>{" "}
            Fashion &amp; Timeless Style
          </h1>

          <p
            className="motion-safe:opacity-0 motion-safe:animate-[fadeUp_0.7s_ease_forwards] mt-8 max-w-lg text-lg text-gray-300 leading-8"
            style={{ animationDelay: "240ms" }}
          >
            Elevate your lifestyle with handpicked premium products,
            exclusive collections, and luxury designs crafted for those
            who appreciate quality.
          </p>

          <div
            className="motion-safe:opacity-0 motion-safe:animate-[fadeUp_0.7s_ease_forwards] mt-10 flex flex-col sm:flex-row gap-5"
            style={{ animationDelay: "360ms" }}
          >
            <button
              type="button"
              onClick={() => navigate(shopNowPath)}
              className="group relative overflow-hidden flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 px-9 py-4 font-semibold text-black shadow-lg shadow-yellow-500/10 transition-all duration-500 hover:scale-105 hover:shadow-yellow-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />
              <span className="relative">Shop Now</span>
              <ArrowRight size={20} className="relative transition-transform duration-300 group-hover:translate-x-2" />
            </button>

            <button
              type="button"
              onClick={() => navigate(exploreCollectionPath)}
              className="rounded-full border border-yellow-500/60 px-9 py-4 font-semibold transition-all duration-500 hover:border-yellow-500 hover:bg-yellow-500 hover:text-black hover:shadow-lg hover:shadow-yellow-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Explore Collection
            </button>
          </div>

          {/* Stats — editorial strip instead of a boxed grid */}
          <div
            className="motion-safe:opacity-0 motion-safe:animate-[fadeUp_0.7s_ease_forwards] mt-16 flex divide-x divide-yellow-500/20"
            style={{ animationDelay: "480ms" }}
          >
            {stats.map(({ value, label }) => (
              <div key={label} className="px-6 first:pl-0 text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-yellow-500">{value}</h2>
                <p className="mt-1 text-sm text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — image showcase */}
        <div
          className="order-1 lg:order-2 motion-safe:opacity-0 motion-safe:animate-[fadeUp_0.9s_ease_forwards] relative mx-auto w-full max-w-md lg:max-w-none"
          style={{ animationDelay: "200ms" }}
        >
          <div aria-hidden="true" className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-yellow-500/20 via-transparent to-transparent blur-2xl" />

          <div className="group relative rounded-[2rem] border border-yellow-500/30 overflow-hidden aspect-[4/5] shadow-2xl shadow-yellow-500/10">
            <img
              src="https://placehold.co/800x1000/0a0a0a/eab308?text=Your+Product+Photo"
              alt="Featured piece from the luxury collection"
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
            <div aria-hidden="true" className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-yellow-500/10 to-transparent" />
          </div>

          {/* Floating glass badge */}
          <div className="motion-safe:animate-[float_6s_ease-in-out_infinite] absolute -left-6 bottom-10 rounded-2xl border border-yellow-500/30 bg-black/60 backdrop-blur-md px-5 py-4 shadow-xl">
            <p className="text-xs uppercase tracking-widest text-yellow-400">New Season</p>
            <p className="mt-1 font-semibold">Free Express Shipping</p>
          </div>

          {/* Rotating seal — signature detail */}
          <div aria-hidden="true" className="absolute -top-6 -right-6 h-24 w-24">
            <svg viewBox="0 0 100 100" className="h-full w-full motion-safe:animate-[spin_16s_linear_infinite]">
              <path id="trendcartSealPath" fill="none" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
              <text fill="#eab308" fontSize="8.2" letterSpacing="2">
                <textPath href="#trendcartSealPath" startOffset="0%">
                  TRENDCART • PREMIUM QUALITY •
                </textPath>
              </text>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Star size={22} className="text-yellow-500 fill-yellow-500/20" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,600&display=swap');
        .hero-accent { font-family: 'Cormorant Garamond', serif; font-style: italic; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
      `}</style>
    </section>
  );
}