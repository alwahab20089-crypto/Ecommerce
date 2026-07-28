import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import useCategories from "../../hooks/useCategories";
import { useAuth } from "../../context/AuthContext";
import { useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } from "../../hooks/useAdminCategories";
import { useUploadImageMutation } from "../../hooks/useUpload";

const emptyForm = { name: "", image: "", icon: "", displayOrder: 0, isActive: true };

const AdminCategoriesPage = () => {
  const { data: categories, isLoading } = useCategories();
  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();
  const deleteMutation = useDeleteCategoryMutation();
  const uploadMutation = useUploadImageMutation();
  const { user } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [editingSlug, setEditingSlug] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");

  const openCreate = () => { setForm(emptyForm); setEditingSlug(null); setShowForm(true); setError(""); setUploadError(""); };

  const openEdit = (category) => {
    setForm({ name: category.name, image: category.image || "", icon: category.icon || "", displayOrder: category.displayOrder || 0, isActive: category.isActive });
    setEditingSlug(category.slug);
    setShowForm(true);
    setError("");
    setUploadError("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadError("");
    uploadMutation.mutate(file, {
      onSuccess: (data) => setForm((prev) => ({ ...prev, image: data.url })),
      onError: (err) => setUploadError(err.response?.data?.message || "Image upload failed"),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const payload = { ...form, displayOrder: Number(form.displayOrder) };
    const mutation = editingSlug ? updateMutation : createMutation;
    const mutationPayload = editingSlug ? { slug: editingSlug, ...payload } : payload;

    mutation.mutate(mutationPayload, {
      onSuccess: () => setShowForm(false),
      onError: (err) => setError(err.response?.data?.message || "Could not save category"),
    });
  };

  const handleDelete = (slug, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    deleteMutation.mutate(slug);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button onClick={openCreate} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-yellow-500 hover:text-black transition">
          <Plus size={18} /> Add Category
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 mb-6 space-y-4 relative">
          <button type="button" onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">
            <X size={18} />
          </button>
          <h3 className="font-bold">{editingSlug ? "Edit Category" : "New Category"}</h3>
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="grid sm:grid-cols-2 gap-4">
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required className="border rounded-lg px-3 py-2" />
            <input name="icon" placeholder="Icon (optional)" value={form.icon} onChange={handleChange} className="border rounded-lg px-3 py-2" />
            <input type="number" name="displayOrder" placeholder="Display Order" value={form.displayOrder} onChange={handleChange} className="border rounded-lg px-3 py-2" />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Image</label>
            <div className="flex items-center gap-3">
              {form.image && (
                <img src={form.image} alt="Category preview" className="w-12 h-12 object-cover rounded bg-gray-100 border" />
              )}
              <input type="file" accept="image/*" onChange={handleImageFileChange} className="text-sm" />
              {uploadMutation.isPending && <span className="text-xs text-gray-400">Uploading...</span>}
            </div>
            {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
            Active (visible on storefront)
          </label>

          <button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending || uploadMutation.isPending}
            className="bg-black text-white px-5 py-2 rounded-full hover:bg-yellow-500 hover:text-black transition disabled:opacity-40"
          >
            {editingSlug ? "Update" : "Create"}
          </button>
        </form>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Order</th><th className="px-4 py-3">Status</th><th className="px-4 py-3"></th></tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-gray-400">Loading...</td></tr>
            ) : (
              categories?.map((cat) => (
                <tr key={cat._id} className="border-t border-gray-100">
                  <td className="px-4 py-3 flex items-center gap-3">
                    {cat.image && <img src={cat.image} alt={cat.name} className="w-8 h-8 object-cover rounded bg-gray-100" />}
                    {cat.name}
                  </td>
                  <td className="px-4 py-3">{cat.displayOrder}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${cat.isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                      {cat.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {cat.createdBy === user?.id ? (
                      <div className="flex items-center gap-3">
                        <button onClick={() => openEdit(cat)} className="text-gray-500 hover:text-yellow-600"><Pencil size={16} /></button>
                        <button onClick={() => handleDelete(cat.slug, cat.name)} className="text-gray-500 hover:text-red-500"><Trash2 size={16} /></button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400" title="Only the admin who created this can edit or delete it">Locked</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategoriesPage;