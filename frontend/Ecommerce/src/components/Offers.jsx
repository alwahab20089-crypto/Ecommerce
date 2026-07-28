import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const offers = [
  {
    title: "Luxury Fashion",
    subtitle: "Up to 60% OFF",
    description: "Discover premium outfits crafted for timeless elegance.",
    bg: "bg-black",
    text: "text-white",
  },
  {
    title: "Exclusive Deals",
    subtitle: "Limited Time",
    description: "Save big on our best-selling premium collections.",
    bg: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    text: "text-black",
  },
  {
    title: "New Arrivals",
    subtitle: "2026 Collection",
    description: "Explore the latest trends before everyone else.",
    bg: "bg-black",
    text: "text-white",
  },
];

export default function Offers() {
  return (
    <section id="deals" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {offers.map((offer, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-3xl ${offer.bg} ${offer.text} p-10 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl`}
            >
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-3xl transition duration-500 group-hover:scale-150" />

              <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.25em] backdrop-blur-md">
                Special Offer
              </span>

              <h3 className="mt-8 text-3xl font-black">{offer.title}</h3>
              <h4 className="mt-3 text-4xl font-extrabold text-yellow-300 group-hover:scale-105 transition-transform">
                {offer.subtitle}
              </h4>
              <p className="mt-5 leading-7 opacity-90">{offer.description}</p>

              <Link
                to="/shop"
                className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/30 px-6 py-3 font-semibold transition-all duration-500 hover:bg-white hover:text-black"
              >
                Shop Now
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-2" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}