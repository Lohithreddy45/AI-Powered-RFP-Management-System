// src/models/RFP.js
const mongoose = require("mongoose");

const rfpSchema = new mongoose.Schema(
  {
    rawInputText: String,
    title: String,
    items: [
      {
        name: String,
        qty: String,
        specs: String,
      },
    ],
    budget: String,
    deliveryTimeline: String,
    paymentTerms: String,
    warranty: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("RFP", rfpSchema);
