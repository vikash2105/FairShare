import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib";
import AddExpense from "../parts/AddExpense.jsx";
import ExpenseList from "../parts/ExpenseList.jsx";
import BalanceView from "../parts/BalanceView.jsx";
import SettlementPanel from "../parts/SettlementPanel.jsx";
import AIChat from "../parts/AIChat.jsx";

export default function GroupDetails(){
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [active, setActive] = useState("expenses");
  const [loading, setLoading] = useState(true);

  async function refresh(){
    try {
      const g = await api.get(`/groups/${id}`);
      setGroup(g.data);
      const e = await api.get(`/expenses/group/${id}`);
      setExpenses(e.data);
      const b = await api.get(`/expenses/group/${id}/balances`);
      setBalances(b.data.balances || []);
      const s = await api.get(`/settlements/group/${id}`);
      setSettlements(s.data);
    } finally { setLoading(false); }
  }
  useEffect(()=>{ refresh(); },[id]);

  if (loading) return <div className="card">Loading...</div>;
  if (!group) return <div className="card">Group not found.</div>;

  return (
    <div className="space-y-6">
      <div className="card flex items-center justify-between">
        <div>
          <Link to="/" className="text-sm text-gray-500">← Back</Link>
          <h2 className="text-lg font-semibold">{group.name}</h2>
          <p className="text-sm text-gray-500">Members: {group.memberDetails?.map(m=>m.name).join(", ")}</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">Invite code</div>
          <div className="font-semibold text-indigo-600">{group.inviteCode}</div>
        </div>
      </div>

      <div className="card">
        <div className="flex gap-6 border-b pb-2">
          {["expenses","balances","settlements","ai"].map(t=>(
            <button key={t} onClick={()=>setActive(t)}
              className={active===t ? "border-b-2 border-indigo-600 pb-1" : "text-gray-500 pb-1"}>
              {t==="expenses"&&"💸 Expenses"}
              {t==="balances"&&"⚖️ Balances"}
              {t==="settlements"&&"🤝 Settlements"}
              {t==="ai"&&"🤖 AI Assistant"}
            </button>
          ))}
        </div>
        <div className="mt-4">
          {active==="expenses" && <>
            <AddExpense group={group} onAdded={refresh} />
            <ExpenseList expenses={expenses} />
          </>}
          {active==="balances" && <BalanceView balances={balances} />}
          {active==="settlements" && <SettlementPanel groupId={id} members={group.memberDetails} settlements={settlements} onAdded={refresh} />}
          {active==="ai" && <AIChat groupId={id} />}
        </div>
      </div>
    </div>
  );
}
