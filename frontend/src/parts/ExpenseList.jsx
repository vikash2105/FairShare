import React from "react";

export default function ExpenseList({ expenses=[] }){
  return (
    <div className="card">
      <h3 className="font-semibold mb-2">Expenses</h3>
      {!expenses.length ? <div className="text-sm text-gray-500">No expenses</div> : (
        <ul className="divide-y">
          {expenses.map(e => (
            <li key={e._id} className="py-2 flex items-center justify-between">
              <div>
                <div className="font-medium">{e.description}</div>
                <div className="text-xs text-gray-500">Paid by {e.paidBy?.name || "Someone"}</div>
              </div>
              <div className="font-semibold">₹{Number(e.amount).toFixed(2)}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
