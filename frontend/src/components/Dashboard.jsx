import React, { useEffect, useState } from "react";
import { api } from "../lib";
import { Link } from "react-router-dom";
import { FaUsers, FaMoneyBill } from "react-icons/fa";

export default function Dashboard({ user }) {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    api.get("/api/groups/mine").then(r => setGroups(r.data));
  }, []);

  async function createGroup(e) {
    e.preventDefault();
    const r = await api.post("/api/groups", { name, description });
    setGroups([r.data, ...groups]);
    setName("");
    setDescription("");
    setSuccessMessage("Group created successfully!");
    setTimeout(() => setSuccessMessage(""), 4000);
  }

  async function joinGroup(e) {
    e.preventDefault();
    await api.post("/api/groups/join", { inviteCode });
    const refreshed = await api.get("/api/groups/mine");
    setGroups(refreshed.data);
    setInviteCode("");
    setSuccessMessage("Joined group successfully!");
    setTimeout(() => setSuccessMessage(""), 4000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.name || ""}! 👋
        </h1>
        <p className="text-gray-600">Manage your group expenses easily</p>
        <div className="mt-4 flex justify-center gap-4">
          <form onSubmit={createGroup}>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-purple-600 text-white shadow hover:bg-purple-700"
            >
              ➕ Create New Group
            </button>
          </form>
          <form onSubmit={joinGroup}>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-green-600 text-white shadow hover:bg-green-700"
            >
              🔗 Join Group
            </button>
          </form>
        </div>
      </div>

      {/* Groups Section */}
      {groups.length === 0 ? (
        <div className="text-center text-gray-600 mt-12">
          <FaUsers className="mx-auto text-5xl text-purple-600 mb-4" />
          <h2 className="text-lg font-semibold">No groups yet</h2>
          <p>Create your first group or join an existing one</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map(g => (
            <div
              key={g._id}
              className="bg-white shadow rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{g.name}</h3>
                <FaMoneyBill className="text-yellow-500" />
              </div>
              <p className="text-gray-600">{g.description}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="flex items-center text-sm text-gray-500">
                  <FaUsers className="mr-1" /> {g.members?.length || 1} members
                </span>
                <Link
                  to={`/groups/${g._id}`}
                  className="text-purple-600 hover:underline text-sm font-medium"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Success Popup */}
      {successMessage && (
        <div className="fixed bottom-6 right-6 bg-white shadow-lg px-6 py-3 rounded-lg border-l-4 border-green-500 text-gray-700 animate-fade-in">
          ✅ {successMessage}
        </div>
      )}
    </div>
  );
}
