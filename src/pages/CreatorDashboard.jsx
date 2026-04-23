import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlassCard  from '../components/ui/GlassCard'
import Button     from '../components/ui/Button'
import Badge      from '../components/ui/Badge'
import { useEscrow } from '../context/EscrowContext'
import { MOCK_CREATOR_PROFILE, MOCK_PORTFOLIO, MOCK_ESCROWS } from '../utils/constants'
import { formatETH, formatDate, truncateAddress, getMilestoneProgress } from '../utils/helpers'

const S = {
  between: { display:'flex', justifyContent:'space-between', alignItems:'center' },
  secondary: { color:'var(--text-secondary)' },
  muted: { color:'var(--text-muted)', fontSize:'0.8rem' },
  amber: { color:'var(--accent)' },
  amberBold: { color:'var(--accent)', fontWeight:700 },
  divider: { borderTop:'1px solid var(--border-glass)', margin:'16px 0' },
}

const cardGradient = tags => {
  const t = tags.join(' ').toLowerCase()
  if (t.includes('solidity') || t.includes('defi') || t.includes('hardhat')) return 'linear-gradient(135deg,#1a2035 0%,#0d1929 100%)'
  if (t.includes('figma') || t.includes('design') || t.includes('next')) return 'linear-gradient(135deg,#1a2035 0%,#1f1535 100%)'
  return 'linear-gradient(135deg,#0f1a2e 0%,#1a2035 100%)'
}

export default function CreatorDashboard() {
  const { escrows, submitMilestone, releaseFunds, approveMilestone, loading } = useEscrow()
  const [activeTab, setActiveTab] = useState('portfolio')
  const [actionLoading, setActionLoading] = useState({})

  // Stellar/Freighter integration note: wallet connects via Freighter, balances in XLM
  useEffect(() => {
    const timer = setTimeout(() => { approveMilestone('ESC-001', 'M2') }, 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (escrowId, milestoneId) => {
    setActionLoading(p => ({ ...p, [milestoneId]:true }))
    await submitMilestone(escrowId, milestoneId)
    setActionLoading(p => ({ ...p, [milestoneId]:false }))
  }

  const handleClaim = async (escrowId, milestoneId) => {
    setActionLoading(p => ({ ...p, [milestoneId]:true }))
    await releaseFunds(escrowId, milestoneId)
    setActionLoading(p => ({ ...p, [milestoneId]:false }))
  }

  const activeEscrows = MOCK_ESCROWS.filter(e =>
    e.milestones.some(m => m.status !== 'released')
  )

  const releasedRows = escrows.flatMap(e =>
    e.milestones
      .filter(m => m.status === 'released')
      .map(m => ({ escrowId:e.id, title:e.title, amount:m.amount, date:m.approvedAt, status:'released' }))
  )

  const tabs = ['portfolio','active','earnings']
  const tabLabels = { portfolio:'Portfolio', active:'Active Gigs', earnings:'Earnings' }

  return (
    <div style={{ paddingTop:'80px', minHeight:'100vh', padding:'80px 24px 48px', maxWidth:'1100px', margin:'0 auto' }}>

      {/* ── PROFILE HEADER ── */}
      <GlassCard style={{ padding:'28px', marginBottom:'32px' }}>
        <div style={{ display:'flex', gap:'24px', flexWrap:'wrap', alignItems:'flex-start' }}>
          {/* Avatar */}
          <div style={{ width:'72px', height:'72px', borderRadius:'50%', background:'var(--accent)', color:'#0A0F1E', fontSize:'1.5rem', fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            AR
          </div>
          {/* Info */}
          <div style={{ flex:1, minWidth:'220px' }}>
            <div style={{ fontWeight:800, fontSize:'1.3rem' }}>{MOCK_CREATOR_PROFILE.name}</div>
            <div style={{ ...S.secondary, marginTop:'4px' }}>{MOCK_CREATOR_PROFILE.title}</div>
            {/* Stellar network label */}
            <div style={{ marginTop:'6px', fontSize:'0.78rem', color:'#3B82F6' }}>
              ◆ Stellar Network · Freighter Wallet · XLM
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginTop:'12px' }}>
              {MOCK_CREATOR_PROFILE.skills.map(s => (
                <span key={s} style={{ background:'rgba(255,255,255,0.06)', border:'1px solid var(--border-glass)', borderRadius:'var(--radius-pill)', padding:'4px 12px', fontSize:'0.78rem' }}>{s}</span>
              ))}
            </div>
          </div>
          {/* Stats */}
          <div style={{ flexShrink:0, display:'flex', flexDirection:'column', gap:'6px', alignItems:'flex-end' }}>
            <div style={{ fontWeight:600 }}>⭐ {MOCK_CREATOR_PROFILE.rating} Rating</div>
            <div style={S.secondary}>{MOCK_CREATOR_PROFILE.completedGigs} Completed</div>
            <div style={S.secondary}>{MOCK_CREATOR_PROFILE.activeGigs} Active</div>
            <div style={{ marginTop:'8px', display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'4px' }}>
              <span style={{ background:'var(--accent-dim)', color:'var(--accent)', padding:'6px 14px', borderRadius:'var(--radius-pill)', fontWeight:700, fontSize:'0.88rem' }}>
                {MOCK_CREATOR_PROFILE.workTokenBalance} WORK
              </span>
              <span style={{ ...S.muted }}>Silver Tier</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* ── TAB NAV ── */}
      <div style={{ display:'flex', borderBottom:'1px solid var(--border-glass)', marginBottom:'32px', overflowX:'auto', whiteSpace:'nowrap' }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ background:'none', border:'none', color: activeTab===tab ? 'var(--text-primary)' : 'var(--text-secondary)', padding:'12px 24px', cursor:'pointer', fontSize:'0.95rem', fontWeight: activeTab===tab ? 600 : 500, position:'relative', transition:'color 0.2s' }}
          >
            {tabLabels[tab]}
            {activeTab === tab && (
              <motion.div layoutId="tab-underline" style={{ position:'absolute', bottom:'-1px', left:0, right:0, height:'2px', background:'var(--accent)' }} />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ══ PORTFOLIO TAB ══ */}
        {activeTab === 'portfolio' && (
          <motion.div key="portfolio" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px,1fr))', gap:'20px' }}>
              {MOCK_PORTFOLIO.map(item => (
                <GlassCard key={item.id} hover style={{ padding:0, overflow:'hidden' }}>
                  {/* Thumbnail */}
                  <div style={{ height:'160px', position:'relative', overflow:'hidden', background:cardGradient(item.tags) }}>
                    <motion.div
                      initial={{ opacity:0 }} whileHover={{ opacity:1 }}
                      style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center' }}
                    >
                      <Button variant="ghost" size="sm">View Project</Button>
                    </motion.div>
                    <div style={{ position:'absolute', top:'12px', left:'12px' }}>
                      <span style={{ background:'rgba(10,15,30,0.75)', border:'1px solid var(--border-glass)', borderRadius:'var(--radius-pill)', padding:'3px 10px', fontSize:'0.72rem' }}>
                        {item.tags[0]}
                      </span>
                    </div>
                    <div style={{ position:'absolute', top:'12px', right:'12px' }}>
                      <Badge status={item.status} />
                    </div>
                  </div>
                  {/* Body */}
                  <div style={{ padding:'16px' }}>
                    <div style={{ fontWeight:700, marginBottom:'6px' }}>{item.title}</div>
                    <div style={{ ...S.secondary, fontSize:'0.85rem', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                      {item.description}
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between', marginTop:'12px', paddingTop:'12px', borderTop:'1px solid var(--border-glass)' }}>
                      <span style={S.amberBold}>{item.earned !== '0.0' ? formatETH(item.earned) : 'In Progress'}</span>
                      <span style={S.muted}>{item.completedAt ? formatDate(item.completedAt) : 'Active'}</span>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        )}

        {/* ══ ACTIVE GIGS TAB ══ */}
        {activeTab === 'active' && (
          <motion.div key="active" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
            {activeEscrows.map(e => {
              const prog = getMilestoneProgress(e.milestones)
              return (
                <div key={e.id} style={{ marginBottom:'28px' }}>
                  <GlassCard style={{ padding:'20px', marginBottom:'12px' }}>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'16px', justifyContent:'space-between', alignItems:'flex-start' }}>
                      <div>
                        <div style={{ fontFamily:'monospace', ...S.amber, fontSize:'0.8rem' }}>#{e.id}</div>
                        <div style={{ fontWeight:700, fontSize:'1.05rem', marginTop:'4px' }}>{e.title}</div>
                        <div style={{ ...S.secondary, fontSize:'0.82rem', marginTop:'2px' }}>Client: {truncateAddress(e.client)}</div>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <div style={{ ...S.amberBold, fontSize:'1.2rem' }}>{formatETH(e.totalAmount)}</div>
                        <div style={{ ...S.muted, marginTop:'4px' }}>{prog.completed}/{prog.total} milestones</div>
                        <div style={{ height:'6px', background:'rgba(255,255,255,0.08)', borderRadius:'3px', marginTop:'8px', width:'120px' }}>
                          <div style={{ width:`${prog.percent}%`, height:'100%', background:'var(--accent)', borderRadius:'3px' }} />
                        </div>
                      </div>
                    </div>
                  </GlassCard>

                  <div style={{ marginLeft:'16px', display:'flex', flexDirection:'column', gap:'12px' }}>
                    {e.milestones.map((m, i) => (
                      <GlassCard key={m.id} style={{ padding:'16px' }}>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:'12px', justifyContent:'space-between', alignItems:'flex-start' }}>
                          <div>
                            <div style={{ fontFamily:'monospace', ...S.amber, fontSize:'0.78rem' }}>M{i+1}</div>
                            <div style={{ fontWeight:600, marginTop:'2px' }}>{m.title}</div>
                            <div style={{ ...S.secondary, fontSize:'0.85rem' }}>{m.amount} XLM</div>
                          </div>
                          <Badge status={m.status} />
                        </div>

                        <div style={{ marginTop:'12px' }}>
                          {m.status === 'pending' && (
                            <Button variant="primary" size="sm" loading={actionLoading[m.id]} onClick={() => handleSubmit(e.id, m.id)}>
                              Submit Work
                            </Button>
                          )}
                          {m.status === 'approved' && (
                            <div style={{ background:'var(--accent-dim)', border:'1px solid var(--accent)', borderRadius:'8px', padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                              <div>
                                <div style={{ ...S.amberBold, fontWeight:700 }}>💰 Ready to Claim</div>
                                <div style={{ ...S.amberBold, fontSize:'1.1rem' }}>{formatETH(m.amount)}</div>
                              </div>
                              <Button variant="primary" size="sm" loading={actionLoading[m.id]} onClick={() => handleClaim(e.id, m.id)}>
                                Claim Funds
                              </Button>
                            </div>
                          )}
                          {m.status === 'submitted' && (
                            <div style={{ ...S.secondary, fontSize:'0.85rem' }}>⏳ Awaiting client approval</div>
                          )}
                          {m.status === 'released' && (
                            <div style={{ color:'var(--success)', fontWeight:600 }}>✓ {formatETH(m.amount)} Claimed</div>
                          )}
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </div>
              )
            })}
          </motion.div>
        )}

        {/* ══ EARNINGS TAB ══ */}
        {activeTab === 'earnings' && (
          <motion.div key="earnings" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'16px', marginBottom:'32px' }}>
              {[
                { label:'Total Earned',  val:`${MOCK_CREATOR_PROFILE.totalEarned} XLM`, color:'var(--accent)' },
                { label:'This Month',    val:'2.4 XLM',                                 color:'var(--accent)' },
                { label:'WORK Saved',    val:'1.28 XLM',                                color:'var(--success)' },
              ].map(({ label, val, color }) => (
                <GlassCard key={label} style={{ flex:1, minWidth:'160px', padding:'20px' }}>
                  <div style={{ ...S.secondary, fontSize:'0.8rem', marginBottom:'8px' }}>{label}</div>
                  <div style={{ fontWeight:800, fontSize:'1.6rem', color }}>{val}</div>
                </GlassCard>
              ))}
            </div>

            <div style={{ fontWeight:600, fontSize:'1.05rem', marginBottom:'16px' }}>Transaction History</div>

            {/* Desktop table */}
            <GlassCard style={{ padding:0, overflow:'hidden' }} className="earnings-table-desktop">
              <div style={{ display:'flex', padding:'12px 16px', background:'rgba(255,255,255,0.03)', borderRadius:'16px 16px 0 0' }}>
                {[['Escrow',1.5],['Project',2],['Amount',1],['Date',1.2],['Status',1]].map(([h,f]) => (
                  <div key={h} style={{ flex:f, fontSize:'0.78rem', fontWeight:600, color:'var(--text-secondary)', letterSpacing:'0.05em', textTransform:'uppercase' }}>{h}</div>
                ))}
              </div>
              {releasedRows.length === 0 && (
                <div style={{ padding:'24px 16px', ...S.secondary }}>No released payments yet.</div>
              )}
              {releasedRows.map((row, i) => (
                <div key={i} style={{ display:'flex', padding:'12px 16px', borderBottom:'1px solid var(--border-glass)', fontSize:'0.88rem', background: i%2===1 ? 'rgba(255,255,255,0.015)' : 'transparent', alignItems:'center' }}>
                  <div style={{ flex:1.5, fontFamily:'monospace', ...S.amber, fontSize:'0.8rem' }}>#{row.escrowId}</div>
                  <div style={{ flex:2 }}>{row.title}</div>
                  <div style={{ flex:1, ...S.amberBold }}>{row.amount} XLM</div>
                  <div style={{ flex:1.2, ...S.muted }}>{formatDate(row.date)}</div>
                  <div style={{ flex:1 }}><Badge status="released" /></div>
                </div>
              ))}
            </GlassCard>

            {/* Mobile stacked cards */}
            <div className="earnings-table-mobile" style={{ display:'none' }}>
              {releasedRows.map((row, i) => (
                <GlassCard key={i} style={{ padding:'16px', marginBottom:'12px' }}>
                  <div style={{ fontWeight:600 }}>{row.title}</div>
                  <div style={{ ...S.muted, marginTop:'2px' }}>#{row.escrowId}</div>
                  <div style={{ ...S.between, marginTop:'10px' }}>
                    <span style={S.amberBold}>{row.amount} XLM</span>
                    <span style={S.muted}>{formatDate(row.date)}</span>
                  </div>
                  <div style={{ marginTop:'8px' }}><Badge status="released" /></div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      <style>{`
        @media (max-width: 640px) {
          .earnings-table-desktop { display: none !important; }
          .earnings-table-mobile  { display: block !important; }
        }
      `}</style>
    </div>
  )
}
