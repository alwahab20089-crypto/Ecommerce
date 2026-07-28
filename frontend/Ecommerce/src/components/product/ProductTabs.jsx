import { useState } from "react";
import DescriptionTab from "./DescriptionTab";
import SpecificationsTab from "./SpecificationsTab";
import ReviewsTab from "./ReviewsTab";

const ProductTabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "Description" },
    { id: "specifications", label: "Specifications" },
    {
      id: "reviews",
      label: `Reviews (${product.numReviews})`,
    },
  ];

  return (
    <section className="mt-12 sm:mt-16">

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 sm:gap-8 border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative pb-4 px-1 sm:px-2 text-sm sm:text-base font-medium tracking-wide whitespace-nowrap transition-colors duration-200 ${
              activeTab === tab.id
                ? "text-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {tab.label}
            <span
              className={`absolute left-0 -bottom-px h-0.5 w-full bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-300 transition-opacity duration-200 ${
                activeTab === tab.id ? "opacity-100" : "opacity-0"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-6 sm:mt-8">
        {activeTab === "description" && (
          <DescriptionTab product={product} />
        )}

        {activeTab === "specifications" && (
          <SpecificationsTab product={product} />
        )}

        {activeTab === "reviews" && (
          <ReviewsTab product={product} />
        )}
      </div>

    </section>
  );
};

export default ProductTabs;