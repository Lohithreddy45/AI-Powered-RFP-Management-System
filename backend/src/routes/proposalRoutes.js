const express = require("express");
const router = express.Router();
const proposalController = require("../controllers/proposalController");

// Create proposal manually / from parsed email
router.post("/", proposalController.createProposal);

// Get all proposals
router.get("/", proposalController.getAll);

module.exports = router;
