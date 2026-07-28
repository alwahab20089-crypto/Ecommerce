import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock3, Zap } from "lucide-react";

// length of one countdown cycle, in seconds — edit this to whatever your sale window should be
const SALE_DURATION_SECONDS = 6 * 60 * 60; // 6 hours

const formatUnit = (n) => String(n).padStart(2, "0");

export default function FlashSale() {
  const [secondsLeft, setSecondsLeft] = useState(SALE_DURATION_SECONDS);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? SALE_DURATION_SECONDS : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  return (
    <section className="relative overflow-hidden bg-black py-24">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[140px]" />
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:70px_70px]" />

      <div className="relative max-w-7xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/40 bg-yellow-500/10 px-5 py-2 text-yellow-400 uppercase tracking-[0.25em] text-sm">
          <Zap size={16} />
          Limited Time Offer
        </div>

        <h2 className="mt-8 text-4xl sm:text-5xl lg:text-6xl font-black text-white">
          Flash
          <span className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
            {" "}Sale
          </span>
        </h2>

        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-300">
          Don't miss your chance to own our most exclusive products at
          unbeatable prices. Once the timer ends, the offers disappear.
        </p>

        <div className="mt-14 flex flex-wrap justify-center gap-5">
          {[
            [formatUnit(hours), "Hours"],
            [formatUnit(minutes), "Minutes"],
            [formatUnit(seconds), "Seconds"],
          ].map(([time, label]) => (
            <div
              key={label}
              className="w-28 rounded-2xl border border-yellow-500/30 bg-white/5 backdrop-blur-md p-6 transition duration-500 hover:-translate-y-2 hover:border-yellow-500 hover:shadow-xl hover:shadow-yellow-500/20"
            >
              <h3 className="text-4xl font-black text-yellow-500">{time}</h3>
              <p className="mt-2 uppercase tracking-widest text-sm text-gray-400">{label}</p>
            </div>
          ))}
        </div>

        <Link
          to="/shop?onSale=true"
          className="group mt-14 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 px-10 py-4 font-bold text-black transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/30"
        >
          <Clock3 size={20} className="transition-transform duration-300 group-hover:rotate-12" />
          Shop Flash Sale
        </Link>
      </div>
    </section>
  );
}