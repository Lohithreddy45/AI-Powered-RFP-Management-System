const API_BASE = "http://localhost:4000/api";

async function jsonFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}

export const createRFP = (text) =>
  jsonFetch(`${API_BASE}/rfps`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });

export const getRFPs = () => jsonFetch(`${API_BASE}/rfps`);

export const sendRFPToVendors = (id) =>
  jsonFetch(`${API_BASE}/rfps/${id}/send`, { method: "POST" });

export const getVendors = () => jsonFetch(`${API_BASE}/vendors`);

export const createVendor = (vendor) =>
  jsonFetch(`${API_BASE}/vendors`, {
    method: "POST",
    body: JSON.stringify(vendor),
  });

export const submitProposal = (payload) =>
  jsonFetch(`${API_BASE}/proposals`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const compareForRFP = (rfpId) =>
  jsonFetch(`${API_BASE}/proposals/compare/${rfpId}`);
