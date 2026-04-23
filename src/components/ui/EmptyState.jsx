export default function EmptyState({ icon, title, description, actionLabel, onAction }) {
  return (
    <div style={{
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      textAlign:'center', padding:'64px 24px'
    }}>
      <div style={{
        fontSize:'3rem', marginBottom:20,
        opacity:0.35, filter:'grayscale(0.5)'
      }}>
        {icon || '📭'}
      </div>
      <h3 style={{ fontWeight:700, marginBottom:10, fontSize:'1.1rem' }}>
        {title}
      </h3>
      <p style={{
        color:'var(--text-secondary)', fontSize:'0.9rem',
        lineHeight:1.6, maxWidth:320, marginBottom: onAction ? 24 : 0
      }}>
        {description}
      </p>
      {onAction && actionLabel && (
        <button onClick={onAction} style={{
          background:'var(--accent)', color:'#0A0F1E',
          border:'none', borderRadius:'var(--radius-pill)',
          padding:'10px 24px', fontWeight:700, cursor:'pointer',
          fontSize:'0.9rem'
        }}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}
