import OpenAI from "openai";

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function chat(req, res, next) {
  try {
    if (!client) return res.status(503).json({ error: "AI not enabled" });

    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message required" });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    next(err);
  }
}
