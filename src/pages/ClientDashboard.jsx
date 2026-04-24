import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlassCard  from '../components/ui/GlassCard'
import Button     from '../components/ui/Button'
import Badge      from '../components/ui/Badge'
import { useEscrow } from '../context/EscrowContext'

import { MOCK_CREATOR_PROFILE } from '../utils/constants'
import { truncateAddress, formatETH, formatDate, formatTimeAgo, getMilestoneProgress } from '../utils/helpers'

const S = {
  muted: { color: 'var(--text-muted)', fontSize: '0.8rem' },
  secondary: { color: 'var(--text-secondary)' },
  amber: { color: 'var(--accent)' },
  amberBold: { color: 'var(--accent)', fontWeight: 700 },
  divider: { borderTop: '1px solid var(--border-glass)', margin: '16px 0' },
  between: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
}

const CheckSVG = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="2,8 6,12 14,4" />
  </svg>
)
const ChevronSVG = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="6,4 10,8 6,12" />
  </svg>
)

const eventColor = t => ({ FundsLocked:'#3B82F6', WorkSubmitted:'var(--accent)', MilestoneApproved:'var(--success)', FundsReleased:'var(--success)', DiscountApplied:'var(--accent)' }[t] || 'var(--text-secondary)')

const initForm = { title:'', description:'', creatorAddress:'', totalBudget:'', deadline:'', milestones:[{title:'',amount:''}] }

export default function ClientDashboard() {
  const { escrows, events, loading, lockFunds, approveMilestone, releaseFunds } = useEscrow()

  const [view, setView] = useState('list')
  const [selectedEscrow, setSelectedEscrow] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({ ...initForm, milestones: [{ title:'', amount:'' }] })
  const [formErrors, setFormErrors] = useState({})
  const [actionLoading, setActionLoading] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)

  const setField = (k, v) => setFormData(p => ({ ...p, [k]: v }))
  const setMilestone = (i, k, v) => setFormData(p => ({ ...p, milestones: p.milestones.map((m, idx) => idx === i ? { ...m, [k]: v } : m) }))
  const addMilestone = () => setFormData(p => ({ ...p, milestones: [...p.milestones, { title:'', amount:'' }] }))
  const removeMilestone = i => setFormData(p => ({ ...p, milestones: p.milestones.filter((_, idx) => idx !== i) }))

  const msSum = formData.milestones.reduce((a, m) => a + (parseFloat(m.amount) || 0), 0).toFixed(3)
  const budgetOk = formData.totalBudget && parseFloat(msSum) === parseFloat(formData.totalBudget)

  const goCreate = () => { setFormData({ ...initForm, milestones: [{ title:'', amount:'' }] }); setFormErrors({}); setCurrentStep(1); setView('create') }
  const goList = () => { setView('list'); setShowSuccess(false) }

  const validateStep1 = () => {
    const { title, description, creatorAddress, totalBudget, deadline } = formData
    if (!title || !description || !creatorAddress || !totalBudget || !deadline || parseFloat(totalBudget) <= 0) {
      setFormErrors({ step1: 'Please fill all fields correctly' }); return false
    }
    setFormErrors({}); return true
  }

  const validateStep2 = () => {
    const allFilled = formData.milestones.every(m => m.title && parseFloat(m.amount) > 0)
    if (!allFilled || !budgetOk) { setFormErrors({ step2: 'All milestones must be filled and budget must balance' }); return false }
    setFormErrors({}); return true
  }

  const handleLock = async () => {
    const result = await lockFunds(formData)
    if (result) setShowSuccess(true)
  }

  const handleApprove = async (escrowId, milestoneId) => {
    setActionLoading(p => ({ ...p, [milestoneId]: true }))
    await approveMilestone(escrowId, milestoneId)
    setSelectedEscrow(p => p ? { ...p, milestones: p.milestones.map(m => m.id === milestoneId ? { ...m, status:'approved', approvedAt: new Date().toISOString().slice(0,10) } : m) } : p)
    setActionLoading(p => ({ ...p, [milestoneId]: false }))
  }

  const handleRelease = async (escrowId, milestoneId) => {
    setActionLoading(p => ({ ...p, [milestoneId]: true }))
    await releaseFunds(escrowId, milestoneId)
    setSelectedEscrow(p => p ? { ...p, milestones: p.milestones.map(m => m.id === milestoneId ? { ...m, status:'released' } : m) } : p)
    setActionLoading(p => ({ ...p, [milestoneId]: false }))
  }

  const inputStyle = { background:'rgba(255,255,255,0.05)', border:'1px solid var(--border-glass)', color:'var(--text-primary)', borderRadius:'8px', padding:'12px 16px', width:'100%', fontFamily:'inherit', fontSize:'0.95rem', outline:'none' }
  const labelStyle = { display:'block', color:'var(--text-secondary)', fontSize:'0.85rem', marginBottom:'6px', fontWeight:500 }

  // ── STEP INDICATOR ──────────────────────────────────────────
  const renderStepIndicator = () => (
    <div style={{ display:'flex', marginBottom:'40px', position:'relative' }}>
      {['Project Details','Milestones','Review & Lock'].map((label, i) => {
        const n = i + 1
        const done = currentStep > n
        const active = currentStep === n
        return (
          <div key={n} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', position:'relative' }}>
            {i < 2 && <div style={{ position:'absolute', top:'19px', left:'50%', right:'-50%', height:'2px', background: done ? 'var(--accent)' : 'var(--border-glass)', zIndex:0 }} />}
            <div style={{
              width:'40px',
              height:'40px',
              borderRadius:'50%',
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              fontWeight:700,
              fontSize:'0.9rem',
              zIndex:1,
              background: done ? 'var(--accent)' : active ? 'var(--accent-dim)' : 'rgba(255,255,255,0.03)',
              border: done ? 'none' : `2px solid ${active ? 'var(--accent)' : 'var(--border-glass)'}`,
              color: done ? '#0A0F1E' : active ? 'var(--accent)' : 'var(--text-muted)'
            }}>
              {done ? <CheckSVG color="#0A0F1E" /> : n}
            </div>
            <span style={{ fontSize:'0.75rem', marginTop:'6px', color: active ? 'var(--accent)' : 'var(--text-muted)', fontWeight: active ? 600 : 400 }}>{label}</span>
          </div>
        )
      })}
    </div>
  )

  // ── LIST VIEW ───────────────────────────────────────────────
  const renderListView = () => (
    <motion.div key="list" initial={{ opacity:0 }} animate={{ opacity:1 }}>
      <div style={{ ...S.between, marginBottom:'32px' }}>
        <div>
          <h1 style={{ fontWeight:800, fontSize:'1.8rem' }}>My Escrows</h1>
          <p style={{ ...S.secondary, fontSize:'0.9rem', marginTop:'4px' }}>{escrows.filter(e=>e.status==='active').length} active gigs</p>
        </div>
        <Button variant="primary" onClick={goCreate}>Lock New Funds</Button>
      </div>

      {MOCK_CREATOR_PROFILE.workTokenBalance >= 100 && (
        <div style={{ background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.25)', borderRadius:'var(--radius-card)', padding:'14px 20px', marginBottom:'28px', display:'flex', alignItems:'center', gap:'12px' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round"><polyline points="2,8 6,12 14,4"/></svg>
          <div>
            <div style={{ fontWeight:600, ...S.amber, fontSize:'0.9rem' }}>PlatformUtilityContract verified — 10% WORK discount active</div>
            <div style={{ ...S.secondary, fontSize:'0.8rem' }}>Inter-contract call executes on every milestone approval</div>
          </div>
        </div>
      )}

      <div style={{ display:'flex', flexWrap:'wrap', gap:'16px', marginBottom:'32px' }}>
        {[
          { label:'Total Locked',  val:'4200 XLM',  valColor:'var(--accent)' },
          { label:'Active Gigs',   val:escrows.filter(e=>e.status==='active').length,  valColor:'var(--text-primary)' },
          { label:'Completed',     val:escrows.filter(e=>e.status==='completed').length, valColor:'var(--text-primary)' },
          { label:'WORK Saved',    val:'420 XLM', valColor:'var(--success)' },
        ].map(({ label, val, valColor }) => (
          <GlassCard key={label} style={{ padding:'20px', minWidth:'180px', flex:1 }}>
            <div style={{ ...S.secondary, fontSize:'0.8rem', marginBottom:'6px' }}>{label}</div>
            <div style={{ fontWeight:700, fontSize:'1.5rem', color:valColor }}>{val}</div>
          </GlassCard>
        ))}
      </div>

      <AnimatePresence>
        {escrows.map((e, idx) => {
          const prog = getMilestoneProgress(e.milestones)
          return (
            <motion.div key={e.id} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay: idx * 0.05 }} style={{ marginBottom:'16px' }}>
              <GlassCard hover onClick={() => { setSelectedEscrow(e); setView('detail') }} style={{ padding:'20px', cursor:'pointer' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'16px', flexWrap:'wrap' }}>
                  <div style={{ flex:1, minWidth:'200px' }}>
                    <div style={{ fontFamily:'monospace', ...S.amber, fontSize:'0.8rem' }}>#{e.id}</div>
                    <div style={{ fontWeight:700, fontSize:'1rem', marginTop:'4px' }}>{e.title}</div>
                    <div style={{ ...S.secondary, fontSize:'0.82rem', marginTop:'2px' }}>{truncateAddress(e.creator)}</div>
                  </div>
                  <div style={{ flex:1.5, minWidth:'180px' }}>
                    <div style={{ ...S.secondary, fontSize:'0.82rem' }}>{prog.completed}/{prog.total} milestones</div>
                    <div style={{ height:'6px', background:'rgba(255,255,255,0.08)', borderRadius:'3px', marginTop:'8px' }}>
                      <div style={{ width:`${prog.percent}%`, height:'100%', background:'var(--accent)', borderRadius:'3px' }} />
                    </div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'8px' }}>
                    <span style={S.amberBold}>{formatETH(e.totalAmount)}</span>
                    <Badge status={e.status} />
                    <ChevronSVG />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </motion.div>
  )

  // ── CREATE VIEW ─────────────────────────────────────────────
  const renderCreateView = () => (
    <motion.div key="create" initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }}>
      <div style={{ display:'flex', alignItems:'center', marginBottom:'32px', gap:'16px' }}>
        <Button variant="ghost" size="sm" onClick={goList}>← Back</Button>
        <h2 style={{ fontWeight:700, fontSize:'1.6rem' }}>Lock Funds in Escrow</h2>
      </div>
      {renderStepIndicator()}

      {currentStep === 1 && (
        <GlassCard>
          {[
            { label:'Project Title', key:'title', type:'text', placeholder:'e.g. DeFi Dashboard Redesign' },
            { label:'Project Description', key:'description', type:'textarea', placeholder:'Describe the project scope...' },
            { label:'Creator Wallet Address', key:'creatorAddress', type:'text', placeholder:'GA...' },
            { label:'Total Budget (XLM)', key:'totalBudget', type:'number', placeholder:'0.00', extra:{ step:'0.01', min:'0' } },
            { label:'Deadline', key:'deadline', type:'date' },
          ].map(({ label, key, type, placeholder, extra={} }) => (
            <div key={key} style={{ marginBottom:'20px' }}>
              <label style={labelStyle}>{label}</label>
              {type === 'textarea'
                ? <textarea rows={3} placeholder={placeholder} value={formData[key]} onChange={e => setField(key, e.target.value)} style={{ ...inputStyle, resize:'vertical' }} />
                : <input type={type} placeholder={placeholder} value={formData[key]} onChange={e => setField(key, e.target.value)} style={inputStyle} {...extra} />
              }
            </div>
          ))}
          {formErrors.step1 && <div style={{ color:'var(--error)', fontSize:'0.85rem', marginBottom:'16px' }}>{formErrors.step1}</div>}
          <div style={{ display:'flex', justifyContent:'flex-end' }}>
            <Button variant="primary" onClick={() => validateStep1() && setCurrentStep(2)}>Next: Add Milestones →</Button>
          </div>
        </GlassCard>
      )}

      {currentStep === 2 && (
        <GlassCard>
          {formData.milestones.map((m, i) => (
            <div key={i} style={{ display:'flex', gap:'12px', alignItems:'flex-start', marginBottom:'16px' }}>
              <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'var(--accent)', color:'#0A0F1E', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'0.8rem', flexShrink:0 }}>M{i+1}</div>
              <input placeholder="Milestone title" value={m.title} onChange={e => setMilestone(i,'title',e.target.value)} style={{ ...inputStyle, flex:2 }} />
              <input type="number" placeholder="XLM" step="0.001" min="0" value={m.amount} onChange={e => setMilestone(i,'amount',e.target.value)} style={{ ...inputStyle, flex:1 }} />
              {formData.milestones.length > 1 && (
                <Button variant="ghost" size="sm" onClick={() => removeMilestone(i)}>×</Button>
              )}
            </div>
          ))}
          <Button variant="ghost" size="sm" onClick={addMilestone} disabled={formData.milestones.length >= 5} style={{ marginBottom:'20px' }}>+ Add Milestone</Button>
          <div style={{ fontSize:'0.85rem', marginBottom:'16px', color: budgetOk ? 'var(--success)' : (formData.totalBudget && parseFloat(msSum) > 0 ? 'var(--error)' : 'var(--text-muted)') }}>
            {budgetOk ? '✓ Budget balanced' : formData.totalBudget && parseFloat(msSum) > 0 ? `Milestone total (${msSum} XLM) must equal budget (${formData.totalBudget} XLM)` : `Milestone total: ${msSum} XLM`}
          </div>
          {formErrors.step2 && <div style={{ color:'var(--error)', fontSize:'0.85rem', marginBottom:'16px' }}>{formErrors.step2}</div>}
          <div style={{ ...S.between }}>
            <Button variant="ghost" onClick={() => setCurrentStep(1)}>← Back</Button>
            <Button variant="primary" onClick={() => validateStep2() && setCurrentStep(3)}>Next: Review →</Button>
          </div>
        </GlassCard>
      )}

      {currentStep === 3 && (
        <GlassCard>
          {[
            { label:'Project', val: formData.title },
            { label:'Creator', val: truncateAddress(formData.creatorAddress) },
            { label:'Deadline', val: formData.deadline },
          ].map(({ label, val }) => (
            <div key={label} style={{ ...S.between, marginBottom:'12px' }}>
              <span style={S.secondary}>{label}</span>
              <span style={{ fontWeight:600 }}>{val}</span>
            </div>
          ))}
          <div style={S.divider} />
          {formData.milestones.map((m, i) => (
            <div key={i} style={{ ...S.between, marginBottom:'10px' }}>
              <span style={S.secondary}>M{i+1} {m.title}</span>
              <span style={S.amberBold}>{m.amount} XLM</span>
            </div>
          ))}
          <div style={S.divider} />
          <div style={{ ...S.between, marginBottom:'20px' }}>
            <span style={{ fontWeight:700, fontSize:'1.1rem' }}>Total</span>
            <span style={{ ...S.amberBold, fontSize:'1.3rem' }}>{formData.totalBudget} XLM</span>
          </div>

          {MOCK_CREATOR_PROFILE.workTokenBalance >= 100 && (
            <div style={{ background:'var(--accent-dim)', padding:'12px 16px', borderRadius:'8px', marginBottom:'20px' }}>
              <span style={{ ...S.amber, fontSize:'0.88rem' }}>✓ 10% WORK discount will be applied via PlatformUtilityContract</span>
            </div>
          )}

          <div style={{ ...S.between, marginTop:'24px' }}>
            <Button variant="ghost" onClick={() => setCurrentStep(2)}>← Back</Button>
            <Button variant="primary" size="lg" loading={loading} onClick={handleLock}>Lock Funds</Button>
          </div>

          <AnimatePresence>
            {showSuccess && (
              <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} style={{ marginTop:'24px' }}>
                <GlassCard style={{ background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.25)' }}>
                  <div style={{ fontWeight:700, color:'var(--success)', fontSize:'1rem' }}>✓ Funds Locked Successfully</div>
                  <div style={{ fontFamily:'monospace', ...S.amber, fontSize:'0.85rem', marginTop:'8px' }}>TX Hash: TAXI733...B92C</div>
                  <div style={{ ...S.muted, fontSize:'0.82rem' }}>Network: Stellar Testnet</div>
                  <div style={{ marginTop:'16px' }}>
                    <Button variant="primary" onClick={() => { goList() }}>View My Escrows</Button>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      )}
    </motion.div>
  )

  // ── DETAIL VIEW ─────────────────────────────────────────────
  const renderDetailView = () => {
    if (!selectedEscrow) return null
    const e = selectedEscrow
    const escrowEvents = events.filter(ev => ev.escrowId === e.id).slice(0, 8)

    const milestoneIcon = status => {
      if (status === 'released') return <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:'var(--success)', display:'flex', alignItems:'center', justifyContent:'center' }}><CheckSVG color="white" size={18} /></div>
      if (status === 'approved') return <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:'var(--accent-dim)', border:'2px solid var(--accent)', display:'flex', alignItems:'center', justifyContent:'center' }}><div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'var(--accent)' }} /></div>
      if (status === 'submitted') return <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:'rgba(245,158,11,0.1)', border:'2px dashed var(--accent)', display:'flex', alignItems:'center', justifyContent:'center' }}><div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'var(--accent)' }} /></div>
      return <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:'rgba(255,255,255,0.05)', border:'2px solid var(--border-glass)' }} />
    }

    return (
      <motion.div key="detail" initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }}>
        <Button variant="ghost" size="sm" onClick={() => setView('list')}>← Back to Escrows</Button>

        <GlassCard style={{ marginTop:'24px' }}>
          <div style={S.between}>
            <div>
              <div style={{ fontFamily:'monospace', ...S.amber, fontSize:'0.85rem' }}>#{e.id}</div>
              <h2 style={{ fontWeight:700, fontSize:'1.4rem', marginTop:'4px' }}>{e.title}</h2>
            </div>
            <Badge status={e.status} />
          </div>
          <div style={S.divider} />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
            {[
              { label:'Creator',     val: truncateAddress(e.creator) },
              { label:'Total Value', val: formatETH(e.totalAmount), amber:true },
              { label:'Created',     val: formatDate(e.createdAt) },
              { label:'Discount',    val: `${e.workTokenDiscount}% via WORK token`, amber:true },
            ].map(({ label, val, amber }) => (
              <div key={label}>
                <div style={S.muted}>{label}</div>
                <div style={{ fontWeight:600, marginTop:'4px', color: amber ? 'var(--accent)' : 'var(--text-primary)' }}>{val}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        <h3 style={{ marginTop:'32px', marginBottom:'16px', fontWeight:600 }}>Milestones</h3>
        {e.milestones.map((m, idx) => (
          <div key={m.id} style={{ display:'flex', gap:'16px', marginBottom:'24px', position:'relative' }}>
            <div style={{ position:'relative', width:'40px', flexShrink:0 }}>
              {milestoneIcon(m.status)}
              {idx < e.milestones.length - 1 && (
                <div style={{ position:'absolute', top:'40px', left:'50%', transform:'translateX(-50%)', width:'2px', height:'calc(100% + 8px)', background: m.status === 'released' ? 'var(--success)' : 'var(--border-glass)' }} />
              )}
            </div>
            <div style={{ flex:1 }}>
              <GlassCard style={{ padding:'16px' }}>
                <div style={S.between}>
                  <span style={{ fontWeight:600 }}>{m.title}</span>
                  <span style={S.amberBold}>{formatETH(m.amount)}</span>
                </div>
                <div style={{ ...S.between, marginTop:'8px' }}>
                  <Badge status={m.status} />
                  {m.submittedAt && <span style={{ ...S.muted }}>Submitted: {formatDate(m.submittedAt)}</span>}
                </div>

                {m.status === 'approved' && (
                  <div style={{ background:'var(--accent-dim)', border:'1px solid var(--accent)', borderRadius:'8px', padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'12px' }}>
                    <div>
                      <div style={{ ...S.amber, fontWeight:600 }}>Ready to Claim</div>
                      <div style={{ ...S.amberBold, fontSize:'1.1rem' }}>{m.amount} XLM</div>
                    </div>
                    <Button variant="primary" size="sm" loading={actionLoading[m.id]} onClick={() => handleRelease(e.id, m.id)}>Release Funds</Button>
                  </div>
                )}

                {m.status === 'submitted' && (
                  <div style={{ display:'flex', gap:'8px', marginTop:'12px' }}>
                    <Button variant="primary" size="sm" loading={actionLoading[m.id]} onClick={() => handleApprove(e.id, m.id)}>Approve Work ✓</Button>
                  </div>
                )}

                {m.status === 'released' && (
                  <div style={{ color:'var(--success)', fontWeight:600, fontSize:'0.9rem', marginTop:'12px' }}>✓ Funds Released</div>
                )}
              </GlassCard>
            </div>
          </div>
        ))}

        <GlassCard style={{ marginTop:'32px' }}>
          <h3 style={{ fontWeight:600, marginBottom:'16px' }}>Contract Events</h3>
          {escrowEvents.length === 0 && <div style={S.secondary}>No events yet.</div>}
          {escrowEvents.map((ev, i) => {
            const col = eventColor(ev.type)
            return (
              <div key={ev.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom: i < escrowEvents.length - 1 ? '1px solid var(--border-glass)' : 'none' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  <span style={{ fontSize:'0.75rem', padding:'2px 8px', borderRadius:'4px', background:`${col}26`, color:col, fontWeight:600 }}>{ev.type}</span>
                  <span style={{ ...S.secondary, fontSize:'0.82rem' }}>
                    {ev.milestone ? `Milestone ${ev.milestone}` : ev.amount ? `${ev.amount} XLM` : ''}
                  </span>
                </div>
                <span style={S.muted}>{formatTimeAgo(ev.timestamp)}</span>
              </div>
            )
          })}
        </GlassCard>
      </motion.div>
    )
  }

  return (
    <div style={{ paddingTop:'80px', minHeight:'100vh', padding:'80px 24px 48px', maxWidth:'1100px', margin:'0 auto' }}>
      <AnimatePresence mode="wait">
        {view === 'list'   && renderListView()}
        {view === 'create' && renderCreateView()}
        {view === 'detail' && renderDetailView()}
      </AnimatePresence>
    </div>
  )
}
