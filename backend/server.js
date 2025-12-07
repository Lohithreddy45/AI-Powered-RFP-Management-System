// server.js

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const config = require("./src/config");
const emailService = require("./src/services/emailService");

console.log("MONGO_URI from config:", config.MONGO_URI);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "RFP Backend API is running" });
});

// RFP routes
try {
  const rfpRoutes = require("./src/routes/rfpRoutes");
  app.use("/api/rfps", rfpRoutes);
} catch (err) {
  console.error("Error loading rfpRoutes:", err.message);
}

// Vendor routes
try {
  const vendorRoutes = require("./src/routes/vendorRoutes");
  app.use("/api/vendors", vendorRoutes);
} catch (err) {
  console.error("Error loading vendorRoutes:", err.message);
}

// Proposal routes
try {
  const proposalRoutes = require("./src/routes/proposalRoutes");
  app.use("/api/proposals", proposalRoutes);
} catch (err) {
  console.error("Error loading proposalRoutes:", err.message);
}

// Start server + DB
mongoose
  .connect(config.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    app.listen(config.PORT, () => {
      console.log(`🚀 Backend running on port ${config.PORT}`);

      // IMAP disabled for now
      // if (emailService && typeof emailService.start === "function") {
      //   try {
      //     emailService.start();
      //   } catch (err) {
      //     console.error("Error starting email service:", err.message);
      //   }
      // }
    });
  })
  .catch((err) => {
    console.error("❌ Failed to start server");
    console.error(err);
    process.exit(1);
  });

module.exports = app;
