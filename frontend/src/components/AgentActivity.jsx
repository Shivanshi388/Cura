import React from "react";

function AgentActivity() {
  return (
    <div className="agent-activity">
      <h2>Agent Activity</h2>

      <div className="activity-item">
        <span className="activity-dot"></span>

        <div>
          <strong>Support system ready</strong>
          <p>Waiting for a customer request</p>
        </div>
      </div>

      <div className="activity-item">
        <span className="activity-dot purple"></span>

        <div>
          <strong>AI agents available</strong>
          <p>Order · Billing · Technical</p>
        </div>
      </div>
    </div>
  );
}

export default AgentActivity;
