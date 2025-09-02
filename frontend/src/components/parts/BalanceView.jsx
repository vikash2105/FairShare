import React from "react";

export default function BalanceView({ balances = [] }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-3">Balances</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-500">
            <th className="text-left pb-2">Member</th>
            <th className="text-right pb-2">Balance</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {balances.map((b) => (
            <tr key={b.userId} className="hover:bg-gray-50">
              <td className="py-2">{b.name || b.userName || b.email}</td>
              <td
                className={`text-right font-medium ${
                  b.balance >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {b.balance >= 0 ? "+" : ""}
                ₹{b.balance.toFixed(2)}
              </td>
            </tr>
          ))}

          {!balances.length && (
            <tr>
              <td
                colSpan="2"
                className="py-3 text-gray-500 italic text-center"
              >
                No balances yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
