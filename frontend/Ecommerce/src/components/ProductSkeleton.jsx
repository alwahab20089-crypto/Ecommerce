const ProductSkeleton = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden animate-pulse">

      <div className="h-64 bg-gray-200"></div>

      <div className="p-5">

        <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>

        <div className="h-6 bg-gray-200 rounded mb-3"></div>

        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>

        <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>

        <div className="h-8 bg-gray-200 rounded w-32 mb-4"></div>

        <div className="h-12 bg-gray-200 rounded"></div>

      </div>

    </div>
  );
};

export default ProductSkeleton;