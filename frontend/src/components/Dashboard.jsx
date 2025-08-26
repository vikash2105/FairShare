import React, { useEffect, useState } from "react";
import { api } from "../lib";
import { Link } from "react-router-dom";

export default function Dashboard({ user }) {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  useEffect(() => {
    api.get("/api/groups/mine").then(r => setGroups(r.data));
  }, []);

  async function createGroup(e) {
    e.preventDefault();
    const r = await api.post("/api/groups", { name, description });
    setGroups([r.data, ...groups]);
    setName(""); setDescription("");
  }

  async function joinGroup(e) {
    e.preventDefault();
    await api.post("/api/groups/join", { inviteCode });
    const refreshed = await api.get("/api/groups/mine");
    setGroups(refreshed.data);
    setInviteCode("");
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-lg font-semibold mb-2">Your Groups</h2>
        <ul className="list-disc pl-5">
          {groups.map(g => (
            <li key={g._id}>
              <Link className="text-blue-600 underline" to={`/groups/${g._id}`}>{g.name}</Link>
              <span className="text-sm text-gray-600 ml-2">{g.description}</span>
            </li>
          ))}
          {!groups.length && <li>No groups yet</li>}
        </ul>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-semibold mb-2">Create Group</h3>
          <form onSubmit={createGroup} className="space-y-2">
            <input className="input" placeholder="Group name" value={name} onChange={e=>setName(e.target.value)} />
            <input className="input" placeholder="Description (optional)" value={description} onChange={e=>setDescription(e.target.value)} />
            <button className="button">Create</button>
          </form>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-2">Join Group</h3>
          <form onSubmit={joinGroup} className="space-y-2">
            <input className="input" placeholder="Invite code (e.g. A1B2C3)" value={inviteCode} onChange={e=>setInviteCode(e.target.value)} />
            <button className="button">Join</button>
          </form>
        </div>
      </div>
    </div>
  );
}
