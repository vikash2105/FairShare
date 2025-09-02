import React, { useEffect, useState } from "react";
import { api } from "../../lib";

export default function ExpenseList({ groupId, expenses = [], onRefresh }) {
  const [localExpenses, setLocalExpenses] = useState(expenses);

  useEffect(() => {
    setLocalExpenses(expenses);
  }, [expenses]);

  const fetchExpenses = async () => {
    try {
      const res = await api.get(`/expenses/${groupId}`);
      setLocalExpenses(res.data);
    } catch (err) {
      console.error("Failed to fetch expenses", err);
    }
  };

  useEffect(() => {
    if (!expenses.length && groupId) {
      fetchExpenses();
    }
  }, [groupId]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Expenses</h2>

      {localExpenses && localExpenses.length > 0 ? (
        <ul className="space-y-2">
          {localExpenses.map((exp) => {
            const payerName =
              typeof exp.paidBy === "object" && exp.paidBy !== null
                ? exp.paidBy.name || exp.paidBy.username || exp.paidBy.email
                : exp.paidBy;

            return (
              <li
                key={exp._id || exp.id}
                className="bg-gray-50 p-4 rounded-lg shadow flex justify-between"
              >
                <div>
                  <p className="font-medium">{exp.description || exp.title}</p>
                  <p className="text-sm text-gray-500">
                    Paid by {payerName || "Unknown"}
                    {exp.date ? ` • ${new Date(exp.date).toLocaleDateString()}` : ""}
                  </p>
                </div>
                <span className="font-bold text-green-600">
                  ₹{Number(exp.amount).toFixed(2)}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500">No expenses yet.</p>
      )}

      <button
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
        onClick={onRefresh || fetchExpenses}
      >
        🔄 Refresh Expenses
      </button>
    </div>
  );
}
