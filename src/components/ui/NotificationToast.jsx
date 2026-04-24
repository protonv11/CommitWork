import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useEscrow } from '../../context/EscrowContext'
import { formatTimeAgo } from '../../utils/helpers'
import Button from './Button'

const typeColor = t => ({
  'ready-to-claim': '#10B981',
  'milestone-submitted': '#F59E0B',
  'funds-locked': '#3B82F6',
  'funds-released': '#10B981',
}[t] || 'var(--text-secondary)')

const TypeIcon = ({ type }) => {
  const col = typeColor(type)
  const props = { width:18, height:18, viewBox:'0 0 18 18', fill:'none', stroke:col, strokeWidth:'2', strokeLinecap:'round', strokeLinejoin:'round' }
  if (type === 'ready-to-claim') return <svg {...props}><circle cx="9" cy="9" r="7"/><path d="M9 5v4l2.5 2.5"/></svg>
  if (type === 'milestone-submitted') return <svg {...props}><path d="M9 14V4m-4 4 4-4 4 4"/></svg>
  if (type === 'funds-locked') return <svg {...props}><rect x="3" y="8" width="12" height="9" rx="2"/><path d="M6 8V6a3 3 0 0 1 6 0v2"/></svg>
  if (type === 'funds-released') return <svg {...props}><circle cx="9" cy="9" r="7"/><polyline points="6,9 8,11 12,7"/></svg>
  return <svg {...props}><path d="M9 2a5 5 0 0 1 5 5v2l1.5 2H2.5L4 9V7a5 5 0 0 1 5-5z"/><path d="M7 14a2 2 0 0 0 4 0"/></svg>
}

export default function NotificationToast() {
  const { notifications, dismissNotif } = useEscrow()
  const navigate = useNavigate()
  const timerRefs = useRef({})

  const unread = notifications.filter(n => !n.read).slice(0, 3)

  useEffect(() => {
    unread.forEach(n => {
      if (!timerRefs.current[n.id]) {
        timerRefs.current[n.id] = setTimeout(() => {
          dismissNotif(n.id)
          delete timerRefs.current[n.id]
        }, 5000)
      }
    })
    const timers = timerRefs.current
    return () => {
      Object.values(timers).forEach(t => clearTimeout(t))
    }
  }, [notifications, dismissNotif, unread])

  return (
    <div style={{ position:'fixed', top:'80px', right:'24px', zIndex:999, display:'flex', flexDirection:'column', gap:'12px', pointerEvents:'none' }}>
      <AnimatePresence mode="popLayout">
        {unread.map(n => (
          <motion.div
            key={n.id}
            initial={{ opacity:0, x:80, scale:0.92 }}
            animate={{ opacity:1, x:0,  scale:1 }}
            exit={{    opacity:0, x:80, scale:0.92 }}
            transition={{ type:'spring', stiffness:280, damping:24 }}
            style={{
              pointerEvents:'auto',
              width:'320px',
              background:'rgba(26,32,53,0.95)',
              backdropFilter:'var(--blur)',
              WebkitBackdropFilter:'var(--blur)',
              border:'1px solid var(--border-glass)',
              borderLeft:`4px solid ${typeColor(n.type)}`,
              borderRadius:'var(--radius-card)',
              padding:'16px',
              boxShadow:'var(--shadow-glass)',
            }}
          >
            <div style={{ display:'flex', justifyContent:'space-between', gap:'8px', alignItems:'flex-start' }}>
              <div style={{ display:'flex', gap:'10px', alignItems:'flex-start', flex:1 }}>
                <TypeIcon type={n.type} />
                <div>
                  <div style={{ fontWeight:600, fontSize:'0.9rem', lineHeight:1.4, color:'var(--text-primary)' }}>{n.message}</div>
                  <div style={{ color:'var(--text-secondary)', fontSize:'0.78rem', marginTop:'3px' }}>{formatTimeAgo(n.timestamp)}</div>
                </div>
              </div>
              <button
                onClick={() => dismissNotif(n.id)}
                style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', fontSize:'1.1rem', lineHeight:1, padding:'2px 4px', flexShrink:0 }}
              >×</button>
            </div>
            {n.type === 'ready-to-claim' && (
              <div style={{ marginTop:'10px', paddingTop:'10px', borderTop:'1px solid var(--border-glass)' }}>
                <Button variant="primary" size="sm" onClick={() => { dismissNotif(n.id); navigate('/creator') }}>
                  Claim Now →
                </Button>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
