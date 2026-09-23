function EscalationCard({ escalated }) {
  if (!escalated) {
    return null;
  }

  return (
    <div className="escalation-card">
      <h2>Human Support Required</h2>
      <p>Your issue has been escalated for human review.</p>
    </div>
  );
}

export default EscalationCard;
