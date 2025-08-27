import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      onAuth(r.data.token, r.data.user);
      setToken(r.data.token);
      navigate("/");
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2">
          Split Bills with Friends 💸
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Track expenses, settle debts, and keep friendships intact
        </p>

        <form onSubmit={submit} className="space-y-4">
          <input
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Sign in
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up instead
          </a>
        </p>
      </div>
    </div>
  );
}
