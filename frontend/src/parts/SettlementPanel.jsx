import React, { useState } from "react";
import { api } from "../lib";

export default function SettlementPanel({ groupId, members=[], settlements=[], onAdded }){
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  async function submit(e){
    e.preventDefault();
    await api.post("/settlements", { groupId, from, to, amount: Number(amount), note });
    setFrom(""); setTo(""); setAmount(""); setNote("");
    onAdded?.();
  }

  return (
    <div className="grid gap-4">
      <div className="card">
        <h3 className="font-semibold mb-2">Record settlement</h3>
        <form onSubmit={submit} className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <select className="input" value={from} onChange={e=>setFrom(e.target.value)}>
            <option value="">From</option>
            {members.map(m=> <option key={m._id} value={m._id}>{m.name}</option>)}
          </select>
          <select className="input" value={to} onChange={e=>setTo(e.target.value)}>
            <option value="">To</option>
            {members.map(m=> <option key={m._id} value={m._id}>{m.name}</option>)}
          </select>
          <input className="input" placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} />
          <input className="input" placeholder="Note" value={note} onChange={e=>setNote(e.target.value)} />
          <div className="md:col-span-4"><button className="button">Save</button></div>
        </form>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-2">History</h3>
        {!settlements.length ? <div className="text-sm text-gray-500">No settlements</div> : (
          <ul className="divide-y">
            {settlements.map(s => (
              <li key={s._id} className="py-2 text-sm">
                <b>{s.from?.name || "Someone"}</b> paid <b>{s.to?.name || "Someone"}</b> ₹{s.amount}
                {s.note ? <> — <span className="text-gray-500">{s.note}</span></> : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
