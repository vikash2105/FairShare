import React, { useState } from "react";
import { api } from "../../lib";

export default function AddExpense({ group, onAdded }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitAmong, setSplitAmong] = useState([]);
  const [error, setError] = useState("");

  function toggleSplit(id) {
    setSplitAmong(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/api/expenses", {
        groupId: group._id,
        description,
        amount: Number(amount),
        paidBy,
        splitAmong
      });
      setDescription(""); setAmount(""); setPaidBy(""); setSplitAmong([]);
      onAdded?.();
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    }
  }

  return (
    <div>
      <h3 className="font-semibold mb-2">Add Expense</h3>
      <form onSubmit={submit} className="space-y-2">
        <input className="input" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
        <input className="input" placeholder="Amount" type="number" value={amount} onChange={e=>setAmount(e.target.value)} />
        <div>
          <label className="block text-sm mb-1">Paid by</label>
          <select className="input" value={paidBy} onChange={e=>setPaidBy(e.target.value)}>
            <option value="">Select member</option>
            {group.memberDetails.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Split among</label>
          <div className="flex flex-wrap gap-2">
            {group.memberDetails.map(m => (
              <label key={m._id} className={"px-2 py-1 border rounded cursor-pointer " + (splitAmong.includes(m._id) ? "bg-blue-100 border-blue-400" : "")}>
                <input type="checkbox" className="mr-1" checked={splitAmong.includes(m._id)} onChange={()=>toggleSplit(m._id)} />
                {m.name}
              </label>
            ))}
          </div>
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="button">Add</button>
      </form>
    </div>
  );
}
