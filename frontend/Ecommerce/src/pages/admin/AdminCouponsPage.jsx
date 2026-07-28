import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useAdminCouponsQuery, useCreateCouponMutation, useUpdateCouponMutation, useDeleteCouponMutation } from "../../hooks/useAdminCoupons";

const emptyForm = {
  code: "", discountType: "percentage", discountValue: "", maxDiscountAmount: "",
  minOrderValue: "", usageLimit: "", perUserLimit: 1, expiryDate: "", isActive: true,
};

const formatDate = (d) => new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

const AdminCouponsPage = () => {
  const { user } = useAuth();
  const { data: coupons, isLoading } = useAdminCouponsQuery();
  const createMutation = useCreateCouponMutation();
  const updateMutation = useUpdateCouponMutation();
  const deleteMutation = useDeleteCouponMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingCode, setEditingCode] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const openCreate = () => { setForm(emptyForm); setEditingCode(null); setShowForm(true); setError(""); };

  const openEdit = (c) => {
    setForm({
      code: c.code,
      discountType: c.discountType,
      discountValue: c.discountValue,
      maxDiscountAmount: c.maxDiscountAmount ?? "",
      minOrderValue: c.minOrderValue ?? "",
      usageLimit: c.usageLimit ?? "",
      perUserLimit: c.perUserLimit,
      expiryDate: c.expiryDate?.slice(0, 10) || "",
      isActive: c.isActive,
    });
    setEditingCode(c.code);
    setShowForm(true);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      ...form,
      discountValue: Number(form.discountValue),
      maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : null,
      minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : 0,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
      perUserLimit: Number(form.perUserLimit),
    };

    const mutation = editingCode ? updateMutation : createMutation;
    const mutationPayload = editingCode ? { code: editingCode, ...payload } : payload;

    mutation.mutate(mutationPayload, {
      onSuccess: () => setShowForm(false),
      onError: (err) => setError(err.response?.data?.message || "Could not save coupon"),
    });
  };

  const handleDelete = (code) => {
    if (!window.confirm(`Delete coupon "${code}"?`)) return;
    deleteMutation.mutate(code);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <button onClick={openCreate} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-yellow-500 hover:text-black transition">
          <Plus size={18} /> Add Coupon
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 mb-6 space-y-4 relative">
          <button type="button" onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">
            <X size={18} />
          </button>
          <h3 className="font-bold">{editingCode ? `Edit Coupon (${editingCode})` : "New Coupon"}</h3>
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="grid sm:grid-cols-2 gap-4">
            <input
              name="code"
              placeholder="Code (e.g. WELCOME10)"
              value={form.code}
              onChange={handleChange}
              required
              disabled={!!editingCode}
              className="border rounded-lg px-3 py-2 uppercase disabled:bg-gray-100"
            />
            <select name="discountType" value={form.discountType} onChange={handleChange} className="border rounded-lg px-3 py-2">
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <input type="number" name="discountValue" placeholder={form.discountType === "percentage" ? "Discount %" : "Discount $"} value={form.discountValue} onChange={handleChange} required className="border rounded-lg px-3 py-2" />
            {form.discountType === "percentage" && (
              <input type="number" name="maxDiscountAmount" placeholder="Max discount $ (optional)" value={form.maxDiscountAmount} onChange={handleChange} className="border rounded-lg px-3 py-2" />
            )}
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <input type="number" name="minOrderValue" placeholder="Min order value" value={form.minOrderValue} onChange={handleChange} className="border rounded-lg px-3 py-2" />
            <input type="number" name="usageLimit" placeholder="Total usage limit (optional)" value={form.usageLimit} onChange={handleChange} className="border rounded-lg px-3 py-2" />
            <input type="number" name="perUserLimit" placeholder="Uses per user" value={form.perUserLimit} onChange={handleChange} className="border rounded-lg px-3 py-2" />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Expiry Date</label>
            <input type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange} required className="border rounded-lg px-3 py-2" />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
            Active
          </label>

          <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="bg-black text-white px-5 py-2 rounded-full hover:bg-yellow-500 hover:text-black transition disabled:opacity-40">
            {editingCode ? "Update" : "Create"}
          </button>
        </form>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Discount</th>
              <th className="px-4 py-3">Used</th>
              <th className="px-4 py-3">Expires</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">Loading...</td></tr>
            ) : coupons?.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">No coupons yet</td></tr>
            ) : (
              coupons?.map((c) => {
                const isOwner = c.createdBy === user?.id;
                const isExpired = new Date(c.expiryDate) < new Date();
                return (
                  <tr key={c._id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-mono font-semibold">{c.code}</td>
                    <td className="px-4 py-3">
                      {c.discountType === "percentage" ? `${c.discountValue}%` : `$${c.discountValue}`}
                      {c.maxDiscountAmount ? ` (max $${c.maxDiscountAmount})` : ""}
                    </td>
                    <td className="px-4 py-3">{c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ""}</td>
                    <td className="px-4 py-3">
                      <span className={isExpired ? "text-red-500" : "text-gray-600"}>{formatDate(c.expiryDate)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${c.isActive && !isExpired ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                        {isExpired ? "Expired" : c.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {isOwner ? (
                        <div className="flex items-center gap-3">
                          <button onClick={() => openEdit(c)} className="text-gray-500 hover:text-yellow-600"><Pencil size={16} /></button>
                          <button onClick={() => handleDelete(c.code)} className="text-gray-500 hover:text-red-500"><Trash2 size={16} /></button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400" title="Only the admin who created this can edit or delete it">Locked</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCouponsPage;