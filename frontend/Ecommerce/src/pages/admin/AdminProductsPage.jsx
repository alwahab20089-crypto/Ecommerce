import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAdminProductsQuery, useDeleteProductMutation } from "../../hooks/useAdminProducts";
import { useAuth } from "../../context/AuthContext";

const formatPrice = (n) => `$${Number(n).toFixed(2)}`;
const statusStyles = { Published: "bg-green-100 text-green-700", Draft: "bg-gray-200 text-gray-600" };

const AdminProductsPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminProductsQuery({ search, page, limit: 15 });
  const deleteMutation = useDeleteProductMutation();
  const { user } = useAuth();

  const handleDelete = (slug, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    deleteMutation.mutate(slug);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link to="/admin/products/new" className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-yellow-500 hover:text-black transition">
          <Plus size={18} /> Add Product
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        className="w-full sm:w-80 border rounded-lg px-4 py-2 mb-6"
      />

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">Loading...</td></tr>
            ) : data?.products?.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">No products found</td></tr>
            ) : (
              data?.products?.map((p) => {
                const hasVariants = p.variants?.length > 0;
                const stock = hasVariants ? p.variants.reduce((sum, v) => sum + (v.stock || 0), 0) : p.stock;

                return (
                  <tr key={p._id} className="border-t border-gray-100">
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img src={p.thumbnail} alt={p.name} className="w-10 h-10 object-cover rounded bg-gray-100" />
                      <span className="font-medium">{p.name}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.sku}</td>
                    <td className="px-4 py-3">{formatPrice(p.salePrice || p.price)}</td>
                    <td className="px-4 py-3">
                      <span className={stock <= (p.lowStockThreshold || 5) ? "text-red-500 font-semibold" : ""}>{stock}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${statusStyles[p.status] || "bg-gray-100"}`}>{p.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      {p.createdBy === user?.id ? (
                        <div className="flex items-center gap-3">
                          <Link to={`/admin/products/${p.slug}/edit`} className="text-gray-500 hover:text-yellow-600">
                            <Pencil size={16} />
                          </Link>
                          <button onClick={() => handleDelete(p.slug, p.name)} className="text-gray-500 hover:text-red-500">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400" title="Only the admin who created this can edit or delete it">
                          Locked
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {data?.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-full text-sm ${page === p ? "bg-black text-white" : "bg-white border text-gray-600"}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;