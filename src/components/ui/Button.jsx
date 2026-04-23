import { motion } from 'framer-motion';

const Spinner = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    style={{ animation: 'spin 0.8s linear infinite' }}
  >
    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    <circle
      cx="8"
      cy="8"
      r="6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="28"
      strokeDashoffset="10"
      opacity="0.8"
    />
  </svg>
);

const sizeStyles = {
  sm: { padding: '8px 16px', fontSize: '0.8rem' },
  md: { padding: '12px 24px', fontSize: '0.9rem' },
  lg: { padding: '16px 32px', fontSize: '1rem' },
};

const variantStyles = {
  primary: {
    background: 'var(--accent)',
    color: '#0A0F1E',
    border: 'none',
  },
  ghost: {
    background: 'transparent',
    border: '1px solid var(--border-glass)',
    color: 'var(--text-primary)',
  },
  danger: {
    background: 'rgba(239,68,68,0.15)',
    border: '1px solid #EF4444',
    color: '#EF4444',
  },
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  onClick,
  disabled = false,
}) {
  const baseStyle = {
    borderRadius: 'var(--radius-pill)',
    fontFamily: 'inherit',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 600,
    transition: 'all 0.2s',
    border: 'none',
    pointerEvents: loading ? 'none' : undefined,
    opacity: disabled ? 0.5 : 1,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };

  return (
    <motion.button
      style={baseStyle}
      onClick={!disabled && !loading ? onClick : undefined}
      whileTap={{ scale: 0.97 }}
    >
      {loading && <Spinner />}
      {children}
    </motion.button>
  );
}
