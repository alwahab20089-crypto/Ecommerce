import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "James Wilson",
    role: "Verified Buyer",
    review:
      "Absolutely amazing quality! The products exceeded my expectations, and the delivery was incredibly fast.",
  },
  {
    name: "Sophia Carter",
    role: "Premium Member",
    review:
      "TrendCart has become my favorite online store. Beautiful products, secure checkout, and outstanding customer service.",
  },
  {
    name: "Michael Brown",
    role: "Verified Buyer",
    review:
      "Luxury experience from start to finish. Everything arrived perfectly packaged and exactly as described.",
  },
];

export default function Reviews() {
  return (
    <section className="relative overflow-hidden bg-black py-24 text-white">

      {/* Background Glow */}
      <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-yellow-500/10 blur-[140px]" />
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-yellow-500/10 blur-[160px]" />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">

          <span className="inline-block rounded-full border border-yellow-500/30 bg-yellow-500/10 px-5 py-2 text-sm uppercase tracking-[0.3em] text-yellow-400">
            Testimonials
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-black">
            What Our
            <span className="text-yellow-500"> Customers Say</span>
          </h2>

          <p className="mt-4 max-w-2xl mx-auto text-gray-400">
            Thousands of happy customers trust TrendCart for premium
            products and exceptional service.
          </p>

        </div>

        {/* Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {reviews.map((review) => (

            <div
              key={review.name}
              className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8 transition-all duration-500 hover:-translate-y-3 hover:border-yellow-500 hover:shadow-2xl hover:shadow-yellow-500/20"
            >

              {/* Quote Icon */}
              <Quote
                size={36}
                className="text-yellow-500 opacity-80"
              />

              {/* Stars */}
              <div className="mt-5 flex gap-1">

                {[1,2,3,4,5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}

              </div>

              {/* Review */}
              <p className="mt-6 leading-8 text-gray-300 italic">
                "{review.review}"
              </p>

              {/* User */}
              <div className="mt-8 flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-yellow-300 text-xl font-bold text-black">
                  {review.name.charAt(0)}
                </div>

                <div className="text-left">

                  <h4 className="font-bold">
                    {review.name}
                  </h4>

                  <p className="text-sm text-gray-400">
                    {review.role}
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}