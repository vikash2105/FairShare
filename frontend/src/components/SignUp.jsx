import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, setToken } from "../lib";

export default function SignUp({ onAuth }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      const r = await api.post("/api/auth/signup", { email, password, name });
      onAuth(r.data.token, r.data.user);
      setToken(r.data.token);
      navigate("/");
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    }
  }

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Create account</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="button w-full">Sign up</button>
      </form>
    </div>
  );
}
