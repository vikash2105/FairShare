import React, { useMemo, useState } from "react";
import { api } from "../lib";

export default function AddExpense({ group, onAdded }){
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("general");
  const [splitMethod, setSplitMethod] = useState("equal");
  const [selected, setSelected] = useState(group.memberDetails?.map(m=>m._id) || []);
  const [exacts, setExacts] = useState({});
  const [percents, setPercents] = useState({});
  const [error, setError] = useState("");

  const members = group.memberDetails || [];

  function toggle(id){
    setSelected(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
  }

  async function submit(e){
    e.preventDefault();
    setError("");
    try {
      const payload = splitMethod==="exact"
        ? { exacts: selected.map(u => ({ user: u, amount: Number(exacts[u]||0) })) }
        : splitMethod==="percent"
          ? { percents: selected.map(u => ({ user: u, percent: Number(percents[u]||0) })) }
          : undefined;

      const r = await api.post("/expenses", {
        groupId: group._id,
        description,
        amount: Number(amount),
        category,
        splitMethod,
        participants: selected,
        // paidBy is resolved on backend from token in real app; for demo allow undefined
      });
      onAdded?.();
      setDescription(""); setAmount("");
    } catch(e){
      setError(e.response?.data?.error || "Failed to add expense");
    }
  }

  return (
    <div className="card mb-4">
      <h3 className="font-semibold mb-2">Add expense</h3>
      <form onSubmit={submit} className="grid gap-2 md:grid-cols-4">
        <input className="input" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
        <input className="input" placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} />
        <select className="input" value={category} onChange={e=>setCategory(e.target.value)}>
          {["general","food","travel","rent","utilities","shopping","entertainment","other"].map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <select className="input" value={splitMethod} onChange={e=>setSplitMethod(e.target.value)}>
          <option value="equal">Equal</option>
          <option value="exact">Exact</option>
          <option value="percent">Percent</option>
        </select>
        <div className="md:col-span-4">
          <div className="font-medium mb-1">Participants</div>
          <div className="flex flex-wrap gap-2">
            {members.map(m=>(
              <label key={m._id} className={"px-3 py-1 border rounded-full cursor-pointer " + (selected.includes(m._id) ? "bg-indigo-50 border-indigo-400" : "")}>
                <input type="checkbox" className="mr-2" checked={selected.includes(m._id)} onChange={()=>toggle(m._id)} />
                {m.name}
              </label>
            ))}
          </div>
        </div>
        {splitMethod==="exact" && (
          <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-2">
            {selected.map(uid => {
              const m = members.find(x=>x._id===uid);
              return <input key={uid} className="input" placeholder={`${m?.name} exact`} value={exacts[uid]||""} onChange={e=>setExacts(s=>({...s,[uid]:e.target.value}))} />
            })}
          </div>
        )}
        {splitMethod==="percent" && (
          <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-2">
            {selected.map(uid => {
              const m = members.find(x=>x._id===uid);
              return <input key={uid} className="input" placeholder={`${m?.name} %`} value={percents[uid]||""} onChange={e=>setPercents(s=>({...s,[uid]:e.target.value}))} />
            })}
          </div>
        )}
        {error && <div className="text-sm text-red-600 md:col-span-4">{error}</div>}
        <div className="md:col-span-4">
          <button className="button">Add</button>
        </div>
      </form>
    </div>
  );
}
