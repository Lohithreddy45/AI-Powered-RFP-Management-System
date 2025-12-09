import { useState } from "react";
import { createRFP } from "../api";

export default function CreateRFP() {
  const [text, setText] = useState("");
  const [rfp, setRfp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setRfp(null);

    try {
      const data = await createRFP(text); // calls POST /api/rfps with { text }
      setRfp(data);
    } catch (err) {
      console.error(err);
      setError("Failed to generate RFP. Check backend / AI config.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* INPUT + BUTTON */}
      <section className="card">
        <h2 className="card-title">Create RFP (AI)</h2>
        <p className="card-subtitle">
          Type your requirement in natural language. Backend uses AI to convert it
          into a structured RFP.
        </p>

        <label className="label">Requirement (natural language)</label>
        <textarea
          className="textarea"
          rows={4}
          placeholder="Example: We need 20 Dell laptops with 16GB RAM and 512GB SSD, delivery in 3 weeks, budget 3,00,000 INR, standard payment terms, 1 year warranty."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {error && <p style={{ color: "#f97373" }}>{error}</p>}

        <button
          className="btn btn-primary mt-1"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate RFP"}
        </button>
      </section>

      {/* NICE UI SUMMARY */}
      {rfp && (
        <section className="card">
          <h2 className="card-title">Generated RFP (Summary)</h2>
          <p className="card-subtitle">
            Human-friendly view of the structured RFP created by the AI.
          </p>

          <div className="mt-2">
            <h3 style={{ marginBottom: 4 }}>{rfp.title || "Untitled RFP"}</h3>

            <p>
              <strong>Budget:</strong> {rfp.budget || "—"}
            </p>
            <p>
              <strong>Delivery timeline:</strong> {rfp.deliveryTimeline || "—"}
            </p>
            <p>
              <strong>Payment terms:</strong> {rfp.paymentTerms || "—"}
            </p>
            <p>
              <strong>Warranty:</strong> {rfp.warranty || "—"}
            </p>

            <div style={{ marginTop: 12 }}>
              <strong>Items:</strong>
              {(!rfp.items || rfp.items.length === 0) && (
                <p className="card-subtitle">No items parsed.</p>
              )}
              {rfp.items && rfp.items.length > 0 && (
                <ul style={{ marginTop: 6, paddingLeft: 18 }}>
                  {rfp.items.map((item, idx) => (
                    <li key={item._id || idx}>
                      <strong>{item.name || "Item"}</strong>{" "}
                      {item.qty && <>({item.qty})</>}{" "}
                      {item.specs && <>– {item.specs}</>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      )}

      {/* RAW JSON (for assignment / debugging) */}
      {rfp && (
        <section className="card">
          <h2 className="card-title">Generated RFP JSON</h2>
          <p className="card-subtitle">
            Raw JSON returned by the backend. This satisfies the assignment requirement.
          </p>
          <pre style={{ marginTop: 12, maxHeight: 300, overflow: "auto" }}>
            {JSON.stringify(rfp, null, 2)}
          </pre>
        </section>
      )}
    </>
  );
}
