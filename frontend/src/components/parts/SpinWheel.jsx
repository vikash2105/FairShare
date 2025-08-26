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
    <div>
      <h3 className="font-semibold mb-2">Spin Wheel</h3>
      <button className="button" onClick={doSpin} disabled={loading}>{loading ? "Spinning..." : "Spin"}</button>
      {selected && <div className="mt-2 text-sm">Selected: <b>{selected.name}</b></div>}
      <div className="mt-4">
        <h4 className="font-medium mb-1">Recent Spins</h4>
        <ul className="text-sm list-disc pl-5">
          {spins.map(s => <li key={s._id}>{new Date(s.date).toLocaleString()} — {s.selectedMemberName} (by {s.spinByName})</li>)}
          {!spins.length && <li>No spins yet</li>}
        </ul>
      </div>
    </div>
  );
}
