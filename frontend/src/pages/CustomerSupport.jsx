import React, { useState } from "react";
import Chat from "../components/Chat";
import CustomerContext from "../components/CustomerContext";
import AgentActivity from "../components/AgentActivity";

function CustomerSupport() {
  const [activeMenu, setActiveMenu] = useState("chat");
  const [chatMessage, setChatMessage] = useState("");

  const menuItems = [
    {
      id: "chat",
      icon: "💬",
      label: "Support Chat",
      message: "",
    },
    {
      id: "orders",
      icon: "📦",
      label: "Orders",
      message: "Where is my latest order?",
    },
    {
      id: "payments",
      icon: "💳",
      label: "Payments",
      message: "Show me my payment information",
    },
    {
      id: "tickets",
      icon: "🎫",
      label: "Tickets",
      message: "Show me my support tickets",
    },
  ];

  function handleMenuClick(item) {
    setActiveMenu(item.id);
    setChatMessage(item.message);
  }

  return (
    <div className="cura-app">
      {/* Top Navigation */}
      <header className="cura-header">
        <div className="cura-brand">
          <div className="cura-logo">✦</div>

          <div>
            <h1>Cura</h1>
            <span>AI Customer Support</span>
          </div>
        </div>

        <div className="system-status">
          <span className="status-dot"></span>
          <span>AI System Online</span>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="cura-dashboard">

        {/* Sidebar */}
        <aside className="cura-sidebar">
          <div className="sidebar-heading">
            <span>Customer</span>
            <span className="active-badge">ACTIVE</span>
          </div>

          <CustomerContext />

          <div className="sidebar-menu">
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`menu-item ${
                  activeMenu === item.id ? "active" : ""
                }`}
                onClick={() => handleMenuClick(item)}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Chat Area */}
        <section className="cura-chat-area">
          <div className="chat-header">
            <div className="ai-avatar">✦</div>

            <div>
              <h2>Cura AI</h2>
              <p>Your intelligent support assistant</p>
            </div>
          </div>

          <Chat initialMessage={chatMessage} />
        </section>

        {/* Activity Panel */}
        <aside className="cura-activity">
          <AgentActivity />
        </aside>
      </main>
    </div>
  );
}

export default CustomerSupport;