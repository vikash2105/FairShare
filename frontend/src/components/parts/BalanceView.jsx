import React from "react";

export default function BalanceView({ balances }) {
  return (
    <div>
      <h3 className="font-semibold mb-2">Balances</h3>
      <table className="w-full text-sm">
        <thead><tr><th className="text-left">Member</th><th className="text-right">Balance</th></tr></thead>
        <tbody>
          {balances.map(b => (
            <tr key={b.userId}>
              <td>{b.userName}</td>
              <td className={"text-right " + (b.balance >= 0 ? "text-green-700" : "text-red-700")}>
                {b.balance >= 0 ? "+" : ""}{b.balance.toFixed(2)}
              </td>
            </tr>
          ))}
          {!balances.length && <tr><td colSpan="2" className="text-gray-600">No balances</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
