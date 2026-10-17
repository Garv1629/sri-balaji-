import React from 'react';
import { MapPin, Phone, MessageSquare, Navigation, Star, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addressText = "6, 5th Main Road, Sarjapur Road, Amrita Nagar, Halanayakanahalli, Bengaluru, Karnataka 560035";
  const googleMapsDirectionsUrl = "https://www.google.com/maps/dir/?api=1&destination=6,+5th+Main+Road,+Sarjapur+Road,+Amrita+Nagar,+Halanayakanahalli,+Bengaluru,+Karnataka+560035";
  const whatsappUrl = "https://wa.me/919535854614";
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      role="contentinfo"
      style={{
        backgroundColor: 'var(--color-verdun)',
        borderTop: '1px solid var(--color-orinoco)',
        borderTopLeftRadius: 'var(--radius-2xl)',
        borderTopRightRadius: 'var(--radius-2xl)',
        color: 'var(--color-orinoco)',
        paddingTop: '5rem',
        paddingBottom: '2.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="container">
        {/* Top Editorial Footer Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
          gap: 'clamp(2rem, 4vw, 3.5rem)',
          marginBottom: '4rem'
        }}>
          {/* Column 1: Brand & Concise Statement */}
          <div className="reveal-fade-up" style={{ maxWidth: '380px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(252, 255, 245, 0.12)',
                border: '1px solid var(--color-orinoco)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="22" height="22" viewBox="0 0 100 100" aria-hidden="true">
                  <path d="M20 75 L50 22 L80 75 Z" fill="none" stroke="var(--color-eggshell)" strokeWidth="6" />
                  <path d="M35 75 L50 48 L65 75 Z" fill="var(--color-orinoco)" />
                </svg>
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.45rem',
                  fontWeight: 600,
                  color: 'var(--color-eggshell)',
                  lineHeight: 1.1
                }}>
                  Sri Balaji Real Estate
                </div>
                <div style={{
                  fontSize: '0.66rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--color-orinoco)',
                  fontWeight: 600
                }}>
                  Bengaluru Property Advisory
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--color-orinoco)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Providing personal property guidance, rental assistance, and local knowledge across Sarjapur Road, Halanayakanahalli, and Amrita Nagar in Bengaluru.
            </p>

            {/* Google Rating Reference Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(252, 255, 245, 0.12)',
              border: '1px solid rgba(219, 218, 175, 0.4)',
              borderRadius: 'var(--radius-pill)',
              padding: '0.35rem 0.95rem',
              fontSize: '0.78rem',
              color: 'var(--color-eggshell)'
            }}>
              <Star size={13} fill="#DBDAAF" color="#DBDAAF" />
              <strong style={{ color: 'var(--color-eggshell)' }}>5.0 Rating</strong>
              <span style={{ color: 'var(--color-orinoco)' }}>• 68 Google Reviews</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="reveal-fade-up delay-150">
            <h4 style={{
              fontSize: '0.82rem',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--color-eggshell)',
              marginBottom: '1.5rem',
              fontWeight: 600
            }}>
              Navigation
            </h4>
            <nav aria-label="Footer navigation">
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', padding: 0, margin: 0 }}>
                <li>
                  <a href="#hero" className="nav-link" style={{ color: 'var(--color-orinoco)' }}>
                    Home
                  </a>
                </li>
                <li>
                  <a href="#properties" className="nav-link" style={{ color: 'var(--color-orinoco)' }}>
                    Properties
                  </a>
                </li>
                <li>
                  <a href="#about" className="nav-link" style={{ color: 'var(--color-orinoco)' }}>
                    About
                  </a>
                </li>
                <li>
                  <a href="#why-choose-us" className="nav-link" style={{ color: 'var(--color-orinoco)' }}>
                    Why Us
                  </a>
                </li>
                <li>
                  <a href="#locality" className="nav-link" style={{ color: 'var(--color-orinoco)' }}>
                    Locality
                  </a>
                </li>
                <li>
                  <a href="#reviews" className="nav-link" style={{ color: 'var(--color-orinoco)' }}>
                    Reviews
                  </a>
                </li>
                <li>
                  <a href="#contact" className="nav-link" style={{ color: 'var(--color-orinoco)' }}>
                    Contact
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Column 3: Contact & Supplied Business Address */}
          <div className="reveal-fade-up delay-250">
            <h4 style={{
              fontSize: '0.82rem',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--color-eggshell)',
              marginBottom: '1.5rem',
              fontWeight: 600
            }}>
              Office & Contact
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem' }}>
              {/* Address */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <MapPin size={18} style={{ color: 'var(--color-orinoco)', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ color: 'var(--color-orinoco)', lineHeight: 1.6 }}>
                  {addressText}
                </span>
              </div>

              {/* Click to Call */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={16} style={{ color: 'var(--color-orinoco)', flexShrink: 0 }} />
                <a 
                  href="tel:+919535854614" 
                  style={{ color: 'var(--color-eggshell)', fontWeight: 600, transition: 'color 0.2s' }}
                  aria-label="Call Sri Balaji Real Estate at +91 95358 54614"
                >
                  +91 95358 54614
                </a>
              </div>

              {/* WhatsApp Link */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MessageSquare size={16} style={{ color: '#25D366', flexShrink: 0 }} />
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#25D366', fontWeight: 500, transition: 'opacity 0.2s' }}
                  aria-label="Chat with Sri Balaji Real Estate on WhatsApp"
                >
                  WhatsApp: +91 95358 54614
                </a>
              </div>

              {/* Functional Google Maps Directions CTA - Fully Pill */}
              <div style={{ marginTop: '0.5rem' }}>
                <a 
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '0.6rem 1.25rem',
                    fontSize: '0.82rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    color: 'var(--color-eggshell)',
                    border: '1px solid var(--color-orinoco)',
                    borderRadius: 'var(--radius-pill)',
                    fontWeight: 600,
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-orinoco)';
                    e.currentTarget.style.color = 'var(--color-verdun)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--color-eggshell)';
                  }}
                  aria-label="Get driving directions to Sri Balaji Real Estate on Google Maps"
                >
                  <Navigation size={13} />
                  <span>Get Driving Directions</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="reveal-fade-up delay-350" style={{
          borderTop: '1px solid rgba(219, 218, 175, 0.25)',
          paddingTop: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--color-orinoco)'
        }}>
          <div>
            © {currentYear} Sri Balaji Real Estate. All rights reserved. • Sarjapur Road, Bengaluru.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button 
              onClick={scrollToTop}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                color: 'var(--color-eggshell)',
                background: 'transparent',
                padding: '0.45rem 1.15rem',
                border: '1px solid var(--color-orinoco)',
                borderRadius: 'var(--radius-pill)',
                cursor: 'pointer',
                fontSize: '0.78rem',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-orinoco)';
                e.currentTarget.style.color = 'var(--color-verdun)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--color-eggshell)';
              }}
              title="Return to top of page"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp size={13} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
