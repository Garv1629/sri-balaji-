import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, Menu, X, Star, MapPin } from 'lucide-react';

interface NavbarProps {
  onOpenEnquiry: (propertyTitle?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenEnquiry }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Advisory Bar in Verdun Green */}
      <div style={{
        background: 'var(--color-verdun)',
        borderBottom: '1px solid rgba(219, 218, 175, 0.25)',
        fontSize: '0.78rem',
        padding: '0.5rem 0',
        color: 'var(--color-eggshell)',
        transition: 'background var(--transition-smooth)'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={13} style={{ color: 'var(--color-orinoco)' }} />
            <span>6, 5th Main Rd, Amrita Nagar, Sarjapur Rd, Bengaluru</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Google Rating Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'rgba(252, 255, 245, 0.12)',
              padding: '0.2rem 0.75rem',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid rgba(219, 218, 175, 0.35)',
              color: 'var(--color-eggshell)'
            }}>
              <Star size={12} fill="#DBDAAF" color="#DBDAAF" />
              <strong style={{ color: 'var(--color-eggshell)' }}>5.0 / 5.0</strong>
              <span style={{ color: 'var(--color-orinoco)' }}>(68 Verified Reviews)</span>
            </div>

            <a 
              href="tel:+919535854614"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: 'var(--color-eggshell)',
                fontWeight: 600
              }}
            >
              <Phone size={12} style={{ color: 'var(--color-orinoco)' }} />
              <span>+91 95358 54614</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navigation — Floating Pill Capsule */}
      <header 
        style={{
          position: 'sticky',
          top: isScrolled ? '0.75rem' : '0.5rem',
          zIndex: 50,
          padding: '0 1rem',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'none'
        }}
      >
        <div 
          className={`container liquid-glass-capsule ${isScrolled ? 'scrolled' : ''}`}
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: isScrolled ? '4.25rem' : '4.85rem',
            padding: '0 1.5rem',
            transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Brand Identity */}
          <a href="#hero" aria-label="Sri Balaji Real Estate - Return to top" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--color-verdun)',
              border: '1px solid var(--color-orinoco)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isScrolled ? '0 2px 10px rgba(72, 82, 28, 0.15)' : '0 4px 14px rgba(0,0,0,0.4)',
              flexShrink: 0
            }}>
              <svg width="20" height="20" viewBox="0 0 100 100" aria-hidden="true">
                <path d="M20 75 L50 22 L80 75 Z" fill="none" stroke="var(--color-eggshell)" strokeWidth="6" />
                <path d="M35 75 L50 48 L65 75 Z" fill="var(--color-orinoco)" />
              </svg>
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.35rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                color: isScrolled ? 'var(--color-verdun)' : 'var(--color-eggshell)',
                lineHeight: 1.1,
                transition: 'color var(--transition-fast)'
              }}>
                SRI BALAJI
              </div>
              <div style={{
                fontSize: '0.62rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: isScrolled ? 'var(--color-muted)' : 'var(--color-orinoco)',
                fontWeight: 600,
                marginTop: '1px',
                transition: 'color var(--transition-fast)'
              }}>
                Real Estate • Sarjapur
              </div>
            </div>
          </a>

          {/* Desktop Navigation Links — Capsule states */}
          <nav style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.35rem'
          }} className="desktop-nav">
            {[
              { href: '#about', label: 'Experience' },
              { href: '#properties', label: 'Properties' },
              { href: '#why-choose-us', label: 'Why Us' },
              { href: '#locality', label: 'Sarjapur Corridor' },
              { href: '#reviews', label: 'Client Reviews' },
              { href: '#contact', label: 'Contact' },
            ].map((item, idx) => (
              <a 
                key={idx}
                href={item.href} 
                className="nav-link-capsule" 
                style={{ 
                  fontSize: '0.85rem', 
                  color: isScrolled ? 'var(--color-verdun)' : 'var(--color-eggshell)', 
                  fontWeight: 600, 
                  letterSpacing: '0.02em',
                  padding: '0.45rem 0.95rem',
                  borderRadius: 'var(--radius-pill)',
                  textShadow: isScrolled ? '0 1px 1px rgba(255, 255, 255, 0.6)' : '0 1px 3px rgba(0, 0, 0, 0.5)',
                  transition: 'all 0.25s ease',
                  border: '1px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isScrolled ? 'rgba(72, 82, 28, 0.08)' : 'rgba(252, 255, 245, 0.18)';
                  e.currentTarget.style.borderColor = isScrolled ? 'rgba(219, 218, 175, 0.4)' : 'rgba(252, 255, 245, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA Group with Pill buttons */}
          <div style={{ display: 'none', alignItems: 'center', gap: '0.75rem' }} className="desktop-cta">
            <a 
              href="https://wa.me/919535854614?text=Hello%20Sri%20Balaji%20Real%20Estate,%20I%20would%20like%20to%20inquire%20about%20properties%20on%20Sarjapur%20Road." 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-whatsapp"
              style={{ padding: '0.58rem 1.15rem', fontSize: '0.82rem' }}
            >
              <MessageSquare size={14} />
              <span>WhatsApp</span>
            </a>

            <button 
              onClick={() => onOpenEnquiry()}
              className="btn-primary"
              style={{ padding: '0.58rem 1.3rem', fontSize: '0.82rem' }}
            >
              <span>Enquire</span>
            </button>
          </div>

          {/* Mobile Hamburger Button — Fully Pill / Circular Glass */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              padding: '0.55rem',
              color: isScrolled ? 'var(--color-verdun)' : 'var(--color-eggshell)',
              border: isScrolled ? '1px solid rgba(219, 218, 175, 0.6)' : '1px solid rgba(252, 255, 245, 0.45)',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: isScrolled ? 'rgba(252, 255, 245, 0.65)' : 'rgba(72, 82, 28, 0.45)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.5)',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.25s ease'
            }}
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Responsive CSS helper */}
        <style>{`
          @media (min-width: 992px) {
            .desktop-nav { display: flex !important; }
            .desktop-cta { display: flex !important; }
            .mobile-toggle { display: none !important; }
          }
        `}</style>

        {/* Mobile Navigation Drawer — Liquid Glass Rounded Panel */}
        {mobileMenuOpen && (
          <div 
            id="mobile-nav-drawer"
            role="navigation"
            aria-label="Mobile Navigation Menu"
            style={{
              pointerEvents: 'auto',
              background: 'linear-gradient(145deg, rgba(252, 255, 245, 0.94) 0%, rgba(252, 255, 245, 0.82) 100%)',
              backdropFilter: 'blur(28px) saturate(180%)',
              WebkitBackdropFilter: 'blur(28px) saturate(180%)',
              border: '1px solid rgba(252, 255, 245, 0.7)',
              borderRadius: 'var(--radius-xl)',
              padding: 'clamp(1.25rem, 4vw, 1.75rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.15rem',
              boxShadow: 'inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.9), 0 20px 48px rgba(37, 40, 25, 0.16)',
              marginTop: '0.75rem',
              maxWidth: '600px',
              margin: '0.75rem auto 0',
              maxHeight: 'calc(100vh - 6.5rem)',
              overflowY: 'auto',
              overscrollBehavior: 'contain'
            }}
          >
            <a 
              href="#about" 
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '1rem', color: 'var(--color-text)', borderBottom: '1px solid var(--color-orinoco)', paddingBottom: '0.5rem', fontWeight: 500 }}
            >
              About The Experience
            </a>
            <a 
              href="#properties" 
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '1rem', color: 'var(--color-text)', borderBottom: '1px solid var(--color-orinoco)', paddingBottom: '0.5rem', fontWeight: 500 }}
            >
              Curated Properties
            </a>
            <a 
              href="#why-choose-us" 
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '1rem', color: 'var(--color-text)', borderBottom: '1px solid var(--color-orinoco)', paddingBottom: '0.5rem', fontWeight: 500 }}
            >
              Why Choose Us
            </a>
            <a 
              href="#locality" 
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '1rem', color: 'var(--color-text)', borderBottom: '1px solid var(--color-orinoco)', paddingBottom: '0.5rem', fontWeight: 500 }}
            >
              Sarjapur Road Corridor
            </a>
            <a 
              href="#reviews" 
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '1rem', color: 'var(--color-text)', borderBottom: '1px solid var(--color-orinoco)', paddingBottom: '0.5rem', fontWeight: 500 }}
            >
              Google Reviews (5.0 ★)
            </a>
            <a 
              href="#contact" 
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '1rem', color: 'var(--color-text)', borderBottom: '1px solid var(--color-orinoco)', paddingBottom: '0.5rem', fontWeight: 500 }}
            >
              Contact Advisory
            </a>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <a 
                href="https://wa.me/919535854614?text=Hello%20Sri%20Balaji%20Real%20Estate,%20I%20am%20interested%20in%20Sarjapur%20properties." 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-whatsapp"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <MessageSquare size={16} />
                <span>Chat on WhatsApp</span>
              </a>
              <button 
                onClick={() => { setMobileMenuOpen(false); onOpenEnquiry(); }}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Book Private Consultation
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
