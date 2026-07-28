import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { useSubscribeNewsletterMutation } from "../hooks/useNewsletter";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const mutation = useSubscribeNewsletterMutation();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setStatus("");

    mutation.mutate(email, {
      onSuccess: (data) => {
        setStatus(data.message);
        setEmail("");
      },
      onError: (err) => setError(err.response?.data?.message || "Could not subscribe. Please try again."),
    });
  };

  return (
    <section className="relative overflow-hidden mt-5 bg-black py-24 text-white">
      <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-yellow-500/10 blur-[140px]" />
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-yellow-500/10 blur-[150px]" />
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:70px_70px]" />

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <span className="inline-block rounded-full border border-yellow-500/30 bg-yellow-500/10 px-5 py-2 text-sm uppercase tracking-[0.3em] text-yellow-400">
          Stay Updated
        </span>

        <h2 className="mt-6 text-4xl md:text-5xl font-black">
          Subscribe For<span className="text-yellow-500"> Exclusive Offers</span>
        </h2>

        <p className="mt-6 text-lg leading-8 text-gray-300">
          Join our newsletter and be the first to receive exclusive discounts, premium collections, and members-only deals.
        </p>

        <form onSubmit={handleSubmit} className="mt-12 flex flex-col sm:flex-row gap-4">
          <div className="group flex flex-1 items-center rounded-full border border-white/20 bg-white/5 px-5 backdrop-blur-md transition-all duration-500 focus-within:border-yellow-500 focus-within:shadow-lg focus-within:shadow-yellow-500/20">
            <Mail size={20} className="text-gray-400 group-focus-within:text-yellow-500 transition" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="w-full bg-transparent px-4 py-4 outline-none placeholder:text-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="group flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 px-8 py-4 font-bold text-black transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/30 disabled:opacity-50"
          >
            {mutation.isPending ? "Subscribing..." : "Subscribe"}
            <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-2" />
          </button>
        </form>

        {status && <p className="mt-4 text-sm text-green-400">{status}</p>}
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <p className="mt-6 text-sm text-gray-500">No spam. Unsubscribe anytime. We respect your privacy.</p>
      </div>
    </section>
  );
}