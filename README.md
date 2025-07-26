# 🧙‍♂️ Notemoire

**Notemoire** is a blockchain-based, AI-powered note-sharing dApp designed for secure storage, smart summarization, and decentralized ownership of academic content. This platform empowers students and educators to create, share, and verify notes using Ethereum, IPFS, and AI tools.

> ### ⚠️ Recommended Setup
> ✅ **DO NOT use GitHub Codespaces**  
> 🔄 **Instead, clone the repository locally for the best experience**  
> ⚙️ **Always start _both_ applications (Dashboard & Sociva) before using any features**

---

## ▶️ How to Start Notemoire

### 1. Start the Dashboard Frontend

```bash
cd Dashboard-frontend
npm install
$env:PORT=4000; npm start   # For Windows PowerShell
```

💡 For macOS/Linux or Git Bash:

```bash
PORT=4000 npm start
```

---

### 2. Open a New Terminal

- Use `Ctrl + Shift + \`` (backtick)  
  or click the ➕ plus icon in your terminal to open a new session.

---

### 3. Start the Sociva App (Server & Client)

```bash
cd server
npm install
cd client
npm install --legacy-peer-deps
$env:PORT=5000; npm start   # For Windows PowerShell
```

💡 For macOS/Linux:

```bash
PORT=5000 npm start
```

---

## ⚠️ Prerequisite

Before using Notemoire, make sure you have MetaMask installed and set up.
You won’t be able to access most features unless your wallet is connected and funded with Sepolia ETH.

---

## 🦊 How to Set Up MetaMask

Watch this [YouTube guide](https://youtu.be/-5ugtAt4t1A)  
OR follow these steps manually:

### Step 1: Install MetaMask

- Go to [https://metamask.io/](https://metamask.io/)
- Choose your browser and click **Install MetaMask**
- Add the extension to your browser

### Step 2: Create a Wallet

- Open MetaMask and click **Get Started**
- Choose **Create a Wallet**
- Accept or decline data collection
- Set a strong password
- 📜 **IMPORTANT:** Write down your **Secret Recovery Phrase** (12 words) and store it securely

---

## 🌐 Add Sepolia Testnet to MetaMask

- Open MetaMask
- Click the network dropdown → **Show test networks**

If not visible:
- Go to **Settings → Advanced**
- Toggle **“Show test networks”** to ON

Then:
- Reopen the dropdown and select **“Sepolia”**

---

## 💧 Get Sepolia ETH via Google Faucet

### Step 1: Copy Your Wallet Address

- Open MetaMask
- Select the **Sepolia** network
- Click your account to copy the address (starts with `0x...`)

### Step 2: Visit Faucet

- Go to: [https://cloud.google.com/application/web3/faucet/ethereum/sepolia](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)
- Click **Connect Wallet**
- Follow MetaMask prompts to connect

### Step 3: Request ETH

- Click **Request Funds**
- Complete CAPTCHA if prompted
- ETH should arrive shortly

---

## 🛠️ Features of Notemoire

### 🔐 Secure Note Storage

- Upload personal notes (PDF/text) to your private dashboard

### 🧠 AI-Powered Tools

- **Summarize Notes** — Quickly understand key concepts
- **Generate Flashcards** — Auto-create Q&A pairs for revision

### 🔗 Decentralized Storage + Blockchain Logging

- **IPFS** — Distributes note storage globally
- **CID Hashing** — Ensures file originality and integrity
- **Blockchain Logging** — Every upload is permanently logged
- **Wallet Binding** — Uploads are tied to wallet addresses
- **Anti-Plagiarism** — Unique hashes prevent copying

### 🌍 Social Feed with Verified Content

- Public feed for verified & AI-generated content
- Blockchain verifies **creator credit**
- **Educators** can post certified learning material
- Encourages transparent and credible content sharing
