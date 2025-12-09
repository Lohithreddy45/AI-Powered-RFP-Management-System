import { useEffect, useState } from "react";
import { getVendors, createVendor } from "../api";

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load vendor list on first render
  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getVendors();
      setVendors(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load vendors. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreate = async () => {
    setMessage("");
    setError("");

    if (!form.name.trim() || !form.email.trim()) {
      setError("Vendor name and email are required.");
      return;
    }

    try {
      await createVendor(form);
      setMessage("Vendor created successfully.");
      setForm({ name: "", email: "", category: "" });
      loadVendors();
    } catch (err) {
      console.error(err);
      setError("Failed to create vendor.");
    }
  };

  return (
    <>
      {/* Add Vendor */}
      <section className="card">
        <h2 className="card-title">Add Vendor</h2>
        <p className="card-subtitle">
          Add suppliers who should receive RFP emails from this system.
        </p>

        {error && <p style={{ color: "#f97373" }}>{error}</p>}
        {message && <p style={{ color: "lightgreen" }}>{message}</p>}

        <label className="label">Vendor Name</label>
        <input
          className="input"
          placeholder="TechOne Suppliers"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />

        <label className="label">Email</label>
        <input
          className="input"
          placeholder="vendor@example.com"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />

        <label className="label">Category (optional)</label>
        <input
          className="input"
          placeholder="Laptops, Network, Cloud…"
          value={form.category}
          onChange={(e) => handleChange("category", e.target.value)}
        />

        <button className="btn btn-primary mt-1" onClick={handleCreate}>
          Save Vendor
        </button>
      </section>

      {/* Vendor List */}
      <section className="card">
        <h2 className="card-title">Vendors</h2>
        <p className="card-subtitle">
          All vendors currently registered. RFP emails are sent to this list.
        </p>

        {loading && <p className="mt-1">Loading vendors…</p>}
        {!loading && vendors.length === 0 && (
          <p className="mt-1">No vendors yet. Add one using the form above.</p>
        )}

        {!loading &&
          vendors.map((v) => (
            <div key={v._id} className="list-item">
              <div className="row-between">
                <div>
                  <strong>{v.name}</strong> — {v.email}
                  {v.category && <span className="badge">{v.category}</span>}
                </div>
                <span className="card-subtitle">
                  ID: {v._id.slice(0, 6)}…
                </span>
              </div>
            </div>
          ))}
      </section>
    </>
  );
}
