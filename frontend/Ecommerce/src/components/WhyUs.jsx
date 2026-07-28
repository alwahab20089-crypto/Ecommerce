import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
} from "lucide-react";

const items = [
  {
    icon: <Truck size={34} />,
    title: "Free Shipping",
    description: "Enjoy fast and free delivery on all premium orders.",
  },
  {
    icon: <ShieldCheck size={34} />,
    title: "Secure Payment",
    description: "100% secure checkout with trusted payment methods.",
  },
  {
    icon: <RotateCcw size={34} />,
    title: "Easy Returns",
    description: "Hassle-free returns within 30 days of purchase.",
  },
  {
    icon: <Headphones size={34} />,
    title: "24/7 Support",
    description: "Our dedicated team is always here to help you.",
  },
];

export default function WhyUs() {
  return (
    <section className="relative overflow-hidden bg-white py-24">

      {/* Background Glow */}
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-yellow-500/10 blur-[120px]" />
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-yellow-500/10 blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">

          <span className="inline-block rounded-full border border-yellow-500/30 bg-yellow-500/10 px-5 py-2 text-sm uppercase tracking-[0.3em] text-yellow-600">
            Why Choose Us
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-black">
            Shop With
            <span className="text-yellow-500"> Confidence</span>
          </h2>

          <p className="mt-4 max-w-2xl mx-auto text-gray-500">
            Experience premium service, secure shopping, and exceptional quality
            every time you shop with TrendCart.
          </p>

        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {items.map((item) => (

            <div
              key={item.title}
              className="group rounded-3xl border border-gray-200 bg-white p-8 text-center transition-all duration-500 hover:-translate-y-3 hover:border-yellow-500 hover:shadow-2xl"
            >

              {/* Icon */}
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500 transition-all duration-500 group-hover:rotate-6 group-hover:bg-yellow-500 group-hover:text-white">

                {item.icon}

              </div>

              {/* Title */}
              <h3 className="mt-6 text-xl font-bold transition group-hover:text-yellow-500">
                {item.title}
              </h3>

              {/* Description */}
              <p className="mt-4 text-gray-500 leading-7">
                {item.description}
              </p>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}