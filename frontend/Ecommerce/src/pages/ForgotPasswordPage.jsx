import { useState } from "react";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "../hooks/useAuthMutations";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const mutation = useForgotPasswordMutation();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    mutation.mutate(email, {
      onSuccess: (data) => setMessage(data.message),
      onError: (err) => setError(err.response?.data?.message || "Something went wrong"),
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h1 className="text-2xl font-semibold mb-4">Forgot Password</h1>
      <p className="text-sm text-gray-500 mb-4">Enter your email and we'll send you a link to reset your password.</p>

      {message && <p className="text-green-600 mb-3 text-sm">{message}</p>}
      {error && <p className="text-red-600 mb-3 text-sm">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border rounded px-3 py-2" />
        <button type="submit" disabled={mutation.isPending} className="w-full bg-black text-white rounded px-3 py-2 disabled:opacity-40">
          {mutation.isPending ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <p className="mt-4 text-sm">
        Remembered your password? <Link to="/login" className="underline">Login</Link>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;