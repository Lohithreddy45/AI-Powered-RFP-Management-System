const Proposal = require("../models/Proposal");

exports.createProposal = async (req, res) => {
  try {
    const proposal = await Proposal.create(req.body);
    res.json({ message: "Proposal stored", proposal });
  } catch (err) {
    console.error("createProposal error:", err);
    res.status(500).json({ error: "Failed to store proposal" });
  }
};

exports.getAll = async (req, res) => {
  try {
    const proposals = await Proposal.find()
      .populate("vendorId")
      .populate("rfpId");
    res.json(proposals);
  } catch (err) {
    console.error("getAll proposals error:", err);
    res.status(500).json({ error: "Failed to fetch proposals" });
  }
};
