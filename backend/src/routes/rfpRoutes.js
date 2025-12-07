const express = require("express");
const router = express.Router();
const rfpController = require("../controllers/rfpController");

router.post("/", rfpController.createRFP);
router.post("/:id/send", rfpController.sendToVendors);
router.post("/:id/compare", rfpController.compareProposalsForRFP); // 👈 this line
router.get("/:id", rfpController.getRFP);
router.get("/", rfpController.getAll);

module.exports = router;
