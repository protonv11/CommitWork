import { motion, useInView } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useRef, useEffect, useState } from 'react'
import GlassCard from '../components/ui/GlassCard'
import Button    from '../components/ui/Button'
import Badge     from '../components/ui/Badge'
import { MOCK_CREATOR_PROFILE, MOCK_TOKEN_DATA } from '../utils/constants'
import { getCurrentTier } from '../utils/helpers'

// ─── Inline animated counter ────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / 60
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 25)
    return () => clearInterval(timer)
  }, [inView, target])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// ─── Inline SVG icons ────────────────────────────────────────────────────────
const LockIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="18" width="24" height="18" rx="4" />
    <path d="M13 18V13a7 7 0 0 1 14 0v5" />
    <circle cx="20" cy="27" r="2" fill="currentColor" stroke="none" />
  </svg>
)

const PencilIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M28 6l6 6-18 18H10v-6L28 6z" />
    <path d="M24 10l6 6" />
  </svg>
)

const CheckCircleIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="20" cy="20" r="16" />
    <path d="M13 20l5 5 9-10" />
  </svg>
)

// ─── Main component ───────────────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate()
  const tier = getCurrentTier(MOCK_TOKEN_DATA.stakedBalance, MOCK_TOKEN_DATA.tiers)

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* ══════════════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════════════ */}
      <section style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 24px 0',
        position: 'relative',
      }}>

        {/* [A] Pill badge */}
        <div style={{
          border: '1px solid var(--border-glass)',
          background: 'var(--accent-dim)',
          borderRadius: 'var(--radius-pill)',
          padding: '6px 18px',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '24px',
        }}>
          <motion.span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--accent)',
              display: 'inline-block',
              flexShrink: 0,
            }}
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          Web3 Escrow Protocol · Live on Stellar Testnet
        </div>

        {/* [B] Heading — three lines */}
        <div style={{ marginBottom: '24px' }}>
          {[
            { text: 'Lock Trust.', color: 'var(--text-primary)', delay: 0.1 },
            { text: 'Ship Work.',  color: 'var(--text-primary)', delay: 0.2 },
            { text: 'Get Paid.',   color: 'var(--accent)',       delay: 0.3 },
          ].map(({ text, color, delay }) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay }}
              style={{
                fontSize: 'clamp(2.8rem, 8vw, 5.5rem)',
                fontWeight: 800,
                lineHeight: 1.08,
                color,
              }}
            >
              {text}
            </motion.div>
          ))}
        </div>

        {/* [C] Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          style={{
            color: 'var(--text-secondary)',
            maxWidth: '520px',
            lineHeight: 1.7,
            fontSize: '1.05rem',
            marginBottom: '40px',
          }}
        >
          The decentralized commission platform where milestone-based escrow
          protects both clients and creators. No middlemen. No chargebacks.
        </motion.p>

        {/* [D] CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Button variant="primary" size="lg" onClick={() => navigate('/client')}>
            Lock Funds as Client
          </Button>
          <Button variant="ghost" size="lg" onClick={() => navigate('/creator')}>
            Find Work as Creator
          </Button>
        </motion.div>

        {/* [E] Mock escrow card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{ marginTop: '56px', maxWidth: '380px', width: '100%' }}
        >
          <GlassCard hover style={{ padding: '20px' }}>
            {/* Row 1 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                fontFamily: 'monospace',
                color: 'var(--accent)',
                fontSize: '0.78rem',
              }}>
                ESC-001
              </span>
              <Badge status="active" />
            </div>

            {/* Row 2 */}
            <div style={{ fontWeight: 700, marginTop: '12px', color: 'var(--text-primary)', fontSize: '1rem' }}>
              DeFi Dashboard Redesign
            </div>

            {/* Row 3 */}
            <div style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              marginTop: '8px',
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
            }}>
              <span style={{
                width: '32px',
                height: '32px',
                background: 'var(--accent)',
                color: '#0A0F1E',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.8rem',
                flexShrink: 0,
              }}>
                AR
              </span>
              Alex Rivera
              <span>·</span>
              4.9 ★
            </div>

            {/* Row 4 — Progress */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Progress</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>1/3 milestones</span>
              </div>
              <div style={{
                width: '100%',
                height: '6px',
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '3px',
                marginTop: '6px',
              }}>
                <div style={{
                  width: '33%',
                  height: '100%',
                  background: 'var(--accent)',
                  borderRadius: '3px',
                }} />
              </div>
            </div>

            {/* Row 5 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '16px',
              fontSize: '0.82rem',
            }}>
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>2400 XLM locked</span>
              <span style={{
                background: 'var(--accent-dim)',
                color: 'var(--accent)',
                padding: '3px 10px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.75rem',
              }}>
                10% WORK discount
              </span>
            </div>
          </GlassCard>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 2 — STATS
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '72px 24px' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px',
          justifyContent: 'center',
          maxWidth: '900px',
          margin: '0 auto',
        }}>
          {[
            { target: 847,   suffix: " XLM", label: 'Total Value Locked' },
            { target: 1240,  suffix: '',     label: 'Gigs Completed' },
            { target: 94300, suffix: '+',    label: 'Creators Paid' },
          ].map(({ target, suffix, label }) => (
            <GlassCard key={label} style={{ flex: '1', minWidth: '200px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent)' }}>
                <AnimatedCounter target={target} suffix={suffix} />
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                {label}
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 3 — HOW IT WORKS
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>
          Simple Steps. Trustless Outcome.
        </div>
        <div style={{ color: 'var(--text-secondary)', marginBottom: '56px', fontSize: '1rem' }}>
          Escrow mechanics hidden behind three clicks.
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px',
          justifyContent: 'center',
        }}>
          {[
            {
              num: '1',
              title: 'Post & Lock',
              desc: 'Client posts gig details and locks XLM into the Soroban escrow contract',
              icon: <LockIcon />,
              delay: 0,
            },
            {
              num: '2',
              title: 'Build & Submit',
              desc: 'Creator builds the deliverables and submits each milestone for review',
              icon: <PencilIcon />,
              delay: 0.15,
            },
            {
              num: '3',
              title: 'Approve & Release',
              desc: 'Client approves work and funds release instantly via smart contract',
              icon: <CheckCircleIcon />,
              delay: 0.30,
            },
          ].map(({ num, title, desc, icon, delay }) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay }}
              style={{ maxWidth: '300px', flex: '1', minWidth: '240px' }}
            >
              <GlassCard hover style={{ textAlign: 'center' }}>
                {/* Number circle */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  border: '2px solid var(--accent)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent)',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  margin: '0 auto 20px',
                }}>
                  {num}
                </div>

                {/* Icon */}
                <div style={{
                  color: 'var(--accent)',
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}>
                  {icon}
                </div>

                {/* Title */}
                <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
                  {title}
                </div>

                {/* Desc */}
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {desc}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 4 — TOKEN FEATURE
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '48px',
          alignItems: 'flex-start',
        }}>
          {/* Left column */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{
              color: 'var(--accent)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              marginBottom: '12px',
            }}>
              WORK TOKEN UTILITY
            </div>

            <div style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
              Stake to Save on Every Gig
            </div>

            <div style={{
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: '32px',
              fontSize: '1rem',
            }}>
              Hold and stake WORK tokens to get automatic protocol fee discounts
              on every escrow. The more you stake, the more you save.
            </div>

            {/* Tier rows */}
            {MOCK_TOKEN_DATA.tiers.map((t) => (
              <div key={t.name} style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                marginBottom: '14px',
              }}>
                <span style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: t.color,
                  flexShrink: 0,
                  display: 'inline-block',
                }} />
                <span style={{ fontWeight: 600, width: '60px', color: 'var(--text-primary)' }}>
                  {t.name}
                </span>
                <span style={{
                  background: 'var(--accent-dim)',
                  color: 'var(--accent)',
                  padding: '2px 10px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.78rem',
                }}>
                  {t.discount}% discount
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {t.minStake}+ WORK staked
                </span>
              </div>
            ))}

            <div style={{ marginTop: '32px' }}>
              <Button variant="primary" onClick={() => navigate('/token')}>
                Get WORK Tokens
              </Button>
            </div>
          </div>

          {/* Right column — token card */}
          <div style={{ flex: 1, minWidth: '280px' }}>
            <GlassCard style={{ padding: '28px' }}>
              {/* Row 1 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent)' }}>
                  WORK
                </span>
                <span style={{
                  background: 'var(--accent-dim)',
                  color: 'var(--accent)',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}>
                  ERC-20
                </span>
              </div>

              {/* Divider */}
              <div style={{ borderTop: '1px solid var(--border-glass)', margin: '16px 0' }} />

              {/* Info rows */}
              {[
                { label: 'Price',         value: '$0.042',                                        color: 'var(--text-primary)' },
                { label: 'Total Supply',  value: '10,000,000',                                   color: 'var(--text-primary)' },
                { label: 'Your Balance',  value: `${MOCK_TOKEN_DATA.userBalance} WORK`,          color: 'var(--accent)' },
                { label: 'APY (Staking)', value: '12.4%',                                        color: 'var(--success)' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  fontSize: '0.9rem',
                }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                  <span style={{ color, fontWeight: 600 }}>{value}</span>
                </div>
              ))}

              {/* Divider */}
              <div style={{ borderTop: '1px solid var(--border-glass)', margin: '16px 0' }} />

              {/* Current tier */}
              {tier && (
                <div style={{
                  background: `${tier.color}26`,
                  color: tier.color,
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-pill)',
                  textAlign: 'center',
                  fontWeight: 600,
                  marginTop: '8px',
                  fontSize: '0.9rem',
                }}>
                  {tier.name} Tier — {tier.discount}% Discount
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 5 — FOOTER
      ══════════════════════════════════════════════════ */}
      <footer style={{
        padding: '48px 24px',
        textAlign: 'center',
        borderTop: '1px solid var(--border-glass)',
        marginTop: '40px',
      }}>
        {/* Logo row */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 700,
          fontSize: '1rem',
          color: 'var(--text-primary)',
          marginBottom: '16px',
        }}>
          <span style={{
            width: '12px',
            height: '12px',
            background: 'var(--accent)',
            borderRadius: '2px',
            display: 'inline-block',
          }} />
          CommitWork
        </div>

        {/* Links row */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          marginBottom: '16px',
        }}>
          {['GitHub', 'Docs', 'Discord'].map((link) => (
            <a
              key={link}
              href="#"
              style={{
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = 'var(--accent)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Network badge */}
        <div style={{
          margin: '16px auto',
          color: 'var(--text-muted)',
          fontSize: '0.82rem',
        }}>
          Built on Stellar Testnet · Powered by Soroban
        </div>

        {/* Copyright */}
        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '8px' }}>
          © 2025 CommitWork Protocol. All rights reserved.
        </div>
      </footer>

    </div>
  )
}
