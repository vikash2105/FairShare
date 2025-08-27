import React, { useEffect, useState } from "react";
import { api } from "../lib";
import { Link } from "react-router-dom";

export default function Dashboard({ user }) {
  const [groups, setGroups] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    api.get("/api/groups/mine").then((r) => setGroups(r.data));
  }, []);

  async function createGroup(e) {
    e.preventDefault();
    const r = await api.post("/api/groups", { name, description });
    setGroups([r.data, ...groups]);
    setName("");
    setDescription("");
    setShowCreate(false);
    showSuccess("Group created successfully!");
  }

  async function joinGroup(e) {
    e.preventDefault();
    await api.post("/api/groups/join", { inviteCode });
    const refreshed = await api.get("/api/groups/mine");
    setGroups(refreshed.data);
    setInviteCode("");
    setShowJoin(false);
    showSuccess("Joined group successfully!");
  }

  function showSuccess(message) {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 4000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6">
      {/* Top Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.name || ""}! 👋
        </h1>
        <p className="text-gray-600">Manage your group expenses easily</p>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4 mb-10">
        <button
          onClick={() => { setShowCreate(true); setShowJoin(false); }}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
        >
          ➕ Create New Group
        </button>
        <button
          onClick={() => { setShowJoin(true); setShowCreate(false); }}
          className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          🔗 Join Group
        </button>
      </div>

      {/* Create Group Form */}
      {showCreate && (
        <div className="card max-w-md mx-auto mb-6">
          <button
            className="text-sm text-gray-500 mb-2"
            onClick={() => setShowCreate(false)}
          >
            ← Back
          </button>
          <h2 className="text-lg font-semibold mb-4">Create New Group</h2>
          <form onSubmit={createGroup} className="space-y-3">
            <input
              className="input w-full"
              placeholder="Group Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <textarea
              className="input w-full"
              placeholder="Description (Optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button className="button w-full bg-purple-600 text-white">
              Create Group
            </button>
          </form>
        </div>
      )}

      {/* Join Group Form */}
      {showJoin && (
        <div className="card max-w-md mx-auto mb-6">
          <button
            className="text-sm text-gray-500 mb-2"
            onClick={() => setShowJoin(false)}
          >
            ← Back
          </button>
          <h2 className="text-lg font-semibold mb-4">Join Group</h2>
          <form onSubmit={joinGroup} className="space-y-3">
            <input
              className="input w-full"
              placeholder="Enter Invite Code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              required
            />
            <button className="button w-full bg-green-600 text-white">
              Join Group
            </button>
          </form>
        </div>
      )}

      {/* Success Popup */}
      {successMessage && (
        <div className="fixed bottom-6 right-6 bg-white shadow-lg rounded-md px-4 py-3 text-sm text-gray-800 flex items-center gap-2 border">
          ✅ {successMessage}
        </div>
      )}

      {/* Groups */}
      {groups.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <div className="text-5xl mb-2">👥</div>
          <p className="font-medium">No groups yet</p>
          <p className="text-sm">Create your first group or join an existing one</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((g) => (
            <div
              key={g._id}
              className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{g.name}</h3>
                <span className="text-xl">💰</span>
              </div>
              <p className="text-gray-600 mb-3">{g.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>👥 {g.members?.length || 1} members</span>
                <Link
                  to={`/groups/${g._id}`}
                  className="text-purple-600 hover:underline"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
