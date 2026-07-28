import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAdminUsersQuery, useUpdateUserMutation } from "../../hooks/useAdminUsers";

const formatDate = (d) => new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

const AdminUsersPage = () => {
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminUsersQuery({ search, role, page, limit: 15 });
  const updateMutation = useUpdateUserMutation();

  const handleToggleRole = (u) => {
    const newRole = u.role === "admin" ? "customer" : "admin";
    if (!window.confirm(`Change ${u.firstName} ${u.lastName} to ${newRole}?`)) return;
    updateMutation.mutate({ id: u._id, role: newRole });
  };

  const handleToggleActive = (u) => {
    const action = u.isActive ? "deactivate" : "reactivate";
    if (!window.confirm(`Are you sure you want to ${action} ${u.firstName} ${u.lastName}?`)) return;
    updateMutation.mutate({ id: u._id, isActive: !u.isActive });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="border rounded-lg px-4 py-2 w-72"
        />
        <select value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }} className="border rounded-lg px-4 py-2">
          <option value="">All Roles</option>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">Loading...</td></tr>
            ) : data?.users?.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">No users found</td></tr>
            ) : (
              data?.users?.map((u) => {
                const isSelf = u._id === currentUser?.id;
                return (
                  <tr key={u._id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium">
                      {u.firstName} {u.lastName} {isSelf && <span className="text-xs text-gray-400">(You)</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${u.role === "admin" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                        {u.isActive ? "Active" : "Deactivated"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      {isSelf ? (
                        <span className="text-xs text-gray-400">—</span>
                      ) : (
                        <div className="flex items-center gap-3 text-xs">
                          <button onClick={() => handleToggleRole(u)} className="text-yellow-600 hover:underline">
                            {u.role === "admin" ? "Demote" : "Promote"}
                          </button>
                          <button onClick={() => handleToggleActive(u)} className={u.isActive ? "text-red-500 hover:underline" : "text-green-600 hover:underline"}>
                            {u.isActive ? "Deactivate" : "Reactivate"}
                          </button>
                        </div>
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

export default AdminUsersPage;