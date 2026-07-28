import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CheckoutPage from "./pages/CheckoutPage";
import CartPage from "./pages/CartPage";
import Layout from "./components/Layout";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import WishlistPage from "./pages/WishlistPage";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminOrderDetailPage from "./pages/admin/AdminOrderDetailPage";
import AdminCouponsPage from "./pages/admin/AdminCouponsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminReportsPage from "./pages/admin/AdminReportsPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminProductFormPage from "./pages/admin/AdminProductFormPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import ContactPage from "./pages/ContactPage";
import About from "./pages/about";
import AdminBrandsPage from "./pages/admin/AdminBrandsPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import TermsPage from "./pages/TermsPage";

import ResetPasswordPage from "./pages/ResetPasswordPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/privacy-policy" element={<Layout><PrivacyPolicyPage /></Layout>} />
        <Route path="/terms" element={<Layout><TermsPage /></Layout>} />

        <Route
          path="/product/:slug"
          element={
            <Layout>
              <ProductDetails />
            </Layout>
          }
        />


        <Route path="/orders" element={<Layout><OrdersPage /></Layout>} />
        <Route path="/orders/:id" element={<Layout><OrderDetailPage /></Layout>} />

        <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />
        <Route path="/forgot-password" element={<Layout><ForgotPasswordPage /></Layout>} />
        <Route path="/reset-password/:token" element={<Layout><ResetPasswordPage /></Layout>} />
        <Route
          path="/cart"
          element={
            <Layout>
              <CartPage />
            </Layout>
          }
        />
        <Route path="/wishlist" element={<Layout><WishlistPage /></Layout>} />

        <Route
          path="/login"
          element={
            <Layout>
              <LoginPage />
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout>
              <RegisterPage />
            </Layout>
          }

        />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/new" element={<AdminProductFormPage />} />
          <Route path="products/:slug/edit" element={<AdminProductFormPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="brands" element={<AdminBrandsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="orders/:id" element={<AdminOrderDetailPage />} />
          <Route path="coupons" element={<AdminCouponsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
        </Route>
      </Routes>


    </BrowserRouter>
  );
}

export default App;