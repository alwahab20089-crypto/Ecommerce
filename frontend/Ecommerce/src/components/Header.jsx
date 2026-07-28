import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, User, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";

const Header = ({ value, onChange, onSubmit }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const { items: wishlistItems } = useWishlist();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(value);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col lg:flex-row items-center justify-between gap-6">

        <Link to="/">
          <h1 className="text-4xl font-extrabold tracking-[0.3em] cursor-pointer transition duration-500 hover:scale-105">
            <span className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              TRENDCART
            </span>
          </h1>
        </Link>

        <form
          onSubmit={handleSearchSubmit}
          className="group flex items-center w-full lg:w-[500px] rounded-full border border-gray-300 bg-white px-5 py-3 shadow-sm transition-all duration-500 hover:shadow-xl hover:border-yellow-500 focus-within:border-yellow-500 focus-within:shadow-xl"
        >
          <button type="submit" aria-label="Search">
            <Search size={20} className="text-gray-500 transition duration-300 group-focus-within:text-yellow-500" />
          </button>
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search premium products..."
            className="ml-4 w-full bg-transparent outline-none placeholder:text-gray-400"
          />
        </form>

        <div className="flex items-center gap-3">
          <Link to="/wishlist" className="group relative p-3 rounded-full border border-gray-200 hover:border-yellow-500 hover:bg-yellow-50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 inline-block">
            <Heart className="transition duration-300 group-hover:text-yellow-600 group-hover:scale-110" />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-yellow-500 text-white text-xs flex items-center justify-center">
                {wishlistItems.length > 9 ? "9+" : wishlistItems.length}
              </span>
            )}
          </Link>
          <Link to="/cart" className="group relative p-3 rounded-full border border-gray-200 hover:border-yellow-500 hover:bg-yellow-50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 inline-block">
            <ShoppingCart className="transition duration-300 group-hover:text-yellow-600 group-hover:scale-110" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-yellow-500 text-white text-xs flex items-center justify-center">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>

          <div className="relative">
            <button onClick={() => setMenuOpen((prev) => !prev)} className="group p-3 rounded-full border border-gray-200 hover:border-yellow-500 hover:bg-yellow-50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <User className="transition duration-300 group-hover:text-yellow-600 group-hover:scale-110" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                {isAuthenticated ? (
                  <>
                    <p className="px-4 py-2 text-sm text-gray-500 truncate">Hi, {user?.firstName}</p>
                    <Link to="/orders" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-yellow-50 hover:text-yellow-600">My Orders</Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm hover:bg-yellow-50 hover:text-yellow-600">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-yellow-50 hover:text-yellow-600">Login</Link>
                    <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-yellow-50 hover:text-yellow-600">Register</Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;