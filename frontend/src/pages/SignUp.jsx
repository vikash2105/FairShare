import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, setToken } from "../lib";

export default function SignUp(){
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    try{
      const r = await api.post("/auth/signup", { name, email, password });
      setToken(r.data.token);
      nav("/");
    }catch(e){ setErr(e.response?.data?.error || "Signup failed"); }
  }

  return (
    <div className="max-w-md mx-auto mt-16 card">
      <h1 className="text-xl font-semibold mb-4">Create account</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <div className="text-sm text-red-600">{err}</div>}
        <button className="button w-full">Sign up</button>
      </form>
      <p className="text-sm mt-3">Have an account? <Link to="/signin" className="text-indigo-600">Sign in</Link></p>
    </div>
  );
}
