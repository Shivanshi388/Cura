import InvestigationPanel from "./InvestigationPanel";
import AgentActivity from "./AgentActivity";
import EscalationCard from "./EscalationCard";

function SupportDashboard({ response }) {
  return (
    <div className="support-dashboard">
      <h2>Support Dashboard</h2>

      <InvestigationPanel data={response?.data} />
      <AgentActivity />
      <EscalationCard escalated={response?.escalated} />
    </div>
  );
}

export default SupportDashboard;
