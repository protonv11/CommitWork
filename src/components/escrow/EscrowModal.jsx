import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlassCard from '../ui/GlassCard'
import Button    from '../ui/Button'
import Badge     from '../ui/Badge'
import { truncateAddress, formatETH, formatDate } from '../../utils/helpers'

const S = {
  between: { display:'flex', justifyContent:'space-between', alignItems:'center' },
  secondary: { color:'var(--text-secondary)' },
  muted: { color:'var(--text-muted)', fontSize:'0.8rem' },
  amber: { color:'var(--accent)' },
  amberBold: { color:'var(--accent)', fontWeight:700 },
  divider: { borderTop:'1px solid var(--border-glass)', margin:'16px 0' },
}

const ClipboardIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="5" y="1" width="8" height="10" rx="1.5"/>
    <path d="M3 4H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1"/>
  </svg>
)
const ChevronIcon = ({ open }) => (
  <motion.svg animate={{ rotate: open ? 180 : 0 }} width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="4,6 8,10 12,6"/>
  </motion.svg>
)

const STEPS = ['Funded','Submitted','Under Review','Approved','Released']

function getStepIndex(milestones) {
  if (milestones.every(m => m.status === 'released')) return 4
  if (milestones.some(m => m.status === 'approved'))  return 3
  if (milestones.some(m => m.status === 'submitted')) return 1
  return 0
}

export default function EscrowModal({ escrow, onClose }) {
  const [showContractDetails, setShowContractDetails] = useState(false)
  const [copied, setCopied] = useState(null)

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const copy = (text, field) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 1500)
  }

  const stepIndex = getStepIndex(escrow.milestones)

  const contractRows = [
    { label:'Contract',  value:'CAQHZV...FQZ', field:'contract' },
    { label:'TX Hash: TAXI733...B92C', field:'txhash' },
    { label:'Network',   value:'Stellar Testnet', field:null },
    { label:'Discount',  value:`${escrow.workTokenDiscount}% via PlatformUtilityContract`, field:'discount', amber:true },
  ]

  return (
    <AnimatePresence>
      <div
        style={{ position:'fixed', inset:0, zIndex:500, background:'rgba(0,0,0,0.65)', backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}
        onClick={e => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div
          initial={{ opacity:0, scale:0.94, y:20 }}
          animate={{ opacity:1, scale:1,    y:0 }}
          exit={{    opacity:0, scale:0.94, y:20 }}
          transition={{ type:'spring', stiffness:300, damping:26 }}
          onClick={e => e.stopPropagation()}
          style={{ background:'rgba(16,24,40,0.97)', backdropFilter:'var(--blur)', WebkitBackdropFilter:'var(--blur)', border:'1px solid var(--border-glass)', borderRadius:'var(--radius-card)', boxShadow:'var(--shadow-glass)', width:'100%', maxWidth:'640px', maxHeight:'88vh', overflowY:'auto', position:'relative' }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{ position:'absolute', top:'16px', right:'16px', background:'none', border:'none', color:'var(--text-secondary)', cursor:'pointer', fontSize:'1.4rem', lineHeight:1, width:'32px', height:'32px', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'50%' }}
          >×</button>

          <div style={{ padding:'28px' }}>
            {/* HEADER */}
            <div style={{ ...S.between, alignItems:'flex-start', marginBottom:'24px' }}>
              <div>
                <div style={{ fontFamily:'monospace', ...S.amber, fontSize:'0.82rem' }}>#{escrow.id}</div>
                <h2 style={{ fontWeight:800, fontSize:'1.3rem', marginTop:'6px' }}>{escrow.title}</h2>
              </div>
              <Badge status={escrow.status} />
            </div>

            {/* LIFECYCLE STEPPER */}
            <div style={{ display:'flex', marginBottom:'28px', position:'relative' }}>
              {STEPS.map((step, i) => {
                const done = i <= stepIndex
                return (
                  <div key={step} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', position:'relative' }}>
                    {i < STEPS.length - 1 && (
                      <div style={{ position:'absolute', top:'15px', left:'50%', right:'-50%', height:'2px', background: i < stepIndex ? 'var(--accent)' : 'var(--border-glass)', zIndex:0 }} />
                    )}
                    <div style={{ width:'32px', height:'32px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'0.78rem', zIndex:1, background: done ? 'var(--accent)' : 'rgba(255,255,255,0.06)', border: done ? 'none' : '1px solid var(--border-glass)', color: done ? '#0A0F1E' : 'var(--text-muted)' }}>
                      {done ? '✓' : i + 1}
                    </div>
                    <div style={{ fontSize:'0.72rem', marginTop:'8px', textAlign:'center', color: done ? 'var(--text-primary)' : 'var(--text-muted)' }}>{step}</div>
                  </div>
                )
              })}
            </div>

            {/* MILESTONE BREAKDOWN */}
            <h3 style={{ fontWeight:600, marginBottom:'16px' }}>Milestones</h3>
            {escrow.milestones.map((m, i) => (
              <div key={m.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 16px', background:'rgba(255,255,255,0.03)', borderRadius:'8px', marginBottom:'8px', flexWrap:'wrap', gap:'8px' }}>
                <span style={{ fontWeight:500 }}>{m.title}</span>
                <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
                  {m.status === 'approved' && (
                    <motion.span
                      animate={{ boxShadow: ['0 0 0 0 rgba(245,158,11,0.4)','0 0 0 6px rgba(245,158,11,0)','0 0 0 0 rgba(245,158,11,0)'] }}
                      transition={{ duration:2, repeat:Infinity }}
                      style={{ color:'var(--accent)', fontSize:'0.78rem', padding:'2px 8px', borderRadius:'var(--radius-pill)', border:'1px solid var(--accent)' }}
                    >Ready</motion.span>
                  )}
                  <span style={S.amberBold}>{formatETH(m.amount)}</span>
                  <Badge status={m.status} />
                </div>
              </div>
            ))}

            {/* CONTRACT DETAILS — COLLAPSIBLE */}
            <button
              onClick={() => setShowContractDetails(p => !p)}
              style={{ display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%', background:'none', border:'none', color:'var(--text-primary)', cursor:'pointer', padding:'12px 0', borderTop:'1px solid var(--border-glass)', fontWeight:600, marginTop:'24px' }}
            >
              Contract Details
              <ChevronIcon open={showContractDetails} />
            </button>
            <AnimatePresence>
              {showContractDetails && (
                <motion.div initial={{ height:0 }} animate={{ height:'auto' }} exit={{ height:0 }} style={{ overflow:'hidden' }}>
                  {contractRows.map(({ label, value, field, amber }) => (
                    <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ ...S.muted }}>{label}</span>
                      <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                        <span style={{ color: amber ? 'var(--accent)' : 'var(--text-primary)', fontFamily: field === 'contract' || field === 'txhash' ? 'monospace' : 'inherit', fontSize: field === 'contract' || field === 'txhash' ? '0.85rem' : '0.9rem' }}>
                          {value}
                        </span>
                        {field && field !== 'discount' && (
                          <button
                            onClick={() => copy(value, field)}
                            style={{ background:'none', border:'none', cursor:'pointer', color: copied === field ? 'var(--success)' : 'var(--text-muted)', display:'flex', alignItems:'center', padding:'2px' }}
                          >
                            {copied === field ? '✓' : <ClipboardIcon />}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ACTION BUTTONS */}
            <div style={{ display:'flex', gap:'12px', justifyContent:'flex-end', marginTop:'24px', paddingTop:'20px', borderTop:'1px solid var(--border-glass)', flexWrap:'wrap' }}>
              <Button variant="danger" size="sm">Raise Dispute</Button>
              <Button variant="ghost" size="sm">Download Agreement</Button>
              {escrow.milestones.some(m => m.status === 'submitted') && (
                <Button variant="primary">Approve Work ✓</Button>
              )}
              {escrow.milestones.some(m => m.status === 'approved') && (
                <Button variant="primary">Release Funds</Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
