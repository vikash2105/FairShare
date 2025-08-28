import React from "react";

export default function ExpenseList({ expenses = [], showAddExpense, setShowAddExpense }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Expenses</h2>

      {expenses && expenses.length > 0 ? (
        <ul className="space-y-2">
          {expenses.map((exp) => {
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
                  ${Number(exp.amount).toFixed(2)}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500">No expenses yet.</p>
      )}

      {/* Optional add expense toggle (if you want the button inside the list) */}
      {!showAddExpense && (
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          onClick={() => setShowAddExpense(true)}
        >
          + Add Expense
        </button>
      )}
    </div>
  );
}
