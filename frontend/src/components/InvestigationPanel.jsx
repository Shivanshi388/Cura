function InvestigationPanel({ data }) {
  return (
    <div className="investigation-panel">
      <h2>Investigation</h2>

      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>No investigation data available yet.</p>
      )}
    </div>
  );
}

export default InvestigationPanel;
