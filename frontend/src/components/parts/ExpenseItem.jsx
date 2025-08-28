import React from "react";

export default function ExpenseItem({ expense }) {
  const { description, amount, paidBy, date } = expense;

  // handle if paidBy is object or just an id/string
  const payerName =
    typeof paidBy === "object" && paidBy !== null
      ? paidBy.name || paidBy.username || paidBy.email
      : paidBy;

  return (
    <li className="border rounded-xl p-3 shadow-sm bg-white">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">{description}</p>
          <p className="text-sm text-gray-500">
            Paid by {payerName || "Unknown"}
            {date ? ` • ${new Date(date).toLocaleDateString()}` : ""}
          </p>
        </div>
        <span className="font-semibold text-green-600">
          ${Number(amount).toFixed(2)}
        </span>
      </div>
    </li>
  );
}
