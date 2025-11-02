const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // অথবা process.env.OPENAI_API_KEY (যদি Node হয়)
  dangerouslyAllowBrowser: true, // শুধুমাত্র client-side dev এর জন্য
});

const generateContent = async () => {
  if (!formData.topic) return;
  setLoading(true);
  try {
    const prompt = `Write a professional yet engaging LinkedIn post about "${formData.topic}". 
Use a warm, authentic tone — start with a hook or insight, include a call to action or reflection. 
Keep it under 200 words and avoid hashtags unless naturally fitting.`;

    const res = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 200,
    });

    const content =
      res.choices?.[0]?.message?.content?.trim() ||
      "✨ Couldn’t generate content, please try again.";
    setFormData((p) => ({ ...p, content }));
  } catch (err) {
    console.error("OpenAI Error:", err);
    setFormData((p) => ({
      ...p,
      content: "⚠️ Error generating content. Try again later.",
    }));
  } finally {
    setLoading(false);
  }
};