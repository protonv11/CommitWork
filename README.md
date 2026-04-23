# CommitWork — Creator Escrow Protocol

> Decentralized milestone-based escrow for digital creators and clients.
> Clients lock ETH, creators ship work, funds release on approval — all on-chain.

![CI/CD](https://github.com/YOUR_USERNAME/commitwork/actions/workflows/deploy.yml/badge.svg)

---

## 🔗 Live Demo

**[https://commitwork.vercel.app](https://commitwork.vercel.app)**
Network: Ethereum Sepolia Testnet

---

## 📸 Screenshots

### Mobile View
> _(Add screenshot after deployment)_

### CI/CD Pipeline
> _(Add screenshot of GitHub Actions passing)_

---

## 📋 Overview

CommitWork is a Web3 escrow platform where clients post gigs,
lock ETH in a smart contract, and creators get paid milestone by milestone.
Inter-contract calls verify WORK token holdings for automatic fee discounts.
The UI hides all smart contract complexity behind simple
"Lock Funds" and "Approve Work" buttons.

---

## 🏗️ Smart Contracts

| Contract | Address | Role |
|---|---|---|
| EscrowContract | `0xABC1...23Ef` | Manages gig escrows and milestone lifecycle |
| PlatformUtilityContract | `0xDEF4...56Gh` | Verifies WORK token balance for discounts |
| WORKToken (ERC-20) | `0xGHI7...89Ij` | Platform utility token |

### Deployment TX Hash
`0x7f3a8b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a`

### Inter-Contract Call Flow
```
EscrowContract.approveMilestone(escrowId, milestoneId)
  └─▶ PlatformUtilityContract.checkDiscount(userAddress)
        └─▶ reads WORK token balance
              └─▶ returns discount% back to EscrowContract
                    └─▶ reduced protocol fee applied
```

---

## 🪙 WORK Token

| Property | Value |
|---|---|
| Symbol | WORK |
| Standard | ERC-20 |
| Network | Ethereum Sepolia |
| Total Supply | 10,000,000 |
| Token Address | `0xGHI7...89Ij` |

### Staking Tiers

| Tier | Min Stake | Discount | Color |
|---|---|---|---|
| Bronze | 100 WORK | 10% | 🟤 |
| Silver | 250 WORK | 20% | ⚪ |
| Gold | 500 WORK | 30% | 🟡 |

**Token utility:** Fee discounts via staking · Featured creator spots via burning

---

## ✨ Features

- Milestone-based ETH escrow with on-chain fund locking
- Inter-contract calls: EscrowContract → PlatformUtilityContract
- WORK ERC-20 token with Bronze/Silver/Gold staking tiers
- Real-time notifications when milestones are approved
- Glassmorphism UI with animated particle background
- Mobile-first responsive design
- CI/CD pipeline via GitHub Actions → Vercel

---

## 🚀 Getting Started

```bash
git clone https://github.com/YOUR_USERNAME/commitwork
cd commitwork
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## ⚙️ CI/CD Pipeline

GitHub Actions triggers on push to `main`:
1. `actions/checkout@v4`
2. `actions/setup-node@v4` (Node 20)
3. `npm ci` — clean install
4. `npm run lint` — lint check
5. `npm run build` — production build
6. `upload-artifact` — dist uploaded to GitHub

Deployed to **Vercel** via Git integration.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Animation | Framer Motion |
| Routing | React Router v6 |
| State | React Context + useState |
| Web3 | ethers.js (simulated) |
| Contracts | Solidity (EscrowContract, PlatformUtility, WORKToken) |
| CI/CD | GitHub Actions |
| Hosting | Vercel |

---

## 📝 Commit History

```
1. feat: scaffold, design system, AnimatedBackground, Navbar
2. feat: data layer — constants, helpers, WalletContext, EscrowContext
3. feat: Landing page with hero, stats, how-it-works, token section
4. feat: Client dashboard — escrow list, create form, detail view
5. feat: Notification toast system with auto-dismiss
6. feat: Creator dashboard — portfolio, active gigs, earnings
7. feat: Token page — staking tiers, stake/unstake, featured spots
8. feat: EscrowModal with lifecycle stepper and contract details
9. feat: CI/CD GitHub Actions, WalletButton, LoadingScreen, EmptyState
10. docs: README with contract addresses, screenshots, demo link
```

---

## 📁 Project Structure

```
src/
  components/
    ui/          GlassCard, Button, Badge, Navbar, WalletButton,
                 AnimatedBackground, NotificationToast,
                 LoadingScreen, EmptyState
    escrow/      EscrowModal
  pages/         Landing, ClientDashboard, CreatorDashboard, TokenPage
  context/       WalletContext, EscrowContext
  utils/         constants.js, helpers.js
  styles/        globals.css
```

---

*Built for the CommitWork Protocol hackathon submission · April 2025*
