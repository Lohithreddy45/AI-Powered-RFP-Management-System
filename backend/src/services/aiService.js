// src/services/aiService.js

const Groq = require("groq-sdk");
const config = require("../config");

// Create Groq client
if (!config.GROQ_API_KEY) {
  console.warn(
    "[AI SERVICE] WARNING: GROQ_API_KEY is missing. " +
      "Set it in backend/.env for AI features to work."
  );
}

const client = new Groq({
  apiKey: config.GROQ_API_KEY,
});

// ------------------------------------
// Helper → Call the LLM with a prompt
//-------------------------------------
async function callLLM(prompt) {
  if (!config.GROQ_API_KEY) {
    throw new Error(
      "GROQ_API_KEY is missing. Set it in backend/.env before using AI features."
    );
  }

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile", // free Groq model
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  return response.choices[0].message.content;
}

// ------------------------------
// 1. Natural Language → RFP JSON
// ------------------------------
async function createStructuredRFP(rawText) {
  const prompt = `
Convert the following procurement request into a well-structured JSON RFP.
Include ONLY this structure:

{
  "title": "",
  "items": [
    { "name": "", "qty": "", "specs": "" }
  ],
  "budget": "",
  "deliveryTimeline": "",
  "paymentTerms": "",
  "warranty": ""
}

Do NOT add extra fields.
Return VALID JSON only.

Input:
${rawText}
`;

  const output = await callLLM(prompt);

  try {
    return JSON.parse(output);
  } catch (err) {
    const jsonMatch = output.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error("AI returned invalid JSON: " + output);
  }
}

// ------------------------------
// 2. Parse Vendor Email → JSON
// ------------------------------
async function parseVendorResponse(emailText) {
  const prompt = `
Extract key proposal information from this vendor email.

Return ONLY JSON in this format:

{
  "totalPrice": "",
  "currency": "",
  "items": [
    { "name": "", "qty": "", "unitPrice": "", "totalPrice": "" }
  ],
  "deliveryDays": "",
  "warranty": "",
  "paymentTerms": "",
  "notes": ""
}

Email:
${emailText}
`;

  const output = await callLLM(prompt);

  try {
    return JSON.parse(output);
  } catch (err) {
    const jsonMatch = output.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return { raw: output };
  }
}

// ---------------------------------------
// 3. Compare Proposals → Scores + Summary
// ---------------------------------------
async function compareProposals(rfp, proposals) {
  const prompt = `
You are comparing vendor proposals for this RFP:

RFP:
${JSON.stringify(rfp, null, 2)}

Proposals:
${JSON.stringify(proposals, null, 2)}

Return ONLY JSON:

{
  "scores": { "vendorName": 0-100 },
  "summaries": { "vendorName": "2-line summary" },
  "recommendation": { "vendorName": "", "reason": "" }
}
`;

  const output = await callLLM(prompt);

  try {
    return JSON.parse(output);
  } catch (err) {
    const jsonMatch = output.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return { raw: output };
  }
}

module.exports = {
  createStructuredRFP,
  parseVendorResponse,
  compareProposals,
};
