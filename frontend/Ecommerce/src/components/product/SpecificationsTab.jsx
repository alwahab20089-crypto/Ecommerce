const SpecificationsTab = ({ product }) => {
  const specs = [
    { label: "Brand", value: product.brand?.name },
    { label: "Category", value: product.category?.name },
    { label: "SKU", value: product.sku },
    { label: "Stock", value: product.stock },
  ];

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">

      <table className="w-full border-collapse">
        <tbody>
          {specs.map((spec, index) => (
            <tr
              key={spec.label}
              className={`${
                index !== specs.length - 1 ? "border-b border-gray-200" : ""
              } hover:bg-yellow-50/40 transition-colors duration-200`}
            >
              <td className="font-medium text-black p-4 sm:p-5 bg-gray-50 text-sm sm:text-base tracking-wide w-1/3">
                {spec.label}
              </td>

              <td className="p-4 sm:p-5 text-gray-700 text-sm sm:text-base">
                {spec.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default SpecificationsTab;