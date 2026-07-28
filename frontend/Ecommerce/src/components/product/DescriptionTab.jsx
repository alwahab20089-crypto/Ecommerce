const DescriptionTab = ({ product }) => {
  return (
    <div className="max-w-none">
      <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 md:p-10 overflow-hidden">
        {/* Gold accent bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-300" />

        <h3 className="text-black text-lg sm:text-xl font-semibold tracking-wide mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block" />
          Description
        </h3>

        <p className="text-gray-700 leading-7 sm:leading-8 text-sm sm:text-base whitespace-pre-line">
          {product.description}
        </p>

        {/* Bottom gold hairline */}
        <div className="mt-6 sm:mt-8 h-px w-full bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
      </div>
    </div>
  );
};

export default DescriptionTab;