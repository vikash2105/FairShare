import React, { useState } from "react";
import { api } from "../../lib";

export default function AIChat({ groupId }) {
  const [message, setMessage] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!message.trim()) return;
    const text = message.trim();
    setItems(prev => [...prev, { type: "user", content: text }]);
    setMessage(""); setLoading(true);
    try {
      const r = await api.post("/api/ai/chat", { message: text, groupId });
      setItems(prev => [...prev, { type: "ai", content: r.data.reply }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3 className="font-semibold mb-2">AI Assistant</h3>
      <div className="space-y-2 mb-2 max-h-60 overflow-auto border rounded p-2 bg-gray-50">
        {items.map((m,i) => (
          <div key={i} className={"text-sm " + (m.type==="user" ? "text-right" : "text-left")}>
            <span className={"inline-block px-2 py-1 rounded " + (m.type==="user" ? "bg-blue-100" : "bg-gray-200")}>{m.content}</span>
          </div>
        ))}
        {loading && <div className="text-sm text-gray-500">Thinking...</div>}
      </div>
      <form onSubmit={submit} className="flex gap-2">
        <input className="input flex-1" placeholder="Ask about splitting bills..." value={message} onChange={e=>setMessage(e.target.value)} />
        <button className="button">Send</button>
      </form>
    </div>
  );
}
