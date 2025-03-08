import Spline from "@splinetool/react-spline";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Robo() {
  return (
    <main
      style={{
        position: "relative",
        height: "85vh",
        overflow: "hidden",
      }}
    >
      <Spline
        style={{
          width: "100%",
          height: "100vh",
          position: "absolute",
          top: " -15%",
          left: " 0",
          zIndex: "0",
          objectFit: "contain",
        }}
        scene="https://prod.spline.design/QgGURaP7MecM2KLv/scene.splinecode"
      />
      <p className="scl">SCROLL DOWN!</p>
    </main>
  );
}

export const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = {
      content: inputMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://api.together.xyz/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_TOGETHER_API}`,
          },
          body: JSON.stringify({
            model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
            messages: [
              ...messages.map((msg) => ({
                role: msg.sender === "user" ? "user" : "assistant",
                content: msg.content,
              })),
              { role: "user", content: inputMessage },
            ],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();

      if (!data.choices || !data.choices[0]?.message?.content) {
        throw new Error("Invalid response format from API");
      }

      const botResponse = {
        content: data.choices[0].message.content,
        sender: "bot",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        content: `Error: ${error.message}`,
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const MessageContent = ({ content }) => (
    <div style={{ overflow: "auto" }}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1>{children}</h1>,
          h2: ({ children }) => <h2>{children}</h2>,
          p: ({ children }) => <p style={{ margin: "0.5em 0" }}>{children}</p>,
          ul: ({ children }) => <ul>{children}</ul>,
          ol: ({ children }) => <ol>{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
          strong: ({ children }) => <strong>{children}</strong>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );

  return (
    <div className="qora">
      <div className="robo">
        <Robo />
      </div>
      <h1 className="ask">Ask your Querries</h1>
      <div className="chtbot">
        <div
          style={{
            width: "100%",
            height: "400px",
            border: " 1px solid #fff",
            padding: " 20px",
            margin: " 4% 0",
            overflowY: "scroll",
            zIndex: 51,
            borderRadius: " 5rem",
          }}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                marginBottom: "0px",
                padding: "1.5% 5%",
                // backgroundColor: message.sender === "user" ? "#f0f0f0" : "#fff",
                backgroundColor: "transparent",
                borderRadius: "5px",
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: "2.5px" }}>
                {message.sender === "user" ? "You" : "Unifusion"}:
              </div>
              <MessageContent content={message.content} />
              <div
                style={{ fontSize: "0.8em", color: "#666", marginTop: "2.5px" }}
              >
                {/* {new Date(message.timestamp).toLocaleTimeString()} */}
              </div>
            </div>
          ))}
          {isLoading && <div className="prcs" >Processing...</div>}
        </div>
        <form onSubmit={handleSendMessage}>
          <textarea
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button type="submit" className="btnct" disabled={isLoading}>
            Send <span>↗</span>
          </button>
        </form>
      </div>
    </div>
  );
};
