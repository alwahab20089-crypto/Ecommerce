import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { useRegisterMutation, useGoogleAuthMutation } from "../hooks/useAuthMutations";
import { useMergeGuestCartOnLogin } from "../hooks/useMergeGuestCartOnLogin";
import { useMergeGuestWishlistOnLogin } from "../hooks/useMergeGuestWishlistOnLogin";

const RegisterPage = () => {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const mergeGuestCart = useMergeGuestCartOnLogin();
  const mergeGuestWishlist = useMergeGuestWishlistOnLogin();
  const registerMutation = useRegisterMutation();
  const googleAuthMutation = useGoogleAuthMutation();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAuthSuccess = (data) => {
    login({ user: data.user, token: data.token });
    mergeGuestCart();
    mergeGuestWishlist();
    navigate("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    registerMutation.mutate(form, {
      onSuccess: handleAuthSuccess,
      onError: (err) => setError(err.response?.data?.message || "Registration failed"),
    });
  };

  const handleGoogleSuccess = (credentialResponse) => {
    setError("");
    googleAuthMutation.mutate(credentialResponse.credential, {
      onSuccess: handleAuthSuccess,
      onError: (err) => setError(err.response?.data?.message || "Google sign-in failed"),
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h1 className="text-2xl font-semibold mb-4">Create an account</h1>
      {error && <p className="text-red-600 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3">
          <input type="text" name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          <input type="text" name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        <input type="password" name="password" placeholder="Password (min 8 characters)" value={form.password} onChange={handleChange} required minLength={8} className="w-full border rounded px-3 py-2" />
        <input type="tel" name="phone" placeholder="Phone (optional)" value={form.phone} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        <button type="submit" disabled={registerMutation.isPending} className="w-full bg-black text-white rounded px-3 py-2">
          {registerMutation.isPending ? "Creating account..." : "Create account"}
        </button>
      </form>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">OR</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="flex justify-center">
        <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError("Google sign-in failed")} />
      </div>

      <p className="mt-4 text-sm">
        Already have an account? <Link to="/login" className="underline">Login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;