import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { useLoginMutation, useGoogleAuthMutation } from "../hooks/useAuthMutations";
import { useMergeGuestCartOnLogin } from "../hooks/useMergeGuestCartOnLogin";
import { useMergeGuestWishlistOnLogin } from "../hooks/useMergeGuestWishlistOnLogin";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const mergeGuestCart = useMergeGuestCartOnLogin();
  const mergeGuestWishlist = useMergeGuestWishlistOnLogin();
  const loginMutation = useLoginMutation();
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

    loginMutation.mutate(form, {
      onSuccess: handleAuthSuccess,
      onError: (err) => setError(err.response?.data?.message || "Login failed"),
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
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      {error && <p className="text-red-600 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        <p className="text-sm text-right">
          <Link to="/forgot-password" className="underline text-gray-500 hover:text-black">Forgot password?</Link>
        </p>
        <button type="submit" disabled={loginMutation.isPending} className="w-full bg-black text-white rounded px-3 py-2">
          {loginMutation.isPending ? "Logging in..." : "Login"}
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
        Don't have an account? <Link to="/register" className="underline">Register</Link>
      </p>
    </div>
  );
};

export default LoginPage;