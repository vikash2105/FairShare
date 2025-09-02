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
      const r = await api.post(`/api/ai/chat/${groupId}`, { message: text });

      let reply = "";
      if (r.data?.reply) {
        reply = r.data.reply;
      } else if (Array.isArray(r.data)) {
        reply = JSON.stringify(r.data, null, 2);
      } else if (typeof r.data === "object") {
        reply = JSON.stringify(r.data, null, 2);
      } else {
        reply = String(r.data);
      }

      setItems((prev) => [...prev, { type: "ai", content: reply }]);
    } catch (err) {
      console.error("AI chat error:", err);
      setItems((prev) => [
        ...prev,
        { type: "ai", content: "❌ Error: AI request failed" },
      ]);
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
              className={`px-3 py-2 rounded-xl max-w-[70%] whitespace-pre-wrap ${
                m.type === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {m.content}
            </span>
          </div>
        ))}
        {loading && <div className="text-sm text-gray-500 italic">Thinking...</div>}
      </div>

      <form onSubmit={submit} className="flex gap-2">
        <input
          className="input flex-1"
          placeholder='Try: "I paid 10 rupees on chai with Ayush and Shicnash"'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="button">Send</button>
      </form>
    </div>
  );
}
