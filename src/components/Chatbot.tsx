import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY as string);

interface Message {
  role: "user" | "assistant";
  text: string;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "👋 Hi! I’m your FinTrek Assistant. Ask me anything about finance or your progress here!",
    },
  ]);
  
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);


  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const userMessage: Message = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
  
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
      const prompt = `You are FinTrek Assistant, a friendly financial literacy tutor.
  - Explain finance in simple, practical terms.
  - Encourage users with positivity and motivation.
  - Keep answers short and structured.
  - If asked about FinTrek, explain dashboard, points, levels, and learning features.
  
  User: ${input}`;
  
      const result = await model.generateContent({
        contents: [
          {
            role: "user", // ✅ required for TypeScript
            parts: [{ text: prompt }],
          },
        ],
      });
  
      const botReply: Message = {
        role: "assistant",
        text: result.response.text(),
      };
      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "⚠️ Error fetching response" },
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4">
      {/* Toggle Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition"
        >
          💬
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className={`bg-gray-900 text-white shadow-lg rounded-2xl flex flex-col border border-gray-700
          ${expanded ? "w-[600px] h-[700px]" : "w-96 h-[500px]"}`}>        
          {/* Header */}
          <div className="flex justify-between items-center p-3 bg-gray-800 rounded-t-2xl">
  <h2 className="text-lg font-semibold">FinTrek Assistant</h2>
  <div className="flex items-center">
      {/* Expand/Collapse button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-gray-400 hover:text-gray-200 mr-2 text-xl"
        title={expanded ? "Collapse" : "Expand"}
      >
        {expanded ? "⇲" : "⛶"}
      </button>

      {/* Close button */}
      <button
        onClick={() => setOpen(false)}
        className="text-gray-400 hover:text-red-400 text-xl"
        title="Close"
      >
        ✖
      </button>
    </div>
  </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
              <span
                className={`px-3 py-2 rounded-lg max-w-xs text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-green-600 text-white"
                    : "bg-gray-700 text-gray-100"
                }`}
              >
                <ReactMarkdown
                  components={{
                    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                    li: ({ children }) => <li className="ml-4 list-disc">{children}</li>,
                    p: ({ children }) => <p className="mb-2">{children}</p>,
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </span>

              </div>
            ))}
            {loading && <p className="text-gray-400 text-sm">Thinking...</p>}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-700 flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // prevent new line
                sendMessage();
              }
            }}
            className="flex-1 px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none"
            placeholder="Ask about finance..."
          />
            <button
              onClick={sendMessage}
              className="ml-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
