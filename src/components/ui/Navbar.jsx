import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import WalletButton from './WalletButton';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Dashboard', to: '/client' },
  { label: 'Token', to: '/token' },
];

const HamburgerIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="2" y1="6" x2="20" y2="6" />
    <line x1="2" y1="11" x2="20" y2="11" />
    <line x1="2" y1="16" x2="20" y2="16" />
  </svg>
);

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="4" y1="4" x2="18" y2="18" />
    <line x1="18" y1="4" x2="4" y2="18" />
  </svg>
);

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: '64px',
    transition: 'backdrop-filter 0.3s, border-bottom 0.3s',
    backdropFilter: scrolled ? 'var(--blur)' : 'none',
    WebkitBackdropFilter: scrolled ? 'var(--blur)' : 'none',
    borderBottom: scrolled ? '1px solid var(--border-glass)' : '1px solid transparent',
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    color: 'var(--text-primary)',
    fontWeight: 700,
    fontSize: '1rem',
  };

  const linkStyle = (active) => ({
    color: active ? 'var(--accent)' : 'var(--text-secondary)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
    transition: 'color 0.2s',
  });

  return (
    <>
      <nav style={navStyle}>
        {/* Logo */}
        <Link to="/" style={logoStyle}>
          <span
            style={{
              display: 'inline-block',
              width: '12px',
              height: '12px',
              background: 'var(--accent)',
              borderRadius: '2px',
            }}
          />
          CommitWork
        </Link>

        {/* Desktop Links */}
        <div
          style={{
            display: 'flex',
            gap: '32px',
            alignItems: 'center',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={linkStyle(location.pathname === link.to)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="desktop-nav">
            <WalletButton />
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="mobile-nav"
            onClick={() => setMenuOpen((v) => !v)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Toggle menu"
          >
            <HamburgerIcon />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 190,
                background: 'rgba(0,0,0,0.5)',
              }}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                height: '100vh',
                width: '280px',
                zIndex: 200,
                background: 'rgba(26,32,53,0.95)',
                backdropFilter: 'var(--blur)',
                WebkitBackdropFilter: 'var(--blur)',
                borderLeft: '1px solid var(--border-glass)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              {/* Close button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <button
                  onClick={() => setMenuOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                  }}
                  aria-label="Close menu"
                >
                  <CloseIcon />
                </button>
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    ...linkStyle(location.pathname === link.to),
                    padding: '14px 0',
                    fontSize: '1rem',
                    borderBottom: '1px solid var(--border-glass)',
                  }}
                >
                  {link.label}
                </Link>
              ))}

              <div style={{ marginTop: '24px' }}>
                <WalletButton />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Responsive helper styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: flex !important; }
        }
        @media (min-width: 769px) {
          .desktop-nav { display: flex !important; }
          .mobile-nav { display: none !important; }
        }
      `}</style>
    </>
  );
}
