import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlassCard  from '../components/ui/GlassCard'
import Button     from '../components/ui/Button'
import { MOCK_TOKEN_DATA, MOCK_TRANSACTIONS, MOCK_CREATOR_PROFILE } from '../utils/constants'
import { getCurrentTier } from '../utils/helpers'

const S = {
  between: { display:'flex', justifyContent:'space-between', alignItems:'center' },
  secondary: { color:'var(--text-secondary)' },
  muted: { color:'var(--text-muted)', fontSize:'0.8rem' },
  amber: { color:'var(--accent)' },
  amberBold: { color:'var(--accent)', fontWeight:700 },
  divider: { borderTop:'1px solid var(--border-glass)', margin:'16px 0' },
}

const tierFeatures = {
  Bronze:['Fee discount on all escrows','Priority support'],
  Silver:['All Bronze features','Featured in creator search','Early access to new gigs'],
  Gold:['All Silver features','Dedicated account manager','Zero listing fees','Featured profile badge'],
}

const INIT_SLOTS = [
  { id:1, name:'Alex Rivera',   address:'GBXLK7...ZPJQ', active:true,  daysLeft:3 },
  { id:2, name:'GCORK7...ZPJQ', address:'GCORK7...ZPJQ', active:true,  daysLeft:5 },
  { id:3, name:null,             address:null,             active:false, daysLeft:0 },
]

export default function TokenPage() {
  const [stakeInput,   setStakeInput]   = useState('')
  const [stakedAmt,    setStakedAmt]    = useState(MOCK_CREATOR_PROFILE.stakedTokens)
  const [balance,      setBalance]      = useState(MOCK_CREATOR_PROFILE.workTokenBalance)
  const [stakeLoading, setStakeLoading] = useState(false)
  const [unstakeOpen,  setUnstakeOpen]  = useState(false)
  const [unstakeInput, setUnstakeInput] = useState('')
  const [burnLoading,  setBurnLoading]  = useState(false)
  const [stakeSuccess, setStakeSuccess] = useState('')
  const [featureSlots, setFeatureSlots] = useState(INIT_SLOTS)

  const tier = getCurrentTier(stakedAmt, MOCK_TOKEN_DATA.tiers)
  const inputStyle = { background:'rgba(255,255,255,0.05)', border:'1px solid var(--border-glass)', color:'var(--text-primary)', borderRadius:'8px', padding:'12px 16px', width:'100%', fontFamily:'inherit', fontSize:'0.95rem', outline:'none', boxSizing:'border-box' }

  const handleStake = async () => {
    if (!stakeInput || Number(stakeInput) <= 0 || Number(stakeInput) > balance) return
    setStakeLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setStakedAmt(p => p + Number(stakeInput))
    setBalance(p => p - Number(stakeInput))
    setStakeSuccess('✓ ' + stakeInput + ' WORK staked successfully!')
    setStakeInput('')
    setStakeLoading(false)
    setTimeout(() => setStakeSuccess(''), 3000)
  }

  const handleUnstake = () => {
    if (!unstakeInput || Number(unstakeInput) > stakedAmt) return
    setStakedAmt(p => p - Number(unstakeInput))
    setBalance(p => p + Number(unstakeInput))
    setUnstakeInput('')
    setUnstakeOpen(false)
  }

  const handleBurn = async () => {
    if (balance < 50) return
    setBurnLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setBalance(p => p - 50)
    setFeatureSlots(p => p.map(s => s.id === 3 ? { ...s, name:'Alex Rivera', active:true, daysLeft:7 } : s))
    setBurnLoading(false)
  }

  const progress = Math.min(stakedAmt / 500, 1)

  return (
    <div style={{ paddingTop:'80px', minHeight:'100vh', padding:'80px 24px 48px', maxWidth:'1100px', margin:'0 auto' }}>

      {/* ── SECTION 1: TOKEN HERO ── */}
      <GlassCard style={{ padding:'32px', marginBottom:'40px' }}>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'32px', alignItems:'center' }}>
          <div style={{ flex:1, minWidth:'260px' }}>
            <div style={{ display:'flex', gap:'16px', alignItems:'center' }}>
              <span style={{ fontSize:'3rem', fontWeight:900, color:'var(--accent)', lineHeight:1 }}>WORK</span>
              <div>
                <div style={{ fontWeight:600, fontSize:'1.1rem' }}>CommitWork Token</div>
                <div style={{ ...S.secondary, fontSize:'0.85rem', marginTop:'4px' }}>SEP-0041 · Stellar Testnet</div>
              </div>
            </div>
            <div style={{ display:'flex', gap:'12px', marginTop:'20px', flexWrap:'wrap' }}>
              {['Price: $0.042','Supply: 10M','Holders: 2,847'].map(t => (
                <span key={t} style={{ background:'rgba(255,255,255,0.06)', border:'1px solid var(--border-glass)', borderRadius:'var(--radius-pill)', padding:'8px 18px', fontSize:'0.85rem' }}>{t}</span>
              ))}
            </div>
          </div>
          <GlassCard style={{ borderLeft:'3px solid var(--accent)', padding:'20px', minWidth:'240px' }}>
            <div style={{ ...S.secondary, fontSize:'0.8rem' }}>Your Balance</div>
            <div style={{ fontSize:'2rem', fontWeight:800, color:'var(--accent)' }}>{balance} WORK</div>
            <div style={{ color:'var(--text-muted)', fontSize:'0.9rem', marginTop:'4px' }}>${(balance * 0.042).toFixed(2)} USD</div>
            <div style={S.divider} />
            <div style={{ ...S.secondary, fontSize:'0.85rem' }}>{stakedAmt} WORK Staked</div>
            {tier
              ? <span style={{ background:`${tier.color}26`, color:tier.color, padding:'6px 14px', borderRadius:'var(--radius-pill)', fontWeight:700, fontSize:'0.82rem', marginTop:'8px', display:'inline-block' }}>{tier.name} Tier — {tier.discount}% Discount</span>
              : <span style={{ ...S.muted, marginTop:'8px', display:'block' }}>No tier yet — stake 100 WORK</span>
            }
          </GlassCard>
        </div>
      </GlassCard>

      {/* ── SECTION 2: TIERS ── */}
      <div style={{ marginBottom:'40px' }}>
        <div style={{ fontSize:'1.6rem', fontWeight:700, marginBottom:'8px' }}>Stake WORK, Save on Fees</div>
        <div style={{ ...S.secondary, marginBottom:'32px' }}>Automatic discounts applied on every escrow milestone approval</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'20px' }}>
          {MOCK_TOKEN_DATA.tiers.map(t => (
            <div key={t.name} style={{ flex:1, minWidth:'240px' }}>
              <GlassCard hover style={{ position:'relative', overflow:'hidden', borderTop:`3px solid ${t.color}`, padding:'24px' }}>
                {tier?.name === t.name && (
                  <span style={{ position:'absolute', top:'12px', right:'12px', background:`${t.color}33`, color:t.color, fontSize:'0.7rem', fontWeight:700, padding:'3px 10px', borderRadius:'var(--radius-pill)' }}>Current Tier</span>
                )}
                <div style={{ color:t.color, fontWeight:800, fontSize:'1.2rem' }}>{t.name}</div>
                <div style={{ fontSize:'3rem', fontWeight:900, lineHeight:1, marginTop:'4px' }}>{t.discount}%</div>
                <div style={{ ...S.secondary, fontSize:'0.85rem', marginBottom:'16px' }}>protocol discount</div>
                <div style={{ ...S.muted, marginBottom:'20px' }}>Minimum: {t.minStake} WORK staked</div>
                <div style={S.divider} />
                <div style={{ marginTop:'16px' }}>
                  {(tierFeatures[t.name] || []).map(f => (
                    <div key={f} style={{ display:'flex', gap:'8px', alignItems:'center', marginBottom:'8px', fontSize:'0.85rem' }}>
                      <span style={{ color:t.color, fontWeight:700 }}>✓</span>
                      <span style={S.secondary}>{f}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:'20px' }}>
                  {stakedAmt >= t.minStake
                    ? <Button variant="ghost" disabled>✓ Your Tier</Button>
                    : <Button variant="primary" onClick={() => {
                        setStakeInput(String(t.minStake - stakedAmt));
                        document.getElementById('staking-form')?.scrollIntoView({ behavior: 'smooth' });
                      }}>Stake to Unlock</Button>
                  }
                </div>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 3: STAKING PANEL ── */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'32px', marginBottom:'40px' }}>
        {/* Left: stake/unstake */}
        <div style={{ flex:1, minWidth:'280px' }} id="staking-form">
          <GlassCard style={{ padding:'24px' }}>
            <div style={{ fontWeight:700, fontSize:'1.1rem', marginBottom:'20px' }}>Stake WORK Tokens</div>
            <div style={S.between}>
              <span style={{ fontWeight:600 }}>{stakedAmt} WORK staked</span>
              {tier ? <span style={{ background:`${tier.color}26`, color:tier.color, padding:'3px 10px', borderRadius:'var(--radius-pill)', fontSize:'0.78rem', fontWeight:700 }}>{tier.name}</span> : <span style={S.muted}>No tier</span>}
            </div>
            {/* Progress bar */}
            <div style={{ marginTop:'12px' }}>
              <div style={{ position:'relative', height:'8px', background:'rgba(255,255,255,0.08)', borderRadius:'4px' }}>
                <div style={{ width:`${progress*100}%`, height:'100%', borderRadius:'4px', background:'linear-gradient(90deg,#CD7F32,#C0C0C0,#F59E0B)', transition:'width 0.5s' }} />
                {[100,250,500].map(v => (
                  <div key={v} style={{ position:'absolute', top:'-4px', left:`${(v/500)*100}%`, width:'4px', height:'16px', background:'var(--bg-primary)', transform:'translateX(-50%)' }} />
                ))}
              </div>
              <div style={{ ...S.muted, marginTop:'6px' }}>
                {500 - stakedAmt > 0 ? `${500 - stakedAmt} WORK to Gold` : '🥇 Gold achieved!'}
              </div>
            </div>

            {/* Stake input */}
            <div style={{ marginTop:'20px' }}>
              <div style={{ ...S.muted, marginBottom:'8px' }}>Amount to Stake</div>
              <div style={{ position:'relative' }}>
                <input type="number" placeholder="0" value={stakeInput} onChange={e => setStakeInput(e.target.value)} style={{ ...inputStyle, paddingRight:'52px' }} />
                <span style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', ...S.muted }}>WORK</span>
              </div>
              <div style={{ display:'flex', gap:'8px', marginTop:'8px', flexWrap:'wrap' }}>
                {['50','100','250'].map(v => (
                  <Button key={v} variant="ghost" size="sm" onClick={() => setStakeInput(v)}>{v}</Button>
                ))}
                <Button variant="ghost" size="sm" onClick={() => setStakeInput(String(balance))}>MAX</Button>
              </div>
              {stakeInput && Number(stakeInput) > balance && (
                <div style={{ color:'var(--error)', fontSize:'0.82rem', marginTop:'6px' }}>Insufficient balance</div>
              )}
              <div style={{ marginTop:'16px' }}>
                <Button variant="primary" loading={stakeLoading} disabled={!stakeInput || Number(stakeInput) <= 0 || Number(stakeInput) > balance} onClick={handleStake} style={{ width:'100%' }}>
                  Stake Tokens
                </Button>
              </div>
              <AnimatePresence>
                {stakeSuccess && (
                  <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} style={{ color:'var(--success)', fontSize:'0.88rem', marginTop:'12px', fontWeight:600 }}>
                    {stakeSuccess}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Unstake toggle */}
            <div style={{ marginTop:'20px', paddingTop:'20px', borderTop:'1px solid var(--border-glass)' }}>
              <button onClick={() => setUnstakeOpen(p => !p)} style={{ ...S.between, width:'100%', background:'none', border:'none', color:'var(--text-primary)', cursor:'pointer', padding:'0', fontWeight:600 }}>
                Unstake Tokens
                <motion.span animate={{ rotate: unstakeOpen ? 180 : 0 }} style={{ display:'inline-block' }}>▾</motion.span>
              </button>
              <AnimatePresence>
                {unstakeOpen && (
                  <motion.div initial={{ height:0 }} animate={{ height:'auto' }} exit={{ height:0 }} style={{ overflow:'hidden' }}>
                    <div style={{ paddingTop:'16px' }}>
                      <div style={{ position:'relative' }}>
                        <input type="number" placeholder="0" value={unstakeInput} onChange={e => setUnstakeInput(e.target.value)} style={{ ...inputStyle, paddingRight:'52px' }} />
                        <span style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', ...S.muted }}>WORK</span>
                      </div>
                      <div style={{ color:'var(--accent)', fontSize:'0.82rem', marginTop:'8px' }}>⚠ Unstaking may change your discount tier</div>
                      <div style={{ marginTop:'12px' }}>
                        <Button variant="ghost" onClick={handleUnstake} style={{ width:'100%' }}>Unstake</Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
        </div>

        {/* Right: how it works */}
        <div style={{ flex:1, minWidth:'280px' }}>
          <GlassCard style={{ padding:'24px' }}>
            <div style={{ fontWeight:700, fontSize:'1.1rem', marginBottom:'20px' }}>How Token Utility Works</div>
            {[
              { n:1, title:'Hold WORK Tokens', desc:'Acquire at least 100 WORK tokens to activate discount eligibility' },
              { n:2, title:'Escrow Creates Gig', desc:'EscrowContract.approveMilestone() is called when client approves work' },
              { n:3, title:'Inter-Contract Verification', desc:'EscrowContract calls PlatformUtilityContract.checkDiscount(address)' },
              { n:4, title:'Automatic Discount', desc:'Discount applied to protocol fee — no manual action required' },
            ].map(({ n, title, desc }) => (
              <div key={n} style={{ display:'flex', gap:'14px', marginBottom:'20px', alignItems:'flex-start' }}>
                <div style={{ width:'28px', height:'28px', borderRadius:'50%', border:'1.5px solid var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--accent)', fontWeight:700, fontSize:'0.85rem', flexShrink:0 }}>{n}</div>
                <div>
                  <div style={{ fontWeight:600, marginBottom:'4px' }}>{title}</div>
                  <div style={{ ...S.secondary, fontSize:'0.85rem', lineHeight:1.5 }}>{desc}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop:'24px', paddingTop:'20px', borderTop:'1px solid var(--border-glass)' }}>
              <div style={{ ...S.muted, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'12px' }}>Contract Call Flow</div>
              <div style={{ display:'flex', gap:'4px', alignItems:'center', flexWrap:'wrap' }}>
                {['EscrowContract','→','PlatformUtility','→','WORK Balance'].map((item, i) => (
                  item === '→'
                    ? <span key={i} style={{ color:'var(--accent)', fontWeight:700, fontSize:'1rem' }}>→</span>
                    : <div key={i} style={{ border:'1px solid var(--border-glass)', borderRadius:'8px', padding:'8px 14px', fontSize:'0.78rem', fontWeight:600, background:'rgba(255,255,255,0.03)', textAlign:'center' }}>{item}</div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* ── SECTION 4: FEATURED SPOTS ── */}
      <div style={{ marginBottom:'40px' }}>
        <div style={{ fontWeight:700, fontSize:'1.4rem', marginBottom:'8px' }}>Get Featured — Burn WORK</div>
        <div style={{ ...S.secondary, marginBottom:'28px' }}>Burn 50 WORK to appear at the top of creator search for 7 days</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'16px', marginBottom:'28px' }}>
          {featureSlots.map(slot => (
            slot.active
              ? <GlassCard key={slot.id} style={{ flex:1, minWidth:'200px', padding:'18px', borderTop:'2px solid var(--success)', position:'relative' }}>
                  <span style={{ background:'rgba(16,185,129,0.2)', color:'var(--success)', fontSize:'0.72rem', fontWeight:700, padding:'3px 10px', borderRadius:'var(--radius-pill)' }}>Featured</span>
                  <div style={{ fontWeight:600, marginTop:'8px' }}>{slot.name}</div>
                  <div style={{ color:'var(--success)', fontSize:'0.85rem' }}>{slot.daysLeft} days remaining</div>
                  <div style={{ fontSize:'0.8rem', marginTop:'4px' }}><span style={{ color:'var(--success)' }}>●</span> Active</div>
                </GlassCard>
              : <div key={slot.id} style={{ flex:1, minWidth:'200px', padding:'18px', border:'2px dashed var(--border-glass)', borderRadius:'var(--radius-card)', background:'rgba(255,255,255,0.02)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'8px', minHeight:'100px' }}>
                  <span style={{ fontSize:'2rem', ...S.muted }}>+</span>
                  <span style={S.muted}>Available</span>
                </div>
          ))}
        </div>
        <Button variant="primary" disabled={balance < 50} loading={burnLoading} onClick={handleBurn}>
          Feature My Profile — Burn 50 WORK
        </Button>
        {balance < 50 && <div style={{ color:'var(--error)', fontSize:'0.85rem', marginTop:'8px' }}>Insufficient WORK balance</div>}
      </div>

      {/* ── SECTION 5: TRANSACTIONS ── */}
      <div>
        <div style={{ fontWeight:600, fontSize:'1.05rem', marginBottom:'16px' }}>Token Transactions</div>
        <GlassCard style={{ padding:0, overflow:'hidden' }}>
          <div style={{ display:'flex', padding:'12px 20px', background:'rgba(255,255,255,0.04)', gap:'16px' }}>
            {[['Type',1.5],['Amount',1],['Date',1.5],['TX Hash',2]].map(([h,f]) => (
              <div key={h} style={{ flex:f, fontSize:'0.75rem', fontWeight:600, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.06em' }}>{h}</div>
            ))}
          </div>
          {MOCK_TRANSACTIONS.map((tx, i) => (
            <div key={i} style={{ display:'flex', padding:'14px 20px', gap:'16px', borderBottom: i < MOCK_TRANSACTIONS.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none', background: i%2===1 ? 'rgba(255,255,255,0.015)' : 'transparent', alignItems:'center', flexWrap:'wrap' }}>
              <div style={{ flex:1.5, fontWeight:600, fontSize:'0.88rem' }}>{tx.type}</div>
              <div style={{ flex:1, color:'var(--accent)', fontWeight:600, fontSize:'0.88rem' }}>{tx.amount}</div>
              <div style={{ flex:1.5, ...S.muted }}>{tx.date}</div>
              <div style={{ flex:2, color:'var(--accent)', fontFamily:'monospace', fontSize:'0.82rem' }}>{tx.hash}</div>
            </div>
          ))}
        </GlassCard>
      </div>
    </div>
  )
}
