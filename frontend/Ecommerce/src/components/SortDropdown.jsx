import { ArrowUpDown } from "lucide-react";

const SortDropdown = ({ value, onChange }) => {
  return (
    <div className="relative w-full sm:w-72">

      <ArrowUpDown
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500"
      />

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          appearance-none
          rounded-2xl
          border
          border-gray-200
          bg-white
          py-3
          pl-12
          pr-12
          text-gray-800
          shadow-sm
          transition-all
          duration-300
          outline-none
          hover:border-yellow-400
          hover:shadow-lg
          focus:border-yellow-500
          focus:ring-4
          focus:ring-yellow-100
        "
      >
        <option value="newest">Newest First</option>
        <option value="price-asc">Price: Low → High</option>
        <option value="price-desc">Price: High → Low</option>
        <option value="rating">Highest Rated</option>
      </select>

      <svg
        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>

    </div>
  );
};

export default SortDropdown;