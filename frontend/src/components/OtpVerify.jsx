import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../lib";

export default function OtpVerify() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const email = query.get("email");

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const r = await api.post("/api/auth/verify-otp", { email, otp });

      if (r.data.success) {
        alert("✅ Account verified successfully! Please sign in.");
        navigate("/signin");
      } else {
        setError("Invalid or expired OTP.");
      }
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  }

  async function resendOtp() {
    setError("");
    try {
      await api.post("/api/auth/resend-otp", { email });
      alert("📩 A new OTP has been sent to your email.");
    } catch (e) {
      setError(e.response?.data?.error || "Failed to resend OTP.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md animate-fade-in">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Verify Your Email</h1>
          <p className="text-gray-600 text-sm">
            We’ve sent a 6-digit OTP to{" "}
            <span className="font-medium text-blue-600">{email}</span>.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <input
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
          />
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded-md">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition transform hover:scale-[1.02]"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Didn’t get the code?{" "}
          <button
            type="button"
            onClick={resendOtp}
            className="text-blue-600 hover:underline font-medium"
          >
            Resend OTP
          </button>
        </p>
      </div>
    </div>
  );
}
