const RFP = require("../models/RFP");
const Vendor = require("../models/Vendor");
const Proposal = require("../models/Proposal"); // used for comparison
const aiService = require("../services/aiService");
const emailService = require("../services/emailService");

// Create RFP (Natural language → AI → Structured JSON)
exports.createRFP = async (req, res) => {
  try {
    const { text } = req.body;

    // Convert natural language to structured RFP using AI
    const structuredRFP = await aiService.createStructuredRFP(text);

    const rfp = await RFP.create({
      rawInputText: text,
      ...structuredRFP,
    });

    res.json(rfp);
  } catch (error) {
    console.error("createRFP error:", error);
    res.status(500).json({ error: "Error creating RFP" });
  }
};

// Send RFP to all vendors via email
exports.sendToVendors = async (req, res) => {
  try {
    const rfpId = req.params.id;
    const rfp = await RFP.findById(rfpId);

    if (!rfp) {
      return res.status(404).json({ error: "RFP not found" });
    }

    const vendors = await Vendor.find();

    const html = `
      <h2>New RFP</h2>
      <pre>${JSON.stringify(rfp, null, 2)}</pre>
      <p>Please include this ID when replying: <b>RFP-ID:${rfp._id}</b></p>
    `;

    for (let vendor of vendors) {
      await emailService.sendRFPEmail({
        to: vendor.email,
        subject: `RFP Request - RFP-ID:${rfp._id}`,
        html,
      });
    }

    res.json({ message: "RFP sent to vendors", totalVendors: vendors.length });
  } catch (error) {
    console.error("sendToVendors error:", error);
    res.status(500).json({ error: "Failed to send RFP to vendors" });
  }
};

// Get single RFP
exports.getRFP = async (req, res) => {
  try {
    const rfp = await RFP.findById(req.params.id);
    if (!rfp) return res.status(404).json({ error: "RFP not found" });
    res.json(rfp);
  } catch (err) {
    console.error("getRFP error:", err);
    res.status(500).json({ error: "Error fetching RFP" });
  }
};

// Get all RFPs
exports.getAll = async (req, res) => {
  try {
    const rfps = await RFP.find().sort({ createdAt: -1 });
    res.json(rfps);
  } catch (err) {
    console.error("getAll RFPs error:", err);
    res.status(500).json({ error: "Error fetching RFPs" });
  }
};

// ------------------------------------------
// Compare all proposals for a given RFP (AI)
// POST /api/rfps/:id/compare
// ------------------------------------------
exports.compareProposalsForRFP = async (req, res) => {
  try {
    const rfpId = req.params.id;

    const rfp = await RFP.findById(rfpId);
    if (!rfp) {
      return res.status(404).json({ error: "RFP not found" });
    }

    // Get all proposals for this RFP
    const proposals = await Proposal.find({ rfpId }).populate("vendorId");

    if (!proposals.length) {
      return res
        .status(400)
        .json({ error: "No proposals found for this RFP" });
    }

    // Prepare data for AI
    const proposalsForAI = proposals.map((p) => ({
      vendorName: p.vendorId ? p.vendorId.name : "Unknown Vendor",
      parsed: p.parsed,
      rawEmailText: p.rawEmailText,
    }));

    // Call AI comparison
    const aiResult = await aiService.compareProposals(rfp, proposalsForAI);

    res.json({
      rfpId,
      proposals: proposalsForAI,
      aiResult,
    });
  } catch (err) {
    console.error("compareProposalsForRFP error:", err);
    res.status(500).json({ error: "Failed to compare proposals" });
  }
};
