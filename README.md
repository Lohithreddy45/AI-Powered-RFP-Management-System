# AI-Powered-RFP-Management-System


Smart procurement assistant with AI-driven proposal comparison








🌟 Overview

This system automates the entire RFP (Request for Proposal) process using AI:

| Feature                                             | Status                  |
| --------------------------------------------------- | ----------------------- |
| Convert natural RFP text → structured JSON using AI | ⚡ Done                  |
| Store RFPs in MongoDB                               | ⚡ Done                  |
| Add Vendors                                         | ⚡ Done                  |
| Send RFP to all vendors (email simulation ready)    |  ⚡ Done  |
| Store Vendor Proposals                              | ⚡ Done                  |
| Compare proposals using AI & recommend best vendor  | 🔥 Core feature working |
| API-based backend demo-ready                        | ✔ Assignment-ready      |

📌 Tech Stack
| Layer    | Technology                      |
| -------- | ------------------------------- |
| Backend  | Node.js + Express               |
| Database | MongoDB Atlas                   |
| AI Model | Groq LLM (can switch to OpenAI) |
| Email    | Nodemailer + IMAP (optional)    |
| Tools    | Postman / Thunder Client        |

Project Structure
rfp-assignment/
└── backend
    ├── server.js
    ├── package.json
    ├── .env.example (recommended)
    ├── src
    │   ├── config.js
    │   ├── models
    │   │   ├── RFP.js
    │   │   ├── Vendor.js
    │   │   └── Proposal.js
    │   ├── controllers
    │   │   ├── rfpController.js
    │   │   ├── vendorController.js
    │   │   └── proposalController.js
    │   ├── services
    │   │   ├── aiService.js
    │   │   └── emailService.js
    │   └── routes
    │       ├── rfpRoutes.js
    │       ├── vendorRoutes.js
    │       └── proposalRoutes.js


⚙ Setup & Installation

1️⃣ Clone project

git clone https://github.com/<your-username>/rfp-assignment.git
cd rfp-assignment/backend


2️⃣ Install dependencies
npm install

3️⃣ Create .env file
PORT=4000

MONGO_URI=your_mongo_atlas_url_here

# AI Key (choose one)
GROQ_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here

# Email config (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=app-password
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_USER=your@gmail.com
IMAP_PASS=app-password
FROM_EMAIL=your@gmail.com


⚠ Make sure .env is added to .gitignore.

4️⃣ Start server
npm run dev


Expected output:

MongoDB connected
Backend running on port 4000

🔥 API Usage (Thunder Client / Postman)
1. Create RFP (AI converts natural text → JSON)
POST http://localhost:4000/api/rfps

{
  "text": "We need 20 Dell laptops with 16GB RAM and 512GB SSD..."
}

2. Add Vendor
POST http://localhost:4000/api/vendors

{
  "name": "TechOne Suppliers",
  "email": "vendor@gmail.com",
  "category": "Laptops"
}

3. Store proposal
POST http://localhost:4000/api/proposals

{
  "rfpId": "...",
  "vendorId": "...",
  "rawEmailText": "...",
  "parsed": { ... }
}

4. Compare all proposals using AI
POST http://localhost:4000/api/rfps/<id>/compare


🧠 Output Example

{
  "aiResult": {
    "scores": { "Vendor A": 92, "Vendor B": 85 },
    "summaries": { ... },
    "recommendation": { "vendorName": "Vendor A", "reason": "Best match" }
  }
}



🎥 Submission Video Flow

Your walkthrough should cover:

Short intro (Problem → Solution)

Show architecture (models, routes, flow)

Run backend

Create RFP

Add vendors

Add 2 proposals

Run AI comparison endpoint

Show output & recommendation

Wrap up + trade-offs + scaling ideas

🔮 Future Enhancements

Frontend Dashboard UI

Automated email reading (IMAP active mode)

Vendor scoring based on history

Authentication & user accounts

👤 Author

Lohith Tirumanyam
Final Year B.Tech • SRM University
Email: lohithrdy4545@gmail.com

Phone: +91 83670 34079
