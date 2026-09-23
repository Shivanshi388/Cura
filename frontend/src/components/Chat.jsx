import React, { useState } from "react";
import { sendMessage } from "../api";

function Chat() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!message.trim() || loading) {
      return;
    }

    const currentMessage = message;

    setLoading(true);

    try {
      const data = await sendMessage("CUST001", currentMessage);

      setResponse({
        ...data,
        userMessage: currentMessage,
      });

      setMessage("");
    } catch (error) {
      setResponse({
        message: "Unable to connect to the support server.",
        userMessage: currentMessage,
      });
    }

    setLoading(false);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  function useSuggestion(text) {
    setMessage(text);
  }

  return (
    <div className="chat">
      {/* Welcome Screen */}
      {!response && !loading && (
        <div className="chat-welcome">
          <div className="welcome-orb">✦</div>

          <h3>How can I help you today?</h3>

          <p>
            Ask Cura about your orders, payments, tickets, or any support issue.
          </p>

          <div className="suggestion-row">
            <button onClick={() => useSuggestion("Where is my latest order?")}>
              📦 Latest order
            </button>

            <button
              onClick={() => useSuggestion("Show me my payment information")}
            >
              💳 Payments
            </button>

            <button onClick={() => useSuggestion("Show me my support tickets")}>
              🎫 Tickets
            </button>
          </div>
        </div>
      )}

      {/* AI Thinking */}
      {loading && (
        <div className="ai-thinking">
          <div className="thinking-avatar">✦</div>

          <div>
            <strong>Cura is investigating</strong>

            <div className="thinking-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}

      {/* Conversation */}
      {response && !loading && (
        <div className="conversation">
          {/* User Message */}
          <div className="message user-message">
            <div className="message-label">You</div>

            <div className="message-bubble">{response.userMessage}</div>
          </div>

          {/* AI Response */}
          <div className="message ai-message">
            <div className="message-label">✦ Cura AI</div>

            <div className="message-bubble">
              <p>{response.message}</p>

              {response.intent && (
                <span className="intent-badge">{response.intent}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="chat-input-area">
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Cura anything about your account..."
          rows="2"
          disabled={loading}
        />

        <button
          className="send-button"
          onClick={handleSend}
          disabled={loading || !message.trim()}
        >
          {loading ? "..." : "➤"}
        </button>
      </div>

      <p className="chat-hint">
        Press Enter to send · Shift + Enter for a new line
      </p>
    </div>
  );
}

export default Chat;
