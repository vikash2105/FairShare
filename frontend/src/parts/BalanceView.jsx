import React from "react";

export default function BalanceView({ balances=[] }){
  return (
    <div className="card">
      <h3 className="font-semibold mb-2">Balances</h3>
      {!balances.length ? <div className="text-sm text-gray-500">No balances</div> : (
        <table className="w-full text-sm">
          <thead><tr><th className="text-left">User</th><th className="text-right">Balance</th></tr></thead>
          <tbody>
            {balances.map(b => (
              <tr key={b.user}>
                <td className="py-1">{b.user}</td>
                <td className={"py-1 text-right " + (b.balance>=0?"text-green-600":"text-red-600")}>
                  {b.balance>=0?"+":""}{b.balance.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
