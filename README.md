# 🧙‍♂️ Notemoire

**Notemoire** is a blockchain-based, AI-powered note-sharing dApp designed for secure storage, smart summarization, and decentralized ownership of academic content. This platform empowers students and educators to create, share, and verify notes using Ethereum, IPFS, and AI tools.

---

## 🦊 HOW TO SETUP METAMASK?

Follow this youtube link: https://youtu.be/-5ugtAt4t1A

OR

### Step 1: Install MetaMask
- Go to the official site: [https://metamask.io/]
- Choose your browser and click “Install MetaMask”
- Add the extension to your browser

### Step 2: Create a Wallet
- Open MetaMask
- Click “Get Started”
- Choose “Create a Wallet”
- Accept or decline MetaMask’s data collection offer
- Create a strong password
- **IMPORTANT:** Write down your **Secret Recovery Phrase** (12 words) and store it securely. **Do not share it with anyone.**

---

## 🌐 HOW TO ADD SEPOLIA TESTNET TO METAMASK

- Open MetaMask
- Click the network dropdown (top left) → Click **“Show test networks”**

If you don’t see this:
- Go to **Settings → Advanced**
- Toggle **“Show test networks”** to ON

Then:
- Go back, click the network dropdown again → Select **“Sepolia”**

---

## 💧 HOW TO CONNECT METAMASK WALLET AND GET SEPOLIA ETH VIA GOOGLE FAUCET

### Step 1: Copy Your Sepolia Wallet Address
- Open MetaMask
- Select the **Sepolia** network
- Click your account name to **copy the address** (starts with `0x...`)

### Step 2: Visit the Google Cloud Sepolia Faucet
- Go to: [https://cloud.google.com/application/web3/faucet/ethereum/sepolia]
- Click **“Connect Wallet”**
- MetaMask will pop up → Select your account → Click **Next**, then **Connect**

### Step 3: Request Sepolia ETH
- Once connected, your wallet address appears
- Click **“Request funds”**
- Wait for the confirmation (Google may use CAPTCHA or have cooldown limits)

### Step 4: Check Your Balance
- Open MetaMask → Make sure Sepolia is selected
- You should see ETH reflected in your balance

---

## 🛠️ FEATURES OF NOTEMOIRE

### 🔐 Secure Note Storage
- Upload personal notes (PDF/text) to your private dashboard

### 🧠 AI-Powered Tools
- **Summarize Notes**: Extracts key ideas to help you revise faster
- **Generate Flashcards**: Creates question-answer pairs to aid memorization

### 🔗 Decentralized Storage + Blockchain Logging
- **IPFS Storage**: Notes are stored on IPFS, split across global nodes
- **Content Identifier (CID)**: Each file gets a unique, tamper-proof hash
- **Blockchain Logging**: CID is logged on the **Pinata** 
- **Proof of Authorship**: Uploads are tied to your wallet address
- **Anti-Plagiarism**: Unique CIDs ensure originality
- **Transparent Tracking**: Blockchain keeps a permanent record

### 🌍 Social Feed with Verified Content
- Public sharing of notes & AI-generated outputs
- Blockchain ensures **creator credit**
- Educators can post **certified content**
- Enables a **trustworthy, transparent** learning community

---

## ▶️ How to Start Notemoire
1. Start the Dashboard Frontend

       cd Dashboard-frontend
       npm install
       $env:PORT=4000; npm start   # For Windows PowerShell

       💡 Use PORT=4000 npm start if you're on macOS/Linux or using a UNIX-compatible terminal like Git Bash.

2. Open a New Terminal

       Use `Ctrl + Shift + `` (backtick) or click the ➕ plus icon in your terminal to open a new terminal session.

3. Start the Sociva App (Server & Client)

       cd server
       npm install
       cd client
       npm install
       $env:PORT=5000; npm start   # For Windows PowerShell


       💡 Again, for macOS/Linux: use PORT=5000 npm start
