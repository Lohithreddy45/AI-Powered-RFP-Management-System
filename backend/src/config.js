require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 4000,
  MONGO_URI: process.env.MONGO_URI,

  // we won’t use this now but can keep it
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,

  GROQ_API_KEY: process.env.GROQ_API_KEY,   // 👈 add this line

  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: Number(process.env.SMTP_PORT) || 587,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  FROM_EMAIL: process.env.FROM_EMAIL || process.env.SMTP_USER,

  IMAP_HOST: process.env.IMAP_HOST,
  IMAP_PORT: Number(process.env.IMAP_PORT) || 993,
  IMAP_USER: process.env.IMAP_USER,
  IMAP_PASS: process.env.IMAP_PASS,
};
