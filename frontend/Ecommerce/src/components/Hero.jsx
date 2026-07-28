import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden h-150 bg-black text-white">

      {/* Background Glow */}
      <div className="absolute -top-40 -left-32 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-yellow-500/10 rounded-full blur-[150px]" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:70px_70px]" />

      <div className="relative max-w-7xl mx-auto  flex flex-col items-center text-center">

        {/* Small Badge */}
        <span className="mb-6 rounded-full border border-yellow-500/40 bg-yellow-500/10 px-5 py-2 text-sm uppercase tracking-[0.3em] text-yellow-400">
          Luxury Collection 2026
        </span>

        {/* Heading */}
        <h1 className="max-w-5xl text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
          Discover
          <span className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
            {" "}Premium{" "}
          </span>
          Fashion &
          <br />
          Timeless Style
        </h1>

        {/* Subtitle */}
        <p className="mt-8 max-w-2xl text-lg md:text-xl text-gray-300 leading-8">
          Elevate your lifestyle with handpicked premium products,
          exclusive collections, and luxury designs crafted for those
          who appreciate quality.
        </p>

        {/* Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-5">

          <button className="group flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 px-9 py-4 font-semibold text-black shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-yellow-500/30">

            Shop Now

            <ArrowRight
              size={20}
              className="transition-transform duration-300 group-hover:translate-x-2"
            />
          </button>

          <button className="rounded-full border border-yellow-500 px-9 py-4 font-semibold transition-all duration-500 hover:bg-yellow-500 hover:text-black hover:shadow-lg hover:shadow-yellow-500/20">
            Explore Collection
          </button>

        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-10 text-center">

          <div>
            <h2 className="text-4xl font-bold text-yellow-500">50K+</h2>
            <p className="mt-2 text-gray-400">Happy Customers</p>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-yellow-500">500+</h2>
            <p className="mt-2 text-gray-400">Luxury Products</p>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-yellow-500">70%</h2>
            <p className="mt-2 text-gray-400">Summer Discounts</p>
          </div>

        </div>

      </div>
    </section>
  );
}