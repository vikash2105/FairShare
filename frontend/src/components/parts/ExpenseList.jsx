import React from "react";

export default function ExpenseList({ expenses }) {
  return (
    <div>
      <h3 className="font-semibold mb-2">Expenses</h3>
      <ul className="space-y-2">
        {expenses.map(e => (
          <li key={e._id} className="border rounded p-2">
            <div className="font-medium">{e.description} — ${e.amount.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Paid by {e.paidByName}; split among {e.splitAmongDetails.map(s => s.name).join(", ")}</div>
            <div className="text-xs text-gray-500">{new Date(e.date).toLocaleString()}</div>
          </li>
        ))}
        {!expenses.length && <li className="text-sm text-gray-600">No expenses yet</li>}
      </ul>
    </div>
  );
}
