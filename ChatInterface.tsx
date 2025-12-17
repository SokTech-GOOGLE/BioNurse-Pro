import { useState } from "react";

export default function ChatInterface() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSend = async () => {
    const res = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setAnswer(data.answer);
  };

  return (
    <div>
      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ask AI..." />
      <button onClick={handleSend}>Send</button>
      <p>{answer}</p>
    </div>
  );
}
