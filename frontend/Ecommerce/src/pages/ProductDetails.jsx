import { useParams } from "react-router-dom";
import ProductGallery from "../components/product/ProductGallery";
import ProductInfo from "../components/product/ProductInfo";
import ProductTabs from "../components/product/ProductTabs";
import RelatedProducts from "../components/product/RelatedProducts";
import ReviewForm from "../components/product/ReviewForm";
import useProduct from "../hooks/useProduct";

const ProductDetails = () => {
  const { slug } = useParams();

  const {
    data: product,
    isLoading,
    error,
  } = useProduct(slug);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        Loading...
      </div>
    );
  }

  if (error || !product) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 text-center">
      <h2 className="text-3xl font-bold text-red-500">
        Product Not Found
      </h2>
    </div>
  );
}

  return (
    <section className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">

        {/* Breadcrumb */}

        <div className="text-sm text-gray-500 mb-8">
        Home / Shop{product.category?.name ? ` / ${product.category.name}` : ""} / {product.name}
      </div>

        {/* Main Section */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">

          <ProductGallery product={product} />

          <ProductInfo product={product} />
          <ProductTabs product={product} />
          <RelatedProducts product={product} />
          <ReviewForm product={product} />

        </div>

      </div>
    </section>
  );
};

export default ProductDetails;