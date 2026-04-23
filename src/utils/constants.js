// ── Stellar / Soroban addresses (Testnet) ──────────────────────────────────
export const STELLAR_NETWORK = {
  name:       "Stellar Testnet",
  passphrase: "Test SDF Network ; September 2015",
  horizon:    "https://horizon-testnet.stellar.org",
  sorobanRpc: "https://soroban-testnet.stellar.org",
}

// Soroban contract addresses (deployed on Stellar Testnet)
export const CONTRACTS = {
  escrow:   "CAQHZV6BZNXJ7LKUMQMQZPJQZ2FQZPJQZ2FQZPJQZ2FQZPJQZ2FQZ",
  work:     "CBWORKTOKEN7LKUMQMQZPJQZ2FQZPJQZ2FQZPJQZ2FQZPJQZ2FQZPJ",
  utility:  "CUTILITY7BZNXJ7LKUMQMQZPJQZ2FQZPJQZ2FQZPJQZ2FQZPJQZ2FQ",
}

// Stellar G-addresses (56 chars, base32)
const CLIENT_ADDR  = "GAXI733BZNXJ7LKUMQMQZPJQZ2FQZPJQZ2FQZPJQZ2FQZPJQZ2FQZP"
const CREATOR_ADDR = "GBXLK7BZNXJ7LKUMQMQZPJQZ2FQZPJQZ2FQZPJQZ2FQZPJQZ2FQZPJQ"
const CLIENT2_ADDR = "GCORK7BZNXJ7LKUMQMQZPJQZ2FQZPJQZ2FQZPJQZ2FQZPJQZ2FQZPJQ"
const CREATOR2_ADDR= "GDMKR7BZNXJ7LKUMQMQZPJQZ2FQZPJQZ2FQZPJQZ2FQZPJQZ2FQZPJQ"

export const MOCK_ESCROWS = [
  {
    id: "ESC-001",
    title: "DeFi Dashboard Redesign",
    client:  CLIENT_ADDR,
    creator: CREATOR_ADDR,
    totalAmount: "2400",
    currency: "XLM",
    status: "active",
    workTokenDiscount: 10,
    createdAt: "2025-04-01",
    milestones: [
      { id:"M1", title:"Wireframes & Design",      amount:"600",  status:"released",  submittedAt:"2025-04-05", approvedAt:"2025-04-06" },
      { id:"M2", title:"Frontend Implementation",  amount:"1200", status:"approved",  submittedAt:"2025-04-12", approvedAt:null },
      { id:"M3", title:"Testing & Handoff",         amount:"600",  status:"pending",   submittedAt:null,         approvedAt:null }
    ]
  },
  {
    id: "ESC-002",
    title: "Soroban Smart Contract Suite",
    client:  CLIENT_ADDR,
    creator: CREATOR2_ADDR,
    totalAmount: "1800",
    currency: "XLM",
    status: "active",
    workTokenDiscount: 20,
    createdAt: "2025-04-08",
    milestones: [
      { id:"M1", title:"Contract Architecture",    amount:"400",  status:"released",  submittedAt:"2025-04-10", approvedAt:"2025-04-11" },
      { id:"M2", title:"Core Invoke Functions",    amount:"800",  status:"submitted", submittedAt:"2025-04-15", approvedAt:null },
      { id:"M3", title:"Security Audit & Deploy",  amount:"600",  status:"pending",   submittedAt:null,         approvedAt:null }
    ]
  },
  {
    id: "ESC-003",
    title: "Creator Portfolio Website",
    client:  CLIENT2_ADDR,
    creator: CREATOR_ADDR,
    totalAmount: "900",
    currency: "XLM",
    status: "completed",
    workTokenDiscount: 10,
    createdAt: "2025-03-15",
    milestones: [
      { id:"M1", title:"Design Mockups",  amount:"300", status:"released", submittedAt:"2025-03-18", approvedAt:"2025-03-19" },
      { id:"M2", title:"Development",     amount:"600", status:"released", submittedAt:"2025-03-25", approvedAt:"2025-03-26" }
    ]
  },
  {
    id: "ESC-004",
    title: "DAO Governance UI",
    client:  CLIENT_ADDR,
    creator: CREATOR2_ADDR,
    totalAmount: "3200",
    currency: "XLM",
    status: "active",
    workTokenDiscount: 0,
    createdAt: "2025-04-14",
    milestones: [
      { id:"M1", title:"Research & Spec",       amount:"400",  status:"released", submittedAt:"2025-04-16", approvedAt:"2025-04-17" },
      { id:"M2", title:"Component Library",     amount:"1200", status:"pending",  submittedAt:null,         approvedAt:null },
      { id:"M3", title:"Integration & Testing", amount:"1000", status:"pending",  submittedAt:null,         approvedAt:null },
      { id:"M4", title:"Deployment",             amount:"600",  status:"pending",  submittedAt:null,         approvedAt:null }
    ]
  },
  {
    id: "ESC-005",
    title: "Token Analytics Dashboard",
    client:  CLIENT2_ADDR,
    creator: CREATOR_ADDR,
    totalAmount: "1500",
    currency: "XLM",
    status: "pending",
    workTokenDiscount: 20,
    createdAt: "2025-04-18",
    milestones: [
      { id:"M1", title:"Data Architecture",      amount:"500", status:"pending", submittedAt:null, approvedAt:null },
      { id:"M2", title:"Chart Components",        amount:"600", status:"pending", submittedAt:null, approvedAt:null },
      { id:"M3", title:"Live Data Integration",   amount:"400", status:"pending", submittedAt:null, approvedAt:null }
    ]
  }
]

export const MOCK_CREATOR_PROFILE = {
  address:           CREATOR_ADDR,
  name:              "Alex Rivera",
  title:             "Full-Stack Web3 / Soroban Developer",
  skills:            ["React", "Soroban", "Rust", "Figma", "Stellar SDK"],
  workTokenBalance:  350,
  stakedTokens:      200,
  totalEarned:       "12800",
  activeGigs:        2,
  completedGigs:     14,
  rating:            4.9
}

export const MOCK_PORTFOLIO = [
  { id:"P1", title:"NFT Marketplace",         description:"Full-stack NFT platform with auction mechanics and IPFS storage",    tags:["React","Soroban","IPFS"],           status:"completed", earned:"3200", completedAt:"2025-03-10" },
  { id:"P2", title:"Stellar Yield Aggregator",description:"Automated XLM yield farming with multi-pool strategy execution",     tags:["React","Stellar SDK","Soroban"],    status:"completed", earned:"2800", completedAt:"2025-02-22" },
  { id:"P3", title:"DAO Voting Platform",     description:"On-chain governance portal with Soroban proposal and delegation",     tags:["Next.js","Soroban","Rust"],         status:"completed", earned:"1900", completedAt:"2025-01-30" },
  { id:"P4", title:"Web3 Wallet UI Kit",      description:"Reusable components for Freighter wallet connection and tx display",  tags:["React","TypeScript","Storybook"],   status:"completed", earned:"1100", completedAt:"2024-12-15" },
  { id:"P5", title:"Creator Portfolio Site",  description:"Glassmorphism portfolio with on-chain Stellar credential verify",     tags:["React","IPFS","Stellar"],           status:"completed", earned:"900",  completedAt:"2025-03-26" },
  { id:"P6", title:"Token Analytics Board",   description:"Real-time XLM token metrics with price charts and holder analytics",  tags:["React","WebSocket","Recharts"],     status:"active",    earned:"0",   completedAt:null }
]

export const MOCK_TOKEN_DATA = {
  symbol:       "WORK",
  name:         "CommitWork Token",
  standard:     "SEP-0041 (Soroban Token Interface)",
  totalSupply:  "10,000,000",
  userBalance:  350,
  stakedBalance:200,
  priceUSD:     0.042,
  tiers: [
    { name:"Bronze", minStake:100, discount:10, color:"#CD7F32" },
    { name:"Silver", minStake:250, discount:20, color:"#C0C0C0" },
    { name:"Gold",   minStake:500, discount:30, color:"#F59E0B" }
  ]
}

export const MOCK_EVENTS = [
  { id:"EV01", type:"MilestoneApproved", escrowId:"ESC-001", milestone:"M1", amount:"600",  timestamp: Date.now() - 3_600_000 },
  { id:"EV02", type:"FundsLocked",       escrowId:"ESC-002", amount:"1800",                 timestamp: Date.now() - 7_200_000 },
  { id:"EV03", type:"WorkSubmitted",     escrowId:"ESC-002", milestone:"M2",                timestamp: Date.now() - 14_400_000 },
  { id:"EV04", type:"DiscountApplied",   escrowId:"ESC-001", amount:"24",                   timestamp: Date.now() - 18_000_000 },
  { id:"EV05", type:"FundsReleased",     escrowId:"ESC-001", milestone:"M1", amount:"600",  timestamp: Date.now() - 86_400_000 },
  { id:"EV06", type:"MilestoneApproved", escrowId:"ESC-003", milestone:"M2",                timestamp: Date.now() - 172_800_000 },
  { id:"EV07", type:"FundsLocked",       escrowId:"ESC-004", amount:"3200",                 timestamp: Date.now() - 259_200_000 },
  { id:"EV08", type:"FundsReleased",     escrowId:"ESC-003", milestone:"M1", amount:"300",  timestamp: Date.now() - 345_600_000 },
  { id:"EV09", type:"WorkSubmitted",     escrowId:"ESC-001", milestone:"M2",                timestamp: Date.now() - 432_000_000 },
  { id:"EV10", type:"FundsLocked",       escrowId:"ESC-001", amount:"2400",                 timestamp: Date.now() - 518_400_000 }
]

export const MOCK_TRANSACTIONS = [
  { type:"Stake",        amount:"100 WORK",  date:"Apr 10, 2025", hash:"TAXI733BZN...1A2B" },
  { type:"Received",     amount:"50 WORK",   date:"Apr 8, 2025",  hash:"TBXLK7BZNX...3C4D" },
  { type:"Fee Discount", amount:"24 XLM",    date:"Apr 6, 2025",  hash:"TCORK7BZNX...5E6F" },
  { type:"Stake",        amount:"100 WORK",  date:"Apr 3, 2025",  hash:"TDMKR7BZNX...7G8H" },
  { type:"Purchase",     amount:"200 WORK",  date:"Mar 28, 2025", hash:"TEORK7BZNX...9I0J" }
]
