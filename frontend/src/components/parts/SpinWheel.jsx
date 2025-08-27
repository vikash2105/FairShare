import React, { useState } from "react";
import { api } from "../../lib";

export default function SpinWheel({ groupId, onSpin, spins }) {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  async function doSpin() {
    setLoading(true);
    const r = await api.post(`/api/group/${groupId}/spin`);
    setSelected(r.data.selectedMember);
    onSpin?.();
    setLoading(false);
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-3">Spin Wheel</h3>
      <button
        className="button w-full"
        onClick={doSpin}
        disabled={loading}
      >
        {loading ? "Spinning..." : "Spin"}
      </button>

      {selected && (
        <div className="mt-3 text-center text-sm">
          🎉 Selected: <b>{selected.name}</b>
        </div>
      )}

      <div className="mt-4">
        <h4 className="font-medium mb-2">Recent Spins</h4>
        <ul className="text-sm space-y-1 max-h-40 overflow-auto">
          {spins.map((s) => (
            <li key={s._id} className="text-gray-600">
              {new Date(s.date).toLocaleString()} —{" "}
              <b>{s.selectedMemberName}</b> (by {s.spinByName})
            </li>
          ))}
          {!spins.length && <li className="text-gray-500 italic">No spins yet</li>}
        </ul>
      </div>
    </div>
  );
}
