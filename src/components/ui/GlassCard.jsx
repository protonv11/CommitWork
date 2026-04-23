import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', hover = false, onClick, style = {} }) {
  const baseStyle = {
    background: 'var(--bg-card)',
    backdropFilter: 'var(--blur)',
    WebkitBackdropFilter: 'var(--blur)',
    border: '1px solid var(--border-glass)',
    borderRadius: 'var(--radius-card)',
    boxShadow: 'var(--shadow-glass)',
    padding: '24px',
    ...style,
  };

  const hoverProps = hover
    ? {
        whileHover: { y: -4, scale: 1.01 },
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }
    : {};

  return (
    <motion.div
      className={className}
      style={baseStyle}
      onClick={onClick}
      {...hoverProps}
    >
      {children}
    </motion.div>
  );
}
