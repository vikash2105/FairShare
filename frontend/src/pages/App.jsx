import React, { useEffect, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { api, getToken, setToken } from "../lib";

export default function App(){
  const [me, setMe] = useState(null);
  const nav = useNavigate();

  useEffect(()=>{
    const t = getToken();
    if (!t) return nav("/signin");
    api.get("/auth/me").then(r=> setMe(r.data)).catch(()=> nav("/signin"));
  },[]);

  function logout(){
    setToken(null);
    nav("/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
          <Link to="/" className="font-semibold text-lg">FairShare</Link>
          <nav className="flex gap-4 text-sm">
            <Link to="/">Dashboard</Link>
          </nav>
          <div className="text-sm">
            {me ? <><span className="mr-3">Hi, {me.name}</span><button onClick={logout} className="button">Logout</button></> : null}
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-4">
        <Outlet context={{ me }} />
      </main>
    </div>
  );
}
