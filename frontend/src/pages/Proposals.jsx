import { useState } from "react";
import { submitProposal, compareForRFP } from "../api";

export default function Proposals() {
  const [form, setForm] = useState({
    rfpId: "",
    vendorId: "",
    rawEmailText: "",
  });

  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProposal = async () => {
    setMessage("");
    setError("");
    setResult(null);

    if (!form.rfpId.trim() || !form.vendorId.trim() || !form.rawEmailText.trim()) {
      setError("RFP ID, Vendor ID, and email text are required.");
      return;
    }

    try {
      const data = await submitProposal(form);
      setMessage("Proposal stored successfully.");
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Failed to store proposal. Check backend logs.");
    }
  };

  const handleCompare = async () => {
    setMessage("");
    setError("");
    setResult(null);

    if (!form.rfpId.trim()) {
      setError("Enter RFP ID to run comparison.");
      return;
    }

    try {
      const data = await compareForRFP(form.rfpId);
      setResult(data);
      setMessage("AI comparison completed.");
    } catch (err) {
      console.error(err);
      setError("Failed to compare proposals. Ensure at least one proposal exists for this RFP.");
    }
  };

  return (
    <section className="card">
      <h2 className="card-title">Vendor Proposals & AI Comparison</h2>
      <p className="card-subtitle">
        Simulate vendor replies, store them as proposals, and compare them using AI against the RFP.
      </p>

      {error && <p style={{ color: "#f97373" }}>{error}</p>}
      {message && <p style={{ color: "lightgreen" }}>{message}</p>}

      <label className="label">RFP ID</label>
      <input
        className="input"
        placeholder="Paste RFP _id here"
        value={form.rfpId}
        onChange={(e) => handleChange("rfpId", e.target.value)}
      />

      <label className="label">Vendor ID</label>
      <input
        className="input"
        placeholder="Paste Vendor _id here"
        value={form.vendorId}
        onChange={(e) => handleChange("vendorId", e.target.value)}
      />

      <label className="label">Vendor email reply (plain text)</label>
      <textarea
        className="textarea"
        placeholder="Example: We can deliver 20 Dell laptops for 2,95,000 INR, delivery in 2 weeks, 1 year warranty, standard payment terms..."
        value={form.rawEmailText}
        onChange={(e) => handleChange("rawEmailText", e.target.value)}
      />

      <div className="mt-2">
        <button className="btn btn-primary" onClick={handleSaveProposal}>
          Save Proposal
        </button>
        <button
          className="btn btn-secondary"
          style={{ marginLeft: 8 }}
          onClick={handleCompare}
        >
          Compare for this RFP
        </button>
      </div>

      {result && (
        <>
          <h3 className="mt-3">Result</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </>
      )}
    </section>
  );
}
