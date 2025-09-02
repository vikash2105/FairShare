import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib";

export default function Dashboard(){
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(()=>{ api.get("/groups/mine").then(r=> setGroups(r.data)); },[]);

  async function createGroup(e){
    e.preventDefault();
    const r = await api.post("/groups", { name, description });
    setGroups([r.data, ...groups]);
    setName(""); setDescription("");
  }

  return (
    <div>
      <div className="card max-w-lg mb-6">
        <h2 className="font-semibold mb-2">Create group</h2>
        <form onSubmit={createGroup} className="grid grid-cols-3 gap-2">
          <input className="input col-span-1" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="input col-span-1" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
          <button className="button">Create</button>
        </form>
      </div>

      {groups.length === 0 ? <div className="text-gray-500">No groups yet.</div> : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map(g => (
            <div key={g._id} className="card">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{g.name}</h3>
                <span className="text-xs text-gray-500">{g.members?.length} members</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{g.description}</p>
              <Link to={`/groups/${g._id}`} className="text-indigo-600 text-sm">View details →</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
