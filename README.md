# 📰 MJ Timeline

Decentralized micro-journalism timeline on IOTA blockchain.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat&logo=next.js)](https://nextjs.org/)
[![IOTA](https://img.shields.io/badge/IOTA-dApp_Kit-blue?style=flat)](https://github.com/iotaledger/dapp-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🔐 IOTA Wallet authentication
- 📝 Create posts (up to 500 chars)
- 🔗 On-chain storage with Move smart contracts
- 🕒 Real-time chronological timeline
- 🌐 Fully decentralized - no central server

## � Smart Contract

| Network | Package ID |
|---------|------------|
| Devnet | [`0x...`](https://explorer.iota.org/object/0xe2b4328b6ac44443e2775933242cabee78dc6d0eecb94890eb819cdb26fea3f0?network=devnet) |
| Testnet | `Coming soon` |
| Mainnet | `Coming soon` |

## �🚀 Quick Start

### Prerequisites
- Node.js 18+
- [IOTA Wallet](https://wiki.iota.org/iota-sandbox/welcome/) extension

### Installation

```bash
# Clone & install
git clone https://github.com/yourusername/mjtimeline.git
cd mjtimeline
npm install --legacy-peer-deps

# Deploy contract & run
npm run iota-deploy
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Structure

```
├── app/                # Next.js pages
├── components/         # React components
├── contract/           # Move smart contracts
├── hooks/              # Custom hooks
└── lib/                # Config & utilities
```

## 🛠️ Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run iota-deploy` | Deploy Move contract |

## 🔧 Tech Stack

**Frontend:** Next.js 16, React 19, TypeScript, Radix UI, Tailwind CSS

**Blockchain:** IOTA SDK, dApp Kit, Move

## 📄 License

MIT License - see [LICENSE](LICENSE)
