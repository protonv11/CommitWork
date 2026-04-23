import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from './Button'
import { useWallet } from '../../context/WalletContext'
import { truncateAddress } from '../../utils/helpers'

export default function WalletButton() {
  const { address, isConnected, balance, connecting,
    connectWallet, disconnectWallet } = useWallet()
  const [open, setOpen] = useState(false)

  if (!isConnected) {
    return (
      <Button variant="ghost" size="sm"
        loading={connecting} onClick={connectWallet}>
        Connect Wallet
      </Button>
    )
  }

  return (
    <div style={{ position:'relative' }}>
      <motion.div
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale:1.02 }}
        style={{
          display:'inline-flex', alignItems:'center', gap:8,
          background:'rgba(255,255,255,0.06)',
          border:'1px solid var(--border-glass)',
          borderRadius:'var(--radius-pill)',
          padding:'8px 16px', cursor:'pointer', fontSize:'0.85rem'
        }}>
        <span style={{
          width:8, height:8, borderRadius:'50%',
          background:'var(--success)', flexShrink:0
        }} />
        <span style={{ color:'var(--text-primary)', fontWeight:600 }}>
          {truncateAddress(address)}
        </span>
        <span style={{ color:'var(--text-secondary)' }}>{balance} XLM</span>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0, y:-8, scale:0.96 }}
            animate={{ opacity:1, y:0,  scale:1 }}
            exit={{    opacity:0, y:-8, scale:0.96 }}
            transition={{ duration:0.15 }}
            style={{
              position:'absolute', top:'calc(100% + 8px)', right:0,
              background:'rgba(16,24,40,0.98)',
              backdropFilter:'var(--blur)',
              WebkitBackdropFilter:'var(--blur)',
              border:'1px solid var(--border-glass)',
              borderRadius:12, overflow:'hidden',
              minWidth:180, zIndex:300,
              boxShadow:'var(--shadow-glass)'
            }}>
            {[
              { label:'Copy Address', action: () => { navigator.clipboard.writeText(address); setOpen(false) } },
              { label:'Disconnect',   action: () => { disconnectWallet(); setOpen(false) }, danger:true }
            ].map(item => (
              <button key={item.label}
                onClick={item.action}
                style={{
                  display:'block', width:'100%', textAlign:'left',
                  background:'none', border:'none',
                  color: item.danger ? 'var(--error)' : 'var(--text-primary)',
                  padding:'12px 18px', cursor:'pointer',
                  fontSize:'0.88rem', fontWeight:500,
                  borderBottom: item.danger ? 'none' : '1px solid var(--border-glass)',
                  transition:'background 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background='none'}>
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {open && (
        <div onClick={() => setOpen(false)}
          style={{ position:'fixed', inset:0, zIndex:299 }} />
      )}
    </div>
  )
}
