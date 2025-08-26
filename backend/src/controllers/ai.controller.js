import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // ✅ use environment variable
});

export async function chat(req, res) {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "message required" });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant for splitting bills." },
        { role: "user", content: message },
      ],
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    res.json({ reply });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
