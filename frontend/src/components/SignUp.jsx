import React, { useState } from "react"; 
import { useNavigate, Link } from "react-router-dom";
import { api } from "../lib";  // no setToken here

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      // call signup API
      const r = await api.post("/api/auth/signup", { email, password, name });

      if (r.data?.requiresVerification) {
        // redirect to OTP verify page with email
        navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
      } else {
        // fallback (in case verification is off)
        navigate("/signin");
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
            Create Your Account ✨
          </h1>
          <p className="text-gray-600 text-sm">
            Join <span className="font-semibold text-blue-600">FairShareAI</span>  
              and split smarter with friends
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-4">
          <input
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            Sign up
          </button>
        </form>

        {/* Footer link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
}
