import {
    ShoppingBag,
    Truck,
    ShieldCheck,
    Headphones,
    Target,
    Eye,
} from "lucide-react";
import { Link } from "react-router-dom";


export default function About() {
    return (
        <div className="bg-white text-gray-900">

            {/* Hero Section */}
            <section className="relative bg-black text-white py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent"></div>

                <div className="relative max-w-7xl mx-auto px-6 text-center">
                    <p className="text-yellow-500 uppercase tracking-[4px] mb-3">
                        About TrendCart
                    </p>

                    <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                        Premium Shopping
                        <span className="text-yellow-500"> Experience</span>
                    </h1>

                    <p className="mt-6 max-w-2xl mx-auto text-gray-300 text-lg">
                        TrendCart is a modern eCommerce platform designed to provide
                        customers with premium fashion, quality products, secure shopping,
                        and a seamless online experience.
                    </p>
                </div>
            </section>

            {/* Story */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

                    <div>
                        <span className="text-yellow-500 font-semibold">
                            OUR STORY
                        </span>

                        <h2 className="text-4xl font-bold mt-3">
                            Designed for Modern Shopping
                        </h2>

                        <p className="mt-6 text-gray-600 leading-8">
                            TrendCart was created with one simple goal — to make online
                            shopping easier, faster, and more enjoyable. Whether you're
                            looking for fashion, accessories, or everyday essentials, we
                            carefully curate products that combine quality, style, and value.
                        </p>

                        <p className="mt-5 text-gray-600 leading-8">
                            We believe shopping should be effortless. That's why we've built
                            an intuitive platform with secure payments, fast delivery, and a
                            customer-first experience.
                        </p>
                    </div>

                    <div>
                        <img
                            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b"
                            alt="Shopping"
                            className="rounded-3xl shadow-xl w-full h-[450px] object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Why Choose */}
            <section className="bg-gray-100 py-20">

                <div className="max-w-7xl mx-auto px-6">

                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold">
                            Why Shop With Us
                        </h2>

                        <p className="text-gray-500 mt-4">
                            Everything you need for a premium shopping experience.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">

                        {[
                            {
                                icon: <Truck size={38} />,
                                title: "Fast Delivery",
                                desc: "Quick and reliable shipping to your doorstep.",
                            },
                            {
                                icon: <ShieldCheck size={38} />,
                                title: "Secure Payments",
                                desc: "Your payments are protected with trusted gateways.",
                            },
                            {
                                icon: <ShoppingBag size={38} />,
                                title: "Premium Products",
                                desc: "High-quality items selected with care.",
                            },
                            {
                                icon: <Headphones size={38} />,
                                title: "24/7 Support",
                                desc: "Friendly customer service whenever you need help.",
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-8 text-center shadow hover:shadow-xl transition"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500 text-black mb-5">
                                    {item.icon}
                                </div>

                                <h3 className="font-bold text-xl mb-3">
                                    {item.title}
                                </h3>

                                <p className="text-gray-600">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-20 bg-black text-white">

                <div className="max-w-6xl mx-auto px-6">

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">

                        {[
                            ["10K+", "Happy Customers"],
                            ["500+", "Premium Products"],
                            ["99%", "Customer Satisfaction"],
                            ["24/7", "Support"],
                        ].map(([number, title]) => (
                            <div key={title}>
                                <h2 className="text-5xl font-bold text-yellow-500">
                                    {number}
                                </h2>

                                <p className="mt-3 text-gray-300">
                                    {title}
                                </p>
                            </div>
                        ))}

                    </div>

                </div>

            </section>

            {/* Mission & Vision */}
            <section className="py-20">

                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10">

                    <div className="border rounded-3xl p-10">
                        <Target className="text-yellow-500" size={42} />

                        <h3 className="text-3xl font-bold mt-6">
                            Our Mission
                        </h3>

                        <p className="mt-5 text-gray-600 leading-8">
                            To provide customers with a trusted shopping destination that
                            combines quality products, affordable pricing, and outstanding
                            service.
                        </p>
                    </div>

                    <div className="border rounded-3xl p-10">
                        <Eye className="text-yellow-500" size={42} />

                        <h3 className="text-3xl font-bold mt-6">
                            Our Vision
                        </h3>

                        <p className="mt-5 text-gray-600 leading-8">
                            To become one of the most trusted online marketplaces by
                            delivering exceptional shopping experiences through innovation,
                            transparency, and customer satisfaction.
                        </p>
                    </div>

                </div>

            </section>

            {/* CTA */}
            <section className="bg-yellow-500 py-20">

                <div className="max-w-5xl mx-auto px-6 text-center">

                    <h2 className="text-4xl font-bold text-black">
                        Start Shopping Today
                    </h2>

                    <p className="mt-5 text-black/80 text-lg">
                        Discover premium products and enjoy a seamless shopping experience
                        with TrendCart.
                    </p>

                    <Link to="/shop" className="mt-8 inline-block bg-black text-white px-8 py-4 rounded-xl hover:bg-gray-900 transition">
                        Shop Now
                    </Link>

                </div>

            </section>

        </div>
    );
}