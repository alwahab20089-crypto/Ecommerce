import { Link } from "react-router-dom";
import { Package, FolderTree, Tag, ShoppingBag } from "lucide-react";

const shortcuts = [
  { label: "Manage Products", path: "/admin/products", icon: Package },
  { label: "Manage Categories", path: "/admin/categories", icon: FolderTree },
  { label: "Manage Brands", path: "/admin/brands", icon: Tag },
  { label: "View Orders", path: "/admin/orders", icon: ShoppingBag },
];

const AdminDashboard = () => (
  <div>
    <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {shortcuts.map(({ label, path, icon: Icon }) => (
        <Link key={path} to={path} className="border border-gray-200 bg-white rounded-xl p-6 hover:border-yellow-500 hover:shadow-md transition flex flex-col items-center text-center gap-3">
          <Icon size={28} className="text-yellow-500" />
          <span className="font-semibold">{label}</span>
        </Link>
      ))}
    </div>
    <p className="text-sm text-gray-400 mt-8">Orders, Users, Coupons, and Reports sections are coming in later phases.</p>
  </div>
);

export default AdminDashboard;