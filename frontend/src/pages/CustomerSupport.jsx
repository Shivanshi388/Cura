import React from "react";
import Chat from "../components/Chat";
import CustomerContext from "../components/CustomerContext";
import AgentActivity from "../components/AgentActivity";

function CustomerSupport() {
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
            <div className="menu-item active">
              <span>💬</span>
              Support Chat
            </div>

            <div className="menu-item">
              <span>📦</span>
              Orders
            </div>

            <div className="menu-item">
              <span>💳</span>
              Payments
            </div>

            <div className="menu-item">
              <span>🎫</span>
              Tickets
            </div>
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

          <Chat />
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
