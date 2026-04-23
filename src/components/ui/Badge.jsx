import { motion } from 'framer-motion';

const statusMap = {
  pending: {
    label: 'Pending',
    bg: 'rgba(139,156,181,0.15)',
    color: '#8B9CB5',
    pulse: false,
  },
  active: {
    label: 'Active',
    bg: 'rgba(59,130,246,0.15)',
    color: '#3B82F6',
    pulse: true,
  },
  submitted: {
    label: 'Submitted',
    bg: 'rgba(245,158,11,0.15)',
    color: '#F59E0B',
    pulse: false,
  },
  approved: {
    label: 'Approved',
    bg: 'rgba(16,185,129,0.15)',
    color: '#10B981',
    pulse: false,
  },
  released: {
    label: 'Released',
    bg: 'rgba(16,185,129,0.2)',
    color: '#10B981',
    pulse: false,
  },
  disputed: {
    label: 'Disputed',
    bg: 'rgba(239,68,68,0.15)',
    color: '#EF4444',
    pulse: false,
  },
  completed: {
    label: 'Completed',
    bg: 'rgba(16,185,129,0.15)',
    color: '#10B981',
    pulse: false,
  },
};

export default function Badge({ status }) {
  const config = statusMap[status] || {
    label: status,
    bg: 'rgba(74,85,104,0.15)',
    color: '#4A5568',
    pulse: false,
  };

  const containerStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 12px',
    borderRadius: 'var(--radius-pill)',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.02em',
    background: config.bg,
    color: config.color,
  };

  return (
    <span style={containerStyle}>
      {config.pulse && (
        <motion.span
          style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#3B82F6',
            flexShrink: 0,
          }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        />
      )}
      {config.label}
    </span>
  );
}
