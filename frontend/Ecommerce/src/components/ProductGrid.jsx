import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";


const ProductGrid = ({ products = [], loading }) => {
  if (loading)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    );



 if (!loading && products.length===0)

return(

<div className="py-20 text-center">

<h2 className="text-3xl font-bold">

No Products Found

</h2>

<p className="text-gray-500 mt-2">

Try changing your filters.

</p>

</div>

)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
        />
      ))}
    </div>
  );
};

export default ProductGrid;