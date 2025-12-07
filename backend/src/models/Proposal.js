const mongoose = require("mongoose");

const proposalSchema = new mongoose.Schema(
  {
    rfpId: { type: mongoose.Schema.Types.ObjectId, ref: "RFP", required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    rawEmailText: String,
    parsed: Object
  },
  { timestamps: true }
);

module.exports = mongoose.model("Proposal", proposalSchema);
