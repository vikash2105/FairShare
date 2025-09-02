import React from "react";

export default function BalanceView({ balances = [] }) {
  if (!balances.length) {
    return <p className="text-gray-500">No balances to show yet.</p>;
  }

  const format = (n) => `₹${Number(n).toFixed(2)}`;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Balances</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="py-2 pr-4">Member</th>
              <th className="py-2 pr-4">Net Balance</th>
              <th className="py-2 pr-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {balances.map((b) => {
              const name = b.name || b.userName || b.user?.name || "Unknown";
              const val = Number(b.balance ?? b.amount ?? 0);
              const status = val > 0 ? "Gets back" : val < 0 ? "Owes" : "Settled";
              return (
                <tr key={b.userId || b._id} className="border-b">
                  <td className="py-2 pr-4">{name}</td>
                  <td className="py-2 pr-4 font-medium">{format(val)}</td>
                  <td className={`py-2 pr-4 ${val < 0 ? "text-red-600" : val > 0 ? "text-green-600" : "text-gray-600"}`}>
                    {status}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Optional tip */}
      <p className="text-xs text-gray-500 mt-2">
        Positive = others owe them. Negative = they owe others.
      </p>
    </div>
  );
}
