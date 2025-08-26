import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib";
import AddExpense from "./parts/AddExpense";
import ExpenseList from "./parts/ExpenseList";
import BalanceView from "./parts/BalanceView";
import SpinWheel from "./parts/SpinWheel";
import AIChat from "./parts/AIChat";

export default function GroupDetails() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [spins, setSpins] = useState([]);

  async function refresh() {
    const g = await api.get(`/api/groups/${id}`);
    setGroup(g.data);
    const e = await api.get(`/api/expenses/group/${id}`);
    setExpenses(e.data);
    const b = await api.get(`/api/expenses/group/${id}/balances`);
    setBalances(b.data);
    const s = await api.get(`/api/group/${id}/spins`);
    setSpins(s.data);
  }

  useEffect(() => { refresh(); }, [id]);

  if (!group) return <div className="card">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold">{group.name}</h2>
        <p className="text-gray-600">{group.description}</p>
        <p className="text-sm text-gray-500 mt-1">Invite code: <b>{group.inviteCode}</b></p>
        <p className="text-sm mt-1">Members: {group.memberDetails.map(m=>m.name).join(", ")}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <AddExpense group={group} onAdded={refresh} />
        </div>
        <div className="card">
          <SpinWheel groupId={group._id} onSpin={refresh} spins={spins} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <ExpenseList expenses={expenses} />
        </div>
        <div className="card">
          <BalanceView balances={balances} />
        </div>
      </div>

      <div className="card">
        <AIChat groupId={group._id} />
      </div>
    </div>
  );
}
