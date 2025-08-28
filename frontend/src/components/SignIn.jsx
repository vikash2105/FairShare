import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, setToken } from "../lib";

export default function SignIn({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      const r = await api.post("/api/auth/signin", { email, password });

      // Save token + auth
      onAuth(r.data.token, r.data.user);
      setToken(r.data.token);

      // If backend tells us the user needs verification → redirect to OTP
      if (r.data?.requiresVerification) {
        navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
      } else {
        navigate("/");
      }
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md animate-fade-in">
        {/* Branding / Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            Welcome Back 👋
          </h1>
          <p className="text-gray-600 text-sm">
            Sign in to{" "}
            <span className="font-semibold text-blue-600">FairShareAI</span>
            & split smarter with friends
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-4">
          <input
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded-md">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition transform hover:scale-[1.02]"
          >
            Sign in
          </button>
        </form>

        {/* Footer link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up instead
          </Link>
        </p>
      </div>
    </div>
  );
}
