export function truncateAddress(addr) {
  if (!addr) return ""
  return addr.slice(0,8) + "..." + addr.slice(-4)
}

export function formatETH(amount) {
  return parseFloat(amount).toFixed(2) + " ETH"
}

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
