import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { api, setToken, getToken } from "./lib";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";
import GroupDetails from "./components/GroupDetails";

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const t = getToken();
    if (t) {
      api.get("/api/auth/me")
        .then(r => setUser(r.data.user))
        .catch(() => setUser(null));
    }
  }, []);

  function handleSignout() {
    setToken(null);
    setUser(null);
    navigate("/signin");
  }

  return (
    <div className="container py-6">
      <header className="flex items-center justify-between mb-6">
        <Link to="/" className="text-xl font-bold">Friends Bills</Link>
        <nav className="space-x-3">
          {user ? (
            <>
              <span className="text-sm">Hi, {user.name || "User"}</span>
              <button className="button" onClick={handleSignout}>Sign out</button>
            </>
          ) : (
            <>
              <Link className="button" to="/signin">Sign in</Link>
              <Link className="button" to="/signup">Sign up</Link>
            </>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={user ? <Dashboard user={user}/> : <Landing/>} />
        <Route path="/signin" element={<SignIn onAuth={(t,u)=>{ setToken(t); setUser(u); }} />} />
        <Route path="/signup" element={<SignUp onAuth={(t,u)=>{ setToken(t); setUser(u); }} />} />
        <Route path="/groups/:id" element={<GroupDetails user={user}/>} />
      </Routes>
    </div>
  );
}

function Landing() {
  return (
    <div className="card">
      <h1 className="text-2xl font-semibold mb-2">Welcome to Friends Bills</h1>
      <p className="mb-4">
        Split expenses with your friends. Create groups, add expenses, track balances, 
        spin for chores, and ask the AI helper.
      </p>
      <div className="flex gap-3">
        <a className="button" href="/signin">Sign in</a>
        <a className="button" href="/signup">Sign up</a>
      </div>
    </div>
  )
}
