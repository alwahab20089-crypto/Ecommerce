import { Link, useLocation, useNavigate } from "react-router-dom";

const menuLinks = [
  { label: "Home", path: "/" },
  { label: "Shop", path: "/shop" },
  { label: "Categories", scrollTo: "categories" },
  { label: "Deals", scrollTo: "deals" },
  { label: "New Arrivals", scrollTo: "new-arrivals" },
  { label: "Contact", path: "/contact" },
  { label: "About", path: "/about" },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleScrollToSection = (sectionId) => {
    if (location.pathname === "/") {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/", { state: { scrollTo: sectionId } });
    }
  };

  return (
    <nav className="bg-black border-b border-yellow-500/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <ul className="flex flex-wrap justify-center gap-10">
          {menuLinks.map(({ label, path, scrollTo }) => {
            const isActive = path && location.pathname === path;

            const inner = (
              <>
                {label}
                <span
                  className={`absolute left-0 -bottom-[1px] h-[2px] bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-300 transition-all duration-500 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
                <span className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition duration-500 bg-yellow-500/5 blur-md"></span>
              </>
            );

            return (
              <li
                key={label}
                onClick={scrollTo ? () => handleScrollToSection(scrollTo) : undefined}
                className={`group relative py-5 text-sm uppercase tracking-[0.18em] font-semibold cursor-pointer transition-all duration-300 ${
                  isActive ? "text-yellow-500" : "text-white hover:text-yellow-500"
                }`}
              >
                {path ? <Link to={path}>{inner}</Link> : inner}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}