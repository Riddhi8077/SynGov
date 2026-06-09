<div align="center">
  <img src="./web/public/images/syn-gov-logo.png" alt="SynGov Logo" width="200" />
  <h1>SynGov 🏛️</h1>
  <p><strong>AI-Powered, Blockchain-Backed Governance for Modern Communities</strong></p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=flat&logo=next.js)](https://nextjs.org/)
  [![Gemini](https://img.shields.io/badge/AI-Google_Gemini_2.5-blue?style=flat&logo=google)](https://deepmind.google/technologies/gemini/)
  [![Ethereum](https://img.shields.io/badge/Web3-Ethereum_Hardhat-3C3C3D?style=flat&logo=ethereum)](https://hardhat.org/)
  [![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
</div>

<br />

## 📖 What is SynGov?

**SynGov** (Synergistic Governance) is an intelligent, transparent, and decentralized governance platform engineered specifically for college clubs, DAOs, and student societies. 

Traditional community governance is plagued by chaotic group chats, disorganized proposals, and informal voting that lacks transparency and auditability. SynGov replaces this chaos with a highly structured environment where:
1. **Raw ideas** are synthesized into clear executive summaries by **Google Gemini 2.5**.
2. **Votes and decisions** are logged immutably on a local **Ethereum blockchain** to ensure absolute cryptographic trust.

---

## ⚡ Core Features

- 🧠 **AI-Powered Proposal Analysis:** Submit raw, unstructured ideas and let Google Gemini 2.5 instantly synthesize them. The AI automatically extracts the core objective, budget impact, risk level, and timeline, transforming a block of text into a professional executive summary.
- 🔗 **Blockchain Transparency (Web3):** Every proposal created and every vote cast is securely logged to a Web3 Smart Contract (`SynGovLogger.sol`). This ensures that the governance process is immutable, verifiable, and completely tamper-proof.
- 📊 **Real-Time Analytics & KPI Dashboards:** Visualize community health, active proposals by category, and historical pass/reject rates through a dynamic, real-time data dashboard.
- 🔐 **Simulated / Configurable Authentication:** Secure member login flows using HTTP-only cookies, ready to be scaled to full OAuth/SSO.
- 🎨 **Premium Aesthetic UI:** Built with a stunning, highly responsive Next.js interface featuring glassmorphism, fluid micro-animations, and modern design principles.

---

## 🏗️ Architecture & Tech Stack

SynGov is built using a modern, full-stack architecture combining Web2 speed with Web3 transparency:

### Frontend
- **Framework:** [Next.js](https://nextjs.org/) (App Router, Server Actions)
- **Styling:** Vanilla CSS with comprehensive design tokens (Dark mode optimized)
- **State Management:** React Hooks (`useState`, `useEffect`) & Server-Side Cookies

### AI & Backend Services
- **AI Engine:** Google Gemini 2.5 Flash via Vertex AI (`@google/genai`)
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL) for relational data storage (Proposals, Analytics)

### Blockchain / Web3
- **Network:** Local Ethereum Node via [Hardhat](https://hardhat.org/)
- **Smart Contracts:** Solidity (`SynGovLogger.sol`)
- **Integration:** [Ethers.js](https://docs.ethers.org/) (v6)

---

## 🚀 Local Development Setup

Follow these instructions to set up the SynGov environment locally on your machine for development and testing.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- Google Cloud CLI (for Vertex AI authentication)

### 1. Clone the Repository
```bash
git clone https://github.com/Dineshkumar2006471/Syn-Gov.git
cd Syn-Gov
```

### 2. Configure Environment Variables
Navigate to the `web` directory and create your environment file:
```bash
cd web
touch .env.local
```
Add the following configuration (replace with your actual API keys):
```env
# Google Cloud / Gemini Vertex AI
GOOGLE_CLOUD_PROJECT=your-google-cloud-project-id

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Web3 Configuration
RPC_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=your_deployed_contract_address_here
RELAYER_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

### 3. Deploy the Smart Contract (Web3)
You need to run a local blockchain node to handle the immutable voting logs. Open a **new terminal window** and run:
```bash
# From the root Syn-Gov directory
npx hardhat node
```
Leave that terminal running. In a **second terminal**, deploy the contract:
```bash
npx hardhat run scripts/deploy.js --network localhost
```
*Take note of the deployed contract address output in the terminal, and update the `CONTRACT_ADDRESS` in your `.env.local` file.*

### 4. Start the Frontend Application
Navigate back to the `web` directory, install dependencies, and start the development server:
```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ Security & Privacy Architecture

- **On-Chain Anonymity:** When votes are logged to the blockchain, they utilize a cryptographically hashed User ID. This guarantees mathematical transparency of the vote tally without exposing direct identities on the public ledger.
- **Server-Side Security:** Sensitive AI prompts, model configuration, and direct database interactions are kept entirely on the server using Next.js Server Actions, ensuring API keys are never exposed to the client browser.

---

## 🤝 Contributing

We welcome contributions to SynGov! Please see our contribution guidelines:
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is distributed under the MIT License. See `LICENSE` for more information.
