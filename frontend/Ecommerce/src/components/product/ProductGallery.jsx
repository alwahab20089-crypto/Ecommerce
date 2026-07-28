// ProductGallery.jsx
import { useState, useEffect } from "react";

const ProductGallery = ({ product }) => {
  const images = (product.images || []).filter(Boolean);
  const fallback = product.thumbnail || null;

  const [selectedImage, setSelectedImage] = useState(images[0] || fallback);

  useEffect(() => {
    setSelectedImage(images[0] || fallback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product._id]);

  return (
    <div>
      <div className="relative border border-gray-200 rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-300 z-10" />

        {selectedImage ? (
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full h-[280px] sm:h-[400px] md:h-[550px] object-cover hover:scale-110 transition duration-500 cursor-zoom-in"
          />
        ) : (
          <div className="w-full h-[280px] sm:h-[400px] md:h-[550px] flex items-center justify-center text-gray-400 text-sm">
            No image available
          </div>
        )}
      </div>

      <div className="flex gap-3 sm:gap-4 mt-4 overflow-x-auto pb-1">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(image)}
            className={`shrink-0 border-2 rounded-xl overflow-hidden transition-all duration-300 ${
              selectedImage === image
                ? "border-yellow-500 shadow-md shadow-yellow-500/20"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <img
              src={image}
              alt=""
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;