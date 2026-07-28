import { Mail, Phone, MapPin, CreditCard } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";

const shopLinks = [
  { label: "New Arrivals", scrollTo: "new-arrivals" },
  { label: "Best Sellers", scrollTo: "best-sellers" },
  { label: "Categories", scrollTo: "categories" },
  { label: "Deals", scrollTo: "deals" },
];

const socialLinks = [
  { icon: FaFacebookF, href: "https://facebook.com", label: "Facebook" },
  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
];

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleShopLinkClick = (scrollTo) => {
    if (location.pathname === "/") {
      document.getElementById(scrollTo)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById(scrollTo)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <footer className="relative overflow-hidden mt-5 bg-black text-white">
      {/* Gold Glow */}
      <div className="absolute left-0 top-0 h-60 w-60 sm:h-80 sm:w-80 rounded-full bg-yellow-500/10 blur-[100px] sm:blur-[150px]" />
      <div className="absolute right-0 bottom-0 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-yellow-500/10 blur-[110px] sm:blur-[160px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">

        {/* Top */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12">

          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <h3 className="text-xl font-black tracking-[0.2em] bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              TRENDCART
            </h3>
            <p className="mt-4 text-gray-400 leading-7 text-sm sm:text-base max-w-sm">
              Discover premium products, luxury collections, and
              an exceptional shopping experience designed just for you.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="mb-4 sm:mb-6 text-base sm:text-lg font-bold text-yellow-500">
              Shop
            </h3>
            <ul className="space-y-2.5 sm:space-y-3 text-gray-400 text-sm sm:text-base">
              {shopLinks.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => handleShopLinkClick(item.scrollTo)}
                    className="inline-block transition duration-300 hover:text-yellow-500 hover:translate-x-2"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 sm:mb-6 text-base sm:text-lg font-bold text-yellow-500">
              Legal
            </h3>
            <ul className="space-y-2.5 sm:space-y-3 text-gray-400 text-sm sm:text-base">
              <li>
                <Link to="/privacy-policy" className="transition hover:text-yellow-500 hover:translate-x-2 inline-block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="transition hover:text-yellow-500 hover:translate-x-2 inline-block">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="mb-4 sm:mb-6 text-base sm:text-lg font-bold text-yellow-500">
              Support
            </h3>
            <ul className="space-y-3 sm:space-y-4 text-gray-400 text-sm sm:text-base">
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-yellow-500 shrink-0" />
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=alwahab20089@gmail.com"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-yellow-500 transition break-all"
  >
    alwahab20089@gmail.com
  </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-yellow-500 shrink-0" />
                <a href="tel:+923341747392" className="hover:text-yellow-500 transition">
                  +92 334 1747392
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-yellow-500 shrink-0" />
                Sargodha, Pakistan
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="mb-4 sm:mb-6 text-base sm:text-lg font-bold text-yellow-500">
              Follow Us
            </h3>
            <div className="flex gap-3 sm:gap-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all duration-500 hover:border-yellow-500 hover:bg-yellow-500 hover:text-black hover:scale-110"
                >
                  <Icon size={16} className="sm:hidden" />
                  <Icon size={18} className="hidden sm:block" />
                </a>
              ))}
            </div>
            <p className="mt-4 sm:mt-6 text-gray-400 leading-7 text-sm sm:text-base">
              Follow us for exclusive offers, premium collections,
              and exciting updates.
            </p>
          </div>

        </div>

        {/* Divider */}
        <div className="my-8 sm:my-12 h-px bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-500 text-sm sm:text-base text-center md:text-left">
            © 2026 <span className="text-yellow-500">TrendCart</span>. All Rights Reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-gray-400 text-xs sm:text-sm">
            <div className="flex items-center gap-2 rounded-full border border-white/10 px-3 sm:px-4 py-1.5 sm:py-2 hover:border-yellow-500 transition">
              <CreditCard size={16} className="sm:hidden" />
              <CreditCard size={18} className="hidden sm:block" />
              Visa
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 px-3 sm:px-4 py-1.5 sm:py-2 hover:border-yellow-500 transition">
              <CreditCard size={16} className="sm:hidden" />
              <CreditCard size={18} className="hidden sm:block" />
              Mastercard
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 px-3 sm:px-4 py-1.5 sm:py-2 hover:border-yellow-500 transition">
              <CreditCard size={16} className="sm:hidden" />
              <CreditCard size={18} className="hidden sm:block" />
              PayPal
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}