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
    <div className="min-h-screen flex flex-col">
      {/* Header with branding and auth links */}
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          FairShareAI
        </Link>
        <nav className="space-x-4">
          {user ? (
            <>
              <span className="text-gray-700 mr-2">Hi, {user.name || "User"}</span>
              <button className="button" onClick={handleSignout}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="button">
                Sign in
              </Link>
              <Link to="/signup" className="button">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={user ? <Dashboard user={user} /> : <Landing />} />
          <Route
            path="/signin"
            element={
              <SignIn onAuth={(t, u) => {
                setToken(t);
                setUser(u);
              }} />
            }
          />
          <Route
            path="/signup"
            element={
              <SignUp onAuth={(t, u) => {
                setToken(t);
                setUser(u);
              }} />
            }
          />
          <Route path="/groups/:id" element={<GroupDetails user={user} />} />
        </Routes>
      </main>
    </div>
  );
}

/**
 * Enhanced Landing page inspired by Smart Split
 */
function Landing() {
  return (
    <div className="text-center py-16 px-6 space-y-12">
      {/* Hero: Key benefit + image */}
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
          Split bills easily with{" "}
          <span className="text-blue-600">FairShareAI</span>
        </h1>
        <p className="text-lg text-gray-600">
          Create groups, add expenses, spin for chores, and share fairly with AI-assist.
        </p>
        <Link
          to="/signup"
          className="inline-block bg-blue-600 text-white text-base font-medium py-3 px-6 rounded-full hover:bg-blue-700 transition"
        >
          Get Started
        </Link>
      </div>

      {/* Illustration */}
      <div className="flex justify-center">
        <img
          src="https://smartsplit.vercel.app/static/media/receipt.9a1bbf16.svg"
          alt="Illustration"
          className="w-80 md:w-96 animate-fade-in"
        />
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <Feature
          icon="🧾"
          title="Group Expenses"
          description="Add expenses and split automatically within your group."
        />
        <Feature
          icon="🤖"
          title="AI Assistance"
          description="Ask for help on fair splits or chore decisions."
        />
        <Feature
          icon="🎲"
          title="Spin for Chores"
          description="Randomly assign tasks or decide who pays next—all with a fun spin."
        />
      </div>
    </div>
  );
}

function Feature({ icon, title, description }) {
  return (
    <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
