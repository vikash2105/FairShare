import React, { useState, useEffect } from "react";

export default function ExpenseList({ showAddExpense, setShowAddExpense }) {
  // temporary local state (later you can fetch from API or context)
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    // Example: fake fetch
    setExpenses([
      { id: 1, title: "Dinner", amount: 40, paidBy: "Alice" },
      { id: 2, title: "Movie", amount: 25, paidBy: "Bob" },
    ]);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Expenses</h2>

      {expenses && expenses.length > 0 ? (
        <ul className="space-y-2">
          {expenses.map((exp) => (
            <li
              key={exp.id}
              className="bg-gray-50 p-4 rounded-lg shadow flex justify-between"
            >
              <div>
                <p className="font-medium">{exp.title}</p>
                <p className="text-sm text-gray-500">Paid by {exp.paidBy}</p>
              </div>
              <span className="font-bold text-green-600">${exp.amount}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No expenses yet.</p>
      )}
    </div>
  );
}
