// Stellar G-addresses are 56 chars — show G + 5 chars + ... + last 4
export function truncateAddress(addr) {
  if (!addr) return ""
  if (addr.startsWith('G') && addr.length >= 10) return addr.slice(0,6) + '...' + addr.slice(-4)
  return addr.slice(0,8) + '...' + addr.slice(-4)
}

// Format XLM amounts — amounts stored as integer stroops representation for display
export function formatXLM(amount) {
  const n = parseFloat(amount)
  if (isNaN(n)) return '0 XLM'
  // If amount looks like stroops (>= 1000), display as XLM with 2 decimals
  return (n >= 1000 ? (n / 100).toFixed(2) : n.toFixed(2)) + ' XLM'
}

// Backward-compat alias — all pages import formatETH but now render XLM
export const formatETH = formatXLM

export function formatDate(str) {
  if (!str) return "—"
  return new Date(str).toLocaleDateString('en-US',
    { month:'short', day:'numeric', year:'numeric' })
}

export function formatTimeAgo(ts) {
  const diff = Date.now() - ts
  const m = Math.floor(diff/60000)
  const h = Math.floor(diff/3600000)
  const d = Math.floor(diff/86400000)
  if (m < 1)  return "just now"
  if (m < 60) return m + "m ago"
  if (h < 24) return h + "h ago"
  return d + "d ago"
}

export function getMilestoneProgress(milestones) {
  const total = milestones.length
  const completed = milestones.filter(
    m => m.status === "released" || m.status === "approved"
  ).length
  return { completed, total, percent: Math.round((completed/total)*100) }
}

export function getCurrentTier(staked, tiers) {
  return [...tiers]
    .reverse()
    .find(t => staked >= t.minStake) || null
}

export function getStatusColor(status) {
  const map = {
    pending:   "var(--text-muted)",
    active:    "#3B82F6",
    submitted: "var(--accent)",
    approved:  "var(--success)",
    released:  "var(--success)",
    completed: "var(--success)",
    disputed:  "var(--error)"
  }
  return map[status] || "var(--text-secondary)"
}

export function generateId(prefix) {
  return prefix + "-" + Math.random().toString(36).slice(2,7).toUpperCase()
}
