import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib";
import AddExpense from "./parts/AddExpense";
import ExpenseList from "./parts/ExpenseList";
import BalanceView from "./parts/BalanceView";
import SpinWheel from "./parts/SpinWheel";
import AIChat from "./parts/AIChat";

export default function GroupDetails({ currentUser }) {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [spins, setSpins] = useState([]);
  const [activeTab, setActiveTab] = useState("expenses");
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const g = await api.get(`/groups/${id}`);
      setGroup(g.data);

      const e = await api.get(`/expenses/${id}`);      // unified
      setExpenses(e.data);

      const b = await api.get(`/balances/${id}`);      // unified
      setBalances(b.data.balances || []);

      const s = await api.get(`/spins/${id}`);         // unified
      setSpins(s.data);
    } catch (err) {
      console.error("Error loading group details:", err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, [id]);

  if (loading) return <div className="card">Loading...</div>;
  if (!group) return <div className="card">Group not found.</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">
          Welcome back, <span className="wave">👋</span>
        </h1>
        <p className="text-gray-600">Manage your group expenses easily</p>
      </div>

      {/* Group Info Card */}
      <div className="card flex justify-between items-center">
        <div>
          <Link to="/" className="text-sm text-gray-500 hover:underline">
            ← Back to Dashboard
          </Link>
          <h2 className="text-lg font-semibold mt-2">{group.name}</h2>
          <p className="text-gray-600">
            {group.description || "No description"}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Members:{" "}
            {group.memberDetails?.map((m) => m.name || "Unknown User").join(", ")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Invite Code</p>
          <p className="font-semibold text-indigo-600">{group.inviteCode}</p>
        </div>
      </div>

      {/* Add Expense Button */}
      <div className="text-center">
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
          onClick={() => setShowAddExpense(!showAddExpense)}
        >
          {showAddExpense ? "✖ Cancel" : "+ Add New Expense"}
        </button>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex space-x-6 border-b pb-2">
          {["expenses", "balances", "spin", "ai"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-1 ${
                activeTab === tab
                  ? "border-b-2 border-indigo-600 font-semibold text-indigo-600"
                  : "text-gray-500"
              }`}
            >
              {tab === "expenses" && "💸 Expenses"}
              {tab === "balances" && "⚖️ Balances"}
              {tab === "spin" && "🎯 Spin Wheel"}
              {tab === "ai" && "🤖 AI Assistant"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === "expenses" && (
            <ExpenseList groupId={id} expenses={expenses} onRefresh={refresh} />
          )}

          {activeTab === "balances" && <BalanceView balances={balances} />}

          {activeTab === "spin" && (
            <SpinWheel
              groupId={id}
              spins={spins}
              onSpin={refresh}
            />
          )}

          {activeTab === "ai" && <AIChat groupId={id} />}
        </div>
      </div>

      {/* Add Expense Section */}
      {showAddExpense && (
        <div id="add-expense" className="card">
          <AddExpense
            group={group}
            currentUser={currentUser}
            onAdded={() => {
              refresh();
              setShowAddExpense(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
