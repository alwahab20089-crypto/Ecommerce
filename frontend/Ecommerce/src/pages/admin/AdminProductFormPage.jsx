import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Trash2, Upload, Loader2 } from "lucide-react";
import useProduct from "../../hooks/useProduct";
import useCategories from "../../hooks/useCategories";
import useBrands from "../../hooks/useBrands";
import { useCreateProductMutation, useUpdateProductMutation } from "../../hooks/useAdminProducts";
import api from "../../services/api";
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.url;
};
const emptyVariant = { size: "", color: { name: "", code: "#000000" }, stock: 0 };

const emptyForm = {
  name: "", sku: "", description: "", category: "", brand: "",
  price: "", salePrice: "", stock: 0, thumbnail: "", images: "", tags: "",
  featured: false, status: "Draft", metaTitle: "", metaDescription: "", lowStockThreshold: 5,
};

const AdminProductFormPage = () => {
  const { slug } = useParams();
  const isEditMode = !!slug;
  const navigate = useNavigate();

  const { data: existingProduct, isLoading: productLoading } = useProduct(isEditMode ? slug : undefined);
  const { data: categoriesData } = useCategories();
  const { data: brandsData } = useBrands();
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [imagesUploading, setImagesUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();

  const [form, setForm] = useState(emptyForm);
  const [variants, setVariants] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditMode && existingProduct) {
      setForm({
        name: existingProduct.name || "",
        sku: existingProduct.sku || "",
        description: existingProduct.description || "",
        category: existingProduct.category?._id || "",
        brand: existingProduct.brand?._id || "",
        price: existingProduct.price ?? "",
        salePrice: existingProduct.salePrice ?? "",
        stock: existingProduct.stock ?? 0,
        thumbnail: existingProduct.thumbnail || "",
        images: (existingProduct.images || []).join(", "),
        tags: (existingProduct.tags || []).join(", "),
        featured: existingProduct.featured || false,
        status: existingProduct.status || "Draft",
        metaTitle: existingProduct.metaTitle || "",
        metaDescription: existingProduct.metaDescription || "",
        lowStockThreshold: existingProduct.lowStockThreshold ?? 5,
      });
      setVariants(existingProduct.variants || []);
    }
  }, [isEditMode, existingProduct]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };
  const handleThumbnailFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    setThumbnailUploading(true);
    try {
      const url = await uploadImage(file);
      setForm((prev) => ({ ...prev, thumbnail: url }));
    } catch (err) {
      setUploadError(err.response?.data?.message || "Thumbnail upload failed");
    } finally {
      setThumbnailUploading(false);
      e.target.value = ""; // allow re-selecting the same file later
    }
  };

  const handleImagesFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadError("");
    setImagesUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadImage));
      setForm((prev) => {
        const existing = prev.images.split(",").map((s) => s.trim()).filter(Boolean);
        return { ...prev, images: [...existing, ...urls].join(", ") };
      });
    } catch (err) {
      setUploadError(err.response?.data?.message || "Image upload failed");
    } finally {
      setImagesUploading(false);
      e.target.value = "";
    }
  };

  const handleVariantChange = (index, field, value) => {
    setVariants((prev) => prev.map((v, i) => {
      if (i !== index) return v;
      if (field === "colorName") return { ...v, color: { ...v.color, name: value } };
      if (field === "colorCode") return { ...v, color: { ...v.color, code: value } };
      return { ...v, [field]: value };
    }));
  };


  const addVariant = () => setVariants((prev) => [...prev, { ...emptyVariant }]);
  const removeVariant = (index) => setVariants((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.category) {
      setError("Please select a category.");
      return;
    }

    const payload = {
      name: form.name,
      sku: form.sku,
      description: form.description,
      category: form.category,
      brand: form.brand || undefined,
      price: Number(form.price),
      salePrice: form.salePrice ? Number(form.salePrice) : null,
      thumbnail: form.thumbnail,
      images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
      tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
      featured: form.featured,
      status: form.status,
      metaTitle: form.metaTitle,
      metaDescription: form.metaDescription,
      lowStockThreshold: Number(form.lowStockThreshold),
      variants: variants.map((v) => ({
        size: v.size,
        color: { name: v.color.name, code: v.color.code },
        stock: Number(v.stock),
      })),
    };

    // stock only applies when there are no variants — matches the backend rule
    if (variants.length === 0) payload.stock = Number(form.stock);

    const mutation = isEditMode ? updateMutation : createMutation;
    const mutationPayload = isEditMode ? { slug, ...payload } : payload;

    mutation.mutate(mutationPayload, {
      onSuccess: (savedProduct) => navigate(`/admin/products/${savedProduct.slug}/edit`),
      onError: (err) => setError(err.response?.data?.message || "Could not save product"),
    });
  };

  if (isEditMode && productLoading) return <p className="text-gray-500">Loading product...</p>;

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">{isEditMode ? "Edit Product" : "Add Product"}</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {uploadError && (
  <p className="text-red-500 mb-4">{uploadError}</p>
)}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 rounded-xl p-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1">Name</label>
            <input name="name" value={form.name} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">SKU</label>
            <input name="sku" value={form.sku} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} required rows={4} className="w-full border rounded-lg px-3 py-2" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1">Category</label>
            <select name="category" value={form.category} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2">
              <option value="">Select category</option>
              {categoriesData?.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Brand (optional)</label>
            <select name="brand" value={form.brand} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
              <option value="">No brand</option>
              {brandsData?.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1">Price</label>
            <input type="number" step="0.01" name="price" value={form.price} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Sale Price (optional)</label>
            <input type="number" step="0.01" name="salePrice" value={form.salePrice} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1">Thumbnail</label>
            <div className="flex items-center gap-3 mb-2">
              {form.thumbnail && (
                <img src={form.thumbnail} alt="" className="w-14 h-14 object-cover rounded-lg border border-gray-200" />
              )}
              <label className="flex items-center gap-2 text-sm border rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50">
                {thumbnailUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                {thumbnailUploading ? "Uploading..." : "Upload image"}
                <input type="file" accept="image/*" onChange={handleThumbnailFileChange} disabled={thumbnailUploading} className="hidden" />
              </label>
            </div>
            <input
              name="thumbnail"
              value={form.thumbnail}
              onChange={handleChange}
              placeholder="Or paste a URL"
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Additional Images</label>
            <div className="mb-2">
              <label className="flex items-center gap-2 text-sm border rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50 w-fit">
                {imagesUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                {imagesUploading ? "Uploading..." : "Upload images"}
                <input type="file" accept="image/*" multiple onChange={handleImagesFileChange} disabled={imagesUploading} className="hidden" />
              </label>
            </div>
            <input
              name="images"
              value={form.images}
              onChange={handleChange}
              placeholder="Or paste comma-separated URLs"
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Tags (comma separated)</label>
          <input name="tags" value={form.tags} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
          Featured on homepage
        </label>

        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold">Inventory</h3>
            <button type="button" onClick={addVariant} className="flex items-center gap-1 text-sm text-yellow-600 hover:text-yellow-700">
              <Plus size={16} /> Add Size/Color Variant
            </button>
          </div>

          {variants.length === 0 ? (
            <div>
              <label className="text-sm font-medium block mb-1">Stock (no variants)</label>
              <input type="number" name="stock" value={form.stock} onChange={handleChange} className="w-40 border rounded-lg px-3 py-2" />
              <p className="text-xs text-gray-400 mt-1">This product has no size/color variants — stock is tracked at the product level.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {variants.map((v, i) => (
                <div key={i} className="flex items-center gap-3 border border-gray-200 rounded-lg p-3">
                  <input placeholder="Size (e.g. M)" value={v.size} onChange={(e) => handleVariantChange(i, "size", e.target.value)} className="w-24 border rounded px-2 py-1 text-sm" />
                  <input placeholder="Color name" value={v.color.name} onChange={(e) => handleVariantChange(i, "colorName", e.target.value)} className="w-32 border rounded px-2 py-1 text-sm" />
                  <input type="color" value={v.color.code || "#000000"} onChange={(e) => handleVariantChange(i, "colorCode", e.target.value)} className="w-10 h-8 border rounded" />
                  <input type="number" placeholder="Stock" value={v.stock} onChange={(e) => handleVariantChange(i, "stock", e.target.value)} className="w-20 border rounded px-2 py-1 text-sm" />
                  <button type="button" onClick={() => removeVariant(i)} className="text-gray-400 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4">
            <label className="text-sm font-medium block mb-1">Low Stock Alert Threshold</label>
            <input type="number" name="lowStockThreshold" value={form.lowStockThreshold} onChange={handleChange} className="w-40 border rounded-lg px-3 py-2" />
          </div>
        </div>

        <div className="border-t pt-6 grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1">Meta Title</label>
            <input name="metaTitle" value={form.metaTitle} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Meta Description</label>
            <input name="metaDescription" value={form.metaDescription} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
          </div>
        </div>

        <button
          type="submit"
          disabled={createMutation.isPending || updateMutation.isPending}
          className="bg-black text-white px-6 py-3 rounded-full hover:bg-yellow-500 hover:text-black transition disabled:opacity-40"
        >
          {createMutation.isPending || updateMutation.isPending ? "Saving..." : isEditMode ? "Update Product" : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default AdminProductFormPage;