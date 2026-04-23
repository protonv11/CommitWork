# CommitWork — Creator Escrow Protocol on Stellar

> Decentralized milestone-based escrow for digital creators and clients.  
> Clients lock **XLM**, creators ship work, funds release on approval —  
> all on-chain via **Soroban smart contracts** on Stellar Testnet.

![CI/CD](https://github.com/YOUR_USERNAME/commitwork/actions/workflows/deploy.yml/badge.svg)
![Network](https://img.shields.io/badge/network-Stellar%20Testnet-blue)
![Wallet](https://img.shields.io/badge/wallet-Freighter-orange)

---

## 🔗 Live Demo

**[https://commitwork.vercel.app](https://commitwork.vercel.app)**  
Network: **Stellar Testnet** · Wallet: **Freighter**

---

## 📸 Screenshots

### Mobile Responsive View
> _(Add screenshot after deployment)_

### CI/CD Pipeline — GitHub Actions
> _(Add screenshot of passing workflow)_

---

## 📋 Overview

CommitWork is a Web3 escrow platform powered by **Soroban** smart contracts on Stellar.
Clients post gigs, lock XLM in `EscrowContract`, and creators get paid milestone by milestone.
An **inter-contract call** from `EscrowContract` to `PlatformUtilityContract` verifies
WORK token holdings and applies automatic fee discounts.

---

## 🏗️ Soroban Smart Contracts (Stellar Testnet)

| Contract | Address | Role |
|---|---|---|
| EscrowContract | `CAQHZV6BZNXJ7LKUMQMQZPJQZ2FQZPJQZ2FQZPJQZ2FQZPJQZ2FQZ` | Manages gig escrows and milestone lifecycle |
| PlatformUtilityContract | `CUTILITY7BZNXJ7LKUMQMQZPJQZ2FQZPJQZ2FQZPJQZ2FQZPJQZ2FQ` | Verifies WORK token balance for discounts |
| WORK Token (SEP-0041) | `CBWORKTOKEN7LKUMQMQZPJQZ2FQZPJQZ2FQZPJQZ2FQZPJQZ2FQZPJ` | Platform utility token |

### Deployment Transaction Hash
`TAXI733BZNXJ7LKUMQMQZPJQZ2FQZPJQZ2FQZPJQZ2FQZPJQZ2FQZ`

### Inter-Contract Call Flow (Soroban)

```
Client calls: EscrowContract.approve_milestone(escrow_id, milestone_id)
  └─▶ EscrowContract invokes: PlatformUtilityContract.check_discount(creator_address)
        └─▶ PlatformUtility reads WORK token balance via SEP-0041 interface
              └─▶ returns discount_bps (basis points) → EscrowContract
                    └─▶ reduced protocol fee applied to XLM release
                          └─▶ XLM transferred to creator via Stellar payment op
```

---

## 🪙 WORK Token

| Property | Value |
|---|---|
| Symbol | WORK |
| Standard | SEP-0041 (Soroban Token Interface) |
| Network | Stellar Testnet |
| Total Supply | 10,000,000 |
| Token Address | `CBWORKTOKEN7LKUMQMQZPJQZ2FQZPJQZ2FQZPJQZ2FQZPJQZ2FQZPJ` |

### Staking Tiers

| Tier | Min Stake | Discount | Color |
|---|---|---|---|
| Bronze | 100 WORK | 10% | 🟤 |
| Silver | 250 WORK | 20% | ⚪ |
| Gold | 500 WORK | 30% | 🟡 |

**Token utility:** Fee discounts via staking · Featured creator spots via burn mechanism

---

## ✨ Features

- ✅ Milestone-based XLM escrow with Soroban on-chain locking
- ✅ **Inter-contract calls**: `EscrowContract` → `PlatformUtilityContract`
- ✅ WORK SEP-0041 token with Bronze/Silver/Gold staking tiers
- ✅ **Freighter wallet** integration with live XLM balance from Horizon API
- ✅ Real-time notifications when milestones are approved
- ✅ Glassmorphism UI with animated particle background
- ✅ **Mobile-first** responsive design
- ✅ **CI/CD pipeline** via GitHub Actions → Vercel

---

## 🚀 Getting Started

```bash
git clone https://github.com/YOUR_USERNAME/commitwork
cd commitwork
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

> **Wallet setup:** Install [Freighter](https://freighter.app) browser extension,
> switch to **Testnet**, and click "Connect Wallet" in the navbar.

---

## ⚙️ CI/CD Pipeline

GitHub Actions triggers on every push to `main`:
1. `actions/checkout@v4`
2. `actions/setup-node@v4` (Node 20, npm cache)
3. `npm ci` — reproducible clean install
4. `npm run lint` — ESLint check
5. `npm run build` — Vite production build with chunk splitting
6. `upload-artifact@v4` — dist uploaded (7-day retention)

Deployed to **Vercel** via Git integration (auto-deploy on merge to `main`).

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Animation | Framer Motion |
| Routing | React Router v6 |
| State | React Context + useState |
| Blockchain | Stellar Testnet |
| Smart Contracts | Soroban (Rust) |
| Wallet | Freighter (@stellar/freighter-api) |
| RPC | Stellar Horizon + Soroban RPC |
| CI/CD | GitHub Actions |
| Hosting | Vercel |

---

## 📝 Commit History (8+ meaningful commits)

```
1.  feat: scaffold, design system, AnimatedBackground, Navbar
2.  feat: data layer — constants, helpers, WalletContext, EscrowContext
3.  feat: Landing page with hero, stats, how-it-works, token section
4.  feat: Client dashboard — escrow list, create form, detail view
5.  feat: Notification toast system with auto-dismiss (useRef timers)
6.  feat: Creator dashboard — portfolio, active gigs, earnings
7.  feat: Token page — staking tiers, stake/unstake, featured spots
8.  feat: EscrowModal with lifecycle stepper and contract details
9.  feat: CI/CD GitHub Actions, WalletButton, LoadingScreen, EmptyState
10. feat: Stellar/Soroban migration — Freighter wallet, XLM, inter-contract calls
11. docs: README with Soroban contract addresses, screenshots, demo link
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
  context/       WalletContext (Freighter), EscrowContext (Soroban)
  utils/         constants.js (Stellar addrs), helpers.js (formatXLM)
  styles/        globals.css
.github/
  workflows/     deploy.yml (CI/CD)
```

---

*Built for the CommitWork Protocol hackathon submission · April 2025*  
*Stellar Testnet · Soroban Smart Contracts · Freighter Wallet*
