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
    setItems((prev) => [...prev, { type: "user", content: text }]);
    setMessage("");
    setLoading(true);
    try {
      const r = await api.post("/api/ai/chat", { message: text, groupId });
      setItems((prev) => [...prev, { type: "ai", content: r.data.reply }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-3">AI Assistant</h3>
      <div className="space-y-2 mb-3 max-h-64 overflow-auto border rounded-lg p-3 bg-gray-50">
        {items.map((m, i) => (
          <div
            key={i}
            className={`text-sm flex ${
              m.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <span
              className={`px-3 py-2 rounded-xl max-w-[70%] ${
                m.type === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {m.content}
            </span>
          </div>
        ))}
        {loading && (
          <div className="text-sm text-gray-500 italic">Thinking...</div>
        )}
      </div>
      <form onSubmit={submit} className="flex gap-2">
        <input
          className="input flex-1"
          placeholder="Ask about splitting bills..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="button">Send</button>
      </form>
    </div>
  );
}
