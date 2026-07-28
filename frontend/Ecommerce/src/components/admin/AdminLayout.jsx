import { Link, useLocation, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, FolderTree, Tag, ShoppingBag, Users, Ticket, BarChart3, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Products", path: "/admin/products", icon: Package },
  { label: "Categories", path: "/admin/categories", icon: FolderTree },
  { label: "Brands", path: "/admin/brands", icon: Tag },
  { label: "Orders", path: "/admin/orders", icon: ShoppingBag },
  { label: "Users", path: "/admin/users", icon: Users },
  { label: "Coupons", path: "/admin/coupons", icon: Ticket },
  { label: "Reports", path: "/admin/reports", icon: BarChart3 },
];

const AdminLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-black text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-extrabold tracking-widest">
            <span className="text-yellow-500">TRENDCART</span> Admin
          </h1>
        </div>

        <nav className="flex-1 py-4">
          {navItems.map(({ label, path, icon: Icon }) => {
            const isActive = path === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(path);
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-6 py-3 text-sm transition ${
                  isActive ? "bg-yellow-500 text-black font-semibold" : "text-gray-300 hover:bg-white/5 hover:text-yellow-400"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-gray-400 mb-2 truncate">{user?.firstName} {user?.lastName}</p>
          <button onClick={logout} className="flex items-center gap-2 text-sm text-gray-300 hover:text-red-400 transition">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;