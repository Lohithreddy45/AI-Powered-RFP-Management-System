import { useEffect, useState } from "react";
import { getRFPs, sendRFPToVendors } from "../api";

export default function RFPList() {
  const [rfps, setRfps] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadRfps();
  }, []);

  const loadRfps = async () => {
    try {
      const data = await getRFPs();
      setRfps(data);
    } catch {
      setError("Failed to load RFPs. Backend must be running.");
    }
  };

  const handleSend = async (id) => {
    setMessage("");
    setError("");
    try {
      const res = await sendRFPToVendors(id);
      setMessage(`RFP sent successfully to ${res.totalVendors} vendors!`);
    } catch {
      setError("Failed to send email. Check Mailtrap config.");
    }
  };

  return (
    <section className="card">
      <h2 className="card-title">RFP List</h2>
      <p className="card-subtitle">All generated RFPs from AI backend</p>

      {message && <p style={{ color: "lightgreen" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {rfps.length === 0 && (
        <p style={{ marginTop: 10 }}>No RFPs created yet...</p>
      )}

      {rfps.map((rfp) => (
        <div key={rfp._id} className="list-item">
          <div className="row-between">
            <div>
              <strong style={{ fontSize: 18 }}>{rfp.title}</strong>
              <p className="card-subtitle">
                Budget: {rfp.budget} · Timeline: {rfp.deliveryTimeline}
              </p>
            </div>

            <div>
              <button
                className="btn btn-secondary"
                onClick={() =>
                  setExpandedId(expandedId === rfp._id ? null : rfp._id)
                }
              >
                {expandedId === rfp._id ? "Hide JSON" : "View JSON"}
              </button>

              <button
                className="btn btn-primary"
                style={{ marginLeft: 8 }}
                onClick={() => handleSend(rfp._id)}
              >
                Send to Vendors
              </button>
            </div>
          </div>

          {expandedId === rfp._id && (
            <pre className="mt-2">{JSON.stringify(rfp, null, 2)}</pre>
          )}
        </div>
      ))}
    </section>
  );
}
