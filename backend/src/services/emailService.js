// src/services/emailService.js

const nodemailer = require("nodemailer");
const Imap = require("node-imap");
const { simpleParser } = require("mailparser");
const Proposal = require("../models/Proposal");
const Vendor = require("../models/Vendor");
const aiService = require("./aiService");
const config = require("../config");

// ------------------------
// 1. SEND EMAILS
// ------------------------

// create a single transporter (not on every send)
const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: config.SMTP_PORT,
  secure: false,
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASS,
  },
});

async function sendRFPEmail({ to, subject, html }) {
  if (!config.SMTP_HOST || !config.SMTP_USER) {
    console.warn("[EMAIL] SMTP config missing, cannot send email.");
    return;
  }

  const info = await transporter.sendMail({
    from: config.FROM_EMAIL || config.SMTP_USER,
    to,
    subject,
    html,
  });

  console.log("📧 Email sent to:", to, "messageId:", info.messageId);
}

exports.sendRFPEmail = sendRFPEmail;

// ------------------------
// 2. READ EMAILS (IMAP)
// ------------------------

function startImapListener() {
  if (!config.IMAP_HOST || !config.IMAP_USER) {
    console.warn("[IMAP] IMAP config missing, not starting listener.");
    return;
  }

  const imap = new Imap({
    user: config.IMAP_USER,
    password: config.IMAP_PASS,
    host: config.IMAP_HOST,
    port: config.IMAP_PORT,
    tls: true,
  });

  function openInbox(cb) {
    imap.openBox("INBOX", false, cb);
  }

  imap.once("ready", () => {
    openInbox((err, box) => {
      if (err) {
        console.error("[IMAP] Error opening INBOX:", err);
        return;
      }

      console.log("📬 IMAP Connected. Listening for vendor replies...");

      // When new mail arrives
      imap.on("mail", () => {
        fetchEmails();
      });

      // Optionally fetch unseen on startup as well
      fetchEmails();
    });
  });

  imap.once("error", (err) => {
    console.error("[IMAP] Error:", err);
  });

  imap.once("end", () => {
    console.log("[IMAP] Connection ended");
  });

  imap.connect();

  // -------------------------
  // FETCH NEW UNSEEN EMAILS
  // -------------------------
  function fetchEmails() {
    openInbox((err) => {
      if (err) {
        console.error("[IMAP] openInbox error:", err);
        return;
      }

      imap.search(["UNSEEN"], (err, results) => {
        if (err) {
          console.error("[IMAP] search error:", err);
          return;
        }

        if (!results || results.length === 0) {
          // No new mail
          return;
        }

        const f = imap.fetch(results, { bodies: "" });

        f.on("message", (msg) => {
          msg.on("body", (stream) => {
            simpleParser(stream, async (err, parsed) => {
              if (err) {
                console.error("[IMAP] simpleParser error:", err);
                return;
              }

              const fromEmail = parsed.from && parsed.from.text ? parsed.from.text : "";
              const bodyText = parsed.text || parsed.html || "";

              console.log("\n📨 New email received from:", fromEmail);

              if (!bodyText) {
                console.log("⛔ Empty email body. Skipping.");
                return;
              }

              // Extract RFP ID from subject or body
              const sourceText = `${parsed.subject || ""}\n${bodyText}`;
              const match = sourceText.match(/RFP-ID:([a-zA-Z0-9]+)/);

              if (!match) {
                console.log("⛔ No RFP ID found. Skipping email.");
                return;
              }

              const rfpId = match[1];
              console.log("📌 Detected RFP-ID:", rfpId);

              // Extract just the email address from "Name <email@x.com>"
              const emailMatch = fromEmail.match(/<(.+?)>/);
              const cleanEmail = emailMatch ? emailMatch[1] : fromEmail;

              // Find vendor
              const vendor = await Vendor.findOne({
                email: { $regex: cleanEmail, $options: "i" },
              });

              if (!vendor) {
                console.log("⚠ Unknown vendor:", cleanEmail, "— skipping.");
                return;
              }

              // Parse proposal with AI
              const parsedProposal = await aiService.parseVendorResponse(bodyText);

              // Save in DB
              await Proposal.create({
                rfpId,
                vendorId: vendor._id,
                rawEmailText: bodyText,
                parsed: parsedProposal,
              });

              console.log("✅ Proposal saved for vendor:", vendor.name);
            });
          });
        });

        f.on("error", (err) => {
          console.error("[IMAP] fetch error:", err);
        });
      });
    });
  }
}

exports.start = startImapListener;
