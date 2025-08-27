import React, { useEffect, useState } from "react";
import { api } from "../../lib";

export default function AddExpense({ group, onAdded, currentUser }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitAmong, setSplitAmong] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUser?._id && !paidBy) setPaidBy(currentUser._id);
  }, [currentUser, paidBy]);

  useEffect(() => {
    if (Array.isArray(group?.memberDetails) && splitAmong.length === 0) {
      setSplitAmong(group.memberDetails.map((m) => m._id));
    }
  }, [group]);

  function toggleSplit(id) {
    setSplitAmong((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    const amt = Number(amount);
    if (!description.trim()) return setError("Description required");
    if (!Number.isFinite(amt) || amt <= 0)
      return setError("Enter a valid amount");
    if (!paidBy) return setError("Select who paid");
    if (splitAmong.length === 0) return setError("Select at least one member");

    try {
      await api.post("/api/expenses", {
        groupId: group._id,
        description: description.trim(),
        amount: amt,
        paidBy,
        splitAmong,
      });
      setDescription("");
      setAmount("");
      setPaidBy(currentUser?._id || "");
      setSplitAmong(group.memberDetails?.map((m) => m._id) || []);
      onAdded?.();
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    }
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-3">Add Expense</h3>
      <form onSubmit={submit} className="space-y-4">
        <input
          className="input"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className="input"
          placeholder="Amount"
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div>
          <label className="block text-sm mb-1 font-medium">Paid by</label>
          <select
            className="input"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
          >
            <option value="">Select member</option>
            {group.memberDetails?.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-2 font-medium">Split among</label>
          <div className="flex flex-wrap gap-2">
            {group.memberDetails?.map((m) => (
              <label
                key={m._id}
                className={`px-3 py-1 rounded-lg border cursor-pointer transition ${
                  splitAmong.includes(m._id)
                    ? "bg-blue-100 border-blue-400"
                    : "hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={splitAmong.includes(m._id)}
                  onChange={() => toggleSplit(m._id)}
                />
                {m.name}
              </label>
            ))}
          </div>
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="button w-full">Add</button>
      </form>
    </div>
  );
}
