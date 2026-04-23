export const MOCK_ESCROWS = [
  {
    id: "ESC-001",
    title: "DeFi Dashboard Redesign",
    client: "0xA1B2C3D4E5F6A1B2",
    creator: "0xE5F6G7H8I9J0E5F6",
    totalAmount: "2.4",
    currency: "ETH",
    status: "active",
    workTokenDiscount: 10,
    createdAt: "2025-04-01",
    milestones: [
      { id:"M1", title:"Wireframes & Design",      amount:"0.6", status:"released",  submittedAt:"2025-04-05", approvedAt:"2025-04-06" },
      { id:"M2", title:"Frontend Implementation",  amount:"1.2", status:"approved",  submittedAt:"2025-04-12", approvedAt:null },
      { id:"M3", title:"Testing & Handoff",        amount:"0.6", status:"pending",   submittedAt:null,         approvedAt:null }
    ]
  },
  {
    id: "ESC-002",
    title: "NFT Minting Smart Contract",
    client: "0xA1B2C3D4E5F6A1B2",
    creator: "0xK1L2M3N4O5P6K1L2",
    totalAmount: "1.8",
    currency: "ETH",
    status: "active",
    workTokenDiscount: 20,
    createdAt: "2025-04-08",
    milestones: [
      { id:"M1", title:"Contract Architecture",    amount:"0.4", status:"released",  submittedAt:"2025-04-10", approvedAt:"2025-04-11" },
      { id:"M2", title:"Core Mint Functions",      amount:"0.8", status:"submitted", submittedAt:"2025-04-15", approvedAt:null },
      { id:"M3", title:"Security Audit & Deploy",  amount:"0.6", status:"pending",   submittedAt:null,         approvedAt:null }
    ]
  },
  {
    id: "ESC-003",
    title: "Creator Portfolio Website",
    client: "0xQ1R2S3T4U5V6Q1R2",
    creator: "0xE5F6G7H8I9J0E5F6",
    totalAmount: "0.9",
    currency: "ETH",
    status: "completed",
    workTokenDiscount: 10,
    createdAt: "2025-03-15",
    milestones: [
      { id:"M1", title:"Design Mockups",           amount:"0.3", status:"released",  submittedAt:"2025-03-18", approvedAt:"2025-03-19" },
      { id:"M2", title:"Development",              amount:"0.6", status:"released",  submittedAt:"2025-03-25", approvedAt:"2025-03-26" }
    ]
  },
  {
    id: "ESC-004",
    title: "DAO Governance UI",
    client: "0xA1B2C3D4E5F6A1B2",
    creator: "0xW1X2Y3Z4A5B6W1X2",
    totalAmount: "3.2",
    currency: "ETH",
    status: "active",
    workTokenDiscount: 0,
    createdAt: "2025-04-14",
    milestones: [
      { id:"M1", title:"Research & Spec",          amount:"0.4", status:"released",  submittedAt:"2025-04-16", approvedAt:"2025-04-17" },
      { id:"M2", title:"Component Library",        amount:"1.2", status:"pending",   submittedAt:null,         approvedAt:null },
      { id:"M3", title:"Integration & Testing",    amount:"1.0", status:"pending",   submittedAt:null,         approvedAt:null },
      { id:"M4", title:"Deployment",               amount:"0.6", status:"pending",   submittedAt:null,         approvedAt:null }
    ]
  },
  {
    id: "ESC-005",
    title: "Token Analytics Dashboard",
    client: "0xC1D2E3F4G5H6C1D2",
    creator: "0xE5F6G7H8I9J0E5F6",
    totalAmount: "1.5",
    currency: "ETH",
    status: "pending",
    workTokenDiscount: 20,
    createdAt: "2025-04-18",
    milestones: [
      { id:"M1", title:"Data Architecture",        amount:"0.5", status:"pending",   submittedAt:null,         approvedAt:null },
      { id:"M2", title:"Chart Components",         amount:"0.6", status:"pending",   submittedAt:null,         approvedAt:null },
      { id:"M3", title:"Live Data Integration",    amount:"0.4", status:"pending",   submittedAt:null,         approvedAt:null }
    ]
  }
]

export const MOCK_CREATOR_PROFILE = {
  address: "0xE5F6G7H8I9J0E5F6",
  name: "Alex Rivera",
  title: "Full-Stack Web3 Developer",
  skills: ["React", "Solidity", "Node.js", "Figma", "ethers.js"],
  workTokenBalance: 350,
  stakedTokens: 200,
  totalEarned: "12.8",
  activeGigs: 2,
  completedGigs: 14,
  rating: 4.9
}

export const MOCK_PORTFOLIO = [
  { id:"P1", title:"NFT Marketplace",         description:"Full-stack NFT platform with auction mechanics and IPFS storage",   tags:["React","Solidity","IPFS"],          status:"completed", earned:"3.2", completedAt:"2025-03-10" },
  { id:"P2", title:"DeFi Yield Aggregator",   description:"Automated yield farming with multi-protocol strategy execution",    tags:["React","ethers.js","Hardhat"],      status:"completed", earned:"2.8", completedAt:"2025-02-22" },
  { id:"P3", title:"DAO Voting Platform",     description:"On-chain governance portal with proposal creation and delegation",   tags:["Next.js","Solidity","The Graph"],   status:"completed", earned:"1.9", completedAt:"2025-01-30" },
  { id:"P4", title:"Web3 Wallet UI Kit",      description:"Reusable component library for wallet connection and tx display",    tags:["React","TypeScript","Storybook"],   status:"completed", earned:"1.1", completedAt:"2024-12-15" },
  { id:"P5", title:"Creator Portfolio Site",  description:"Glassmorphism portfolio with on-chain credential verification",     tags:["React","IPFS","ENS"],               status:"completed", earned:"0.9", completedAt:"2025-03-26" },
  { id:"P6", title:"Token Analytics Board",   description:"Real-time token metrics with price charts and holder analytics",    tags:["React","WebSocket","Recharts"],     status:"active",    earned:"0.0", completedAt:null }
]

export const MOCK_TOKEN_DATA = {
  symbol: "WORK",
  name: "CommitWork Token",
  totalSupply: "10,000,000",
  userBalance: 350,
  stakedBalance: 200,
  priceUSD: 0.042,
  tiers: [
    { name:"Bronze", minStake:100, discount:10, color:"#CD7F32" },
    { name:"Silver", minStake:250, discount:20, color:"#C0C0C0" },
    { name:"Gold",   minStake:500, discount:30, color:"#F59E0B" }
  ]
}

export const MOCK_EVENTS = [
  { id:"EV01", type:"MilestoneApproved",  escrowId:"ESC-001", milestone:"M1", amount:"0.6",  timestamp: Date.now() - 3_600_000 },
  { id:"EV02", type:"FundsLocked",        escrowId:"ESC-002", amount:"1.8",                  timestamp: Date.now() - 7_200_000 },
  { id:"EV03", type:"WorkSubmitted",      escrowId:"ESC-002", milestone:"M2",                timestamp: Date.now() - 14_400_000 },
  { id:"EV04", type:"DiscountApplied",    escrowId:"ESC-001", amount:"0.024",                timestamp: Date.now() - 18_000_000 },
  { id:"EV05", type:"FundsReleased",      escrowId:"ESC-001", milestone:"M1", amount:"0.6",  timestamp: Date.now() - 86_400_000 },
  { id:"EV06", type:"MilestoneApproved",  escrowId:"ESC-003", milestone:"M2",                timestamp: Date.now() - 172_800_000 },
  { id:"EV07", type:"FundsLocked",        escrowId:"ESC-004", amount:"3.2",                  timestamp: Date.now() - 259_200_000 },
  { id:"EV08", type:"FundsReleased",      escrowId:"ESC-003", milestone:"M1", amount:"0.3",  timestamp: Date.now() - 345_600_000 },
  { id:"EV09", type:"WorkSubmitted",      escrowId:"ESC-001", milestone:"M2",                timestamp: Date.now() - 432_000_000 },
  { id:"EV10", type:"FundsLocked",        escrowId:"ESC-001", amount:"2.4",                  timestamp: Date.now() - 518_400_000 }
]

export const MOCK_TRANSACTIONS = [
  { type:"Stake",             amount:"100 WORK", date:"Apr 10, 2025", hash:"0x1a2b...3c4d" },
  { type:"Received",          amount:"50 WORK",  date:"Apr 8, 2025",  hash:"0x5e6f...7g8h" },
  { type:"Fee Discount",      amount:"0.024 ETH",date:"Apr 6, 2025",  hash:"0x9i0j...1k2l" },
  { type:"Stake",             amount:"100 WORK", date:"Apr 3, 2025",  hash:"0x3m4n...5o6p" },
  { type:"Purchase",          amount:"200 WORK", date:"Mar 28, 2025", hash:"0x7q8r...9s0t" }
]
