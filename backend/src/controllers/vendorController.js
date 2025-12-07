const Vendor = require("../models/Vendor");

exports.createVendor = async (req, res) => {
  try {
    const vendor = await Vendor.create(req.body);
    res.json(vendor);
  } catch (err) {
    console.error("createVendor error:", err);
    res.status(500).json({ error: "Error creating vendor" });
  }
};

exports.getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    res.json(vendors);
  } catch (err) {
    console.error("getVendors error:", err);
    res.status(500).json({ error: "Error fetching vendors" });
  }
};
