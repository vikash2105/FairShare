import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, setToken } from "../lib";

export default function SignIn(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    try{
      const r = await api.post("/auth/signin", { email, password });
      setToken(r.data.token);
      nav("/");
    }catch(e){ setErr(e.response?.data?.error || "Login failed"); }
  }

  return (
    <div className="max-w-md mx-auto mt-16 card">
      <h1 className="text-xl font-semibold mb-4">Sign in</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <div className="text-sm text-red-600">{err}</div>}
        <button className="button w-full">Sign in</button>
      </form>
      <p className="text-sm mt-3">No account? <Link to="/signup" className="text-indigo-600">Sign up</Link></p>
    </div>
  );
}
