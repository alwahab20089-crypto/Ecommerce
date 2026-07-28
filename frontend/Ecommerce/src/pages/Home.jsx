import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FlashSale from "../components/FlashSale";
import FeaturedProducts from "../components/FeaturedProducts";
import Offers from "../components/Offers";
import BestSellers from "../components/BestSellers";
import NewArrivals from "../components/NewArrivals"; 
import WhyUs from "../components/WhyUs";
import Reviews from "../components/Reviews";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";

export default function Home() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // arrived here from Navbar's "Categories" link on another page — scroll once, then clear the flag
  useEffect(() => {
    if (location.state?.scrollTo) {
      document.getElementById(location.state.scrollTo)?.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSearchSubmit = (term) => {
    if (term.trim()) {
      navigate(`/shop?search=${encodeURIComponent(term.trim())}`);
    }
  };

  return (
    <section className="bg-white min-h-screen py-10 pl-4 pr-4 md:pl-13 md:pr-13">
      <div className="bg-white text-black">

        <Navbar />
        <Header value={search} onChange={setSearch} onSubmit={handleSearchSubmit} />

        <section className="relative overflow-hidden bg-black rounded-[48px] px-10 py-14 md:py-16 text-white mb-12">
          <div className="absolute -top-24 -right-20 w-80 h-80 rounded-full bg-yellow-500/10 blur-[130px]" />
          <Hero />
        </section>

        <Categories />
        <FlashSale />
        <FeaturedProducts />
        <Offers />
        <BestSellers />
        <NewArrivals />
        <WhyUs />
        <Reviews />
        <Newsletter />
        <Footer />
      </div>
    </section>
  );
}