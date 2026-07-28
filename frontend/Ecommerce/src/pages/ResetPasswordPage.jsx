import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useResetPasswordMutation } from "../hooks/useAuthMutations";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const mutation = useResetPasswordMutation();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    mutation.mutate(
      { token, password },
      {
        onSuccess: (data) => {
          login({ user: data.user, token: data.token });
          navigate("/");
        },
        onError: (err) => setError(err.response?.data?.message || "Could not reset password"),
      }
    );
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h1 className="text-2xl font-semibold mb-4">Reset Password</h1>

      {error && <p className="text-red-600 mb-3 text-sm">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="password" placeholder="New password (min 8 characters)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="w-full border rounded px-3 py-2" />
        <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full border rounded px-3 py-2" />
        <button type="submit" disabled={mutation.isPending} className="w-full bg-black text-white rounded px-3 py-2 disabled:opacity-40">
          {mutation.isPending ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      <p className="mt-4 text-sm">
        <Link to="/login" className="underline">Back to Login</Link>
      </p>
    </div>
  );
};

export default ResetPasswordPage;