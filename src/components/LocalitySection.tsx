import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Phone, Compass, Check, Copy } from 'lucide-react';
import { LOCALITY_HEADER, NEIGHBOURHOODS } from '../data/neighbourhoods';

export const LocalitySection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const addressText = "6, 5th Main Road, Sarjapur Road, Amrita Nagar, Halanayakanahalli, Bengaluru, Karnataka 560035";
  const directionsUrl = "https://www.google.com/maps/dir/?api=1&destination=6,+5th+Main+Road,+Sarjapur+Road,+Amrita+Nagar,+Halanayakanahalli,+Bengaluru,+Karnataka+560035";
  const mapsSearchUrl = "https://maps.google.com/?q=6,+5th+Main+Road,+Sarjapur+Road,+Amrita+Nagar,+Halanayakanahalli,+Bengaluru,+Karnataka+560035";
  const embedMapUrl = "https://maps.google.com/maps?q=6,+5th+Main+Road,+Sarjapur+Road,+Amrita+Nagar,+Halanayakanahalli,+Bengaluru,+Karnataka+560035&t=&z=15&ie=UTF8&iwloc=&output=embed";

  const handleCopyAddress = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(addressText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section 
      id="locality" 
      className="section-wrapper" 
      style={{
        backgroundColor: 'var(--color-eggshell)',
        color: 'var(--color-text)',
        borderTop: '1px solid var(--color-orinoco)',
        borderBottom: '1px solid var(--color-orinoco)',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '6rem',
        paddingBottom: '6rem'
      }}
    >
      <div className="container">
        {/* Editorial Header */}
        <div style={{ maxWidth: '820px', marginBottom: '3.5rem' }}>
          <div className="eyebrow reveal-fade-up">
            LOCALITY & NEIGHBOURHOOD
          </div>
          <h2 className="section-title-charcoal reveal-fade-up delay-100">
            {LOCALITY_HEADER.headline}
          </h2>
          <p className="section-desc-charcoal reveal-fade-up delay-150">
            {LOCALITY_HEADER.supportingText}
          </p>
        </div>

        {/* 4 Featured Locality Cards with Architectural Photography */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
          gap: '1.75rem',
          marginBottom: '4rem'
        }}>
          {NEIGHBOURHOODS.map((item, idx) => {
            const delayClass = idx === 0 ? 'delay-100' : idx === 1 ? 'delay-200' : idx === 2 ? 'delay-300' : 'delay-400';
            return (
            <div
              key={item.id}
              className={`reveal-fade-up ${delayClass}`}
              style={{
                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.78) 0%, rgba(252, 255, 245, 0.55) 100%)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(219, 218, 175, 0.55)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: 'inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.9), 0 8px 24px rgba(37, 40, 25, 0.05)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(153, 159, 84, 0.75)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'inset 0 1px 2px 0 rgba(255, 255, 255, 1), 0 16px 36px rgba(72, 82, 28, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(219, 218, 175, 0.55)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.9), 0 8px 24px rgba(37, 40, 25, 0.05)';
              }}
            >
              {/* Locality Photo */}
              <div style={{ 
                position: 'relative', 
                height: '200px', 
                overflow: 'hidden',
                borderTopLeftRadius: 'var(--radius-lg)',
                borderTopRightRadius: 'var(--radius-lg)'
              }}>
                <img 
                  src={item.image} 
                  alt={`${item.name} Bengaluru architectural landscape`}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 40%, rgba(37, 40, 25, 0.82) 100%)'
                }} />

                {/* Category Badge — Fully Pill-Shaped */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  background: 'var(--color-verdun)',
                  border: '1px solid rgba(219, 218, 175, 0.5)',
                  padding: '0.3rem 0.8rem',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.7rem',
                  color: 'var(--color-eggshell)',
                  fontWeight: 600,
                  letterSpacing: '0.04em'
                }}>
                  {item.category}
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontFamily: 'var(--font-serif)',
                    color: 'var(--color-verdun)',
                    marginBottom: '0.6rem'
                  }}>
                    {item.name}
                  </h3>
                  <p style={{
                    fontSize: '0.86rem',
                    color: 'var(--color-muted)',
                    lineHeight: 1.6,
                    margin: 0
                  }}>
                    {item.description}
                  </p>
                </div>

                <div style={{
                  marginTop: '1.25rem',
                  paddingTop: '0.85rem',
                  borderTop: '1px solid var(--color-orinoco)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.75rem',
                  color: 'var(--color-verdun)',
                  fontWeight: 600
                }}>
                  <MapPin size={13} style={{ color: 'var(--color-green-smoke)' }} />
                  <span>South-East Bengaluru Sector</span>
                </div>
              </div>
            </div>
          );
        })}
        </div>

        {/* Map & Office Directions Section — Fully Rounded Luxury Shell */}
        <div className="reveal-scale-in delay-200" style={{
          background: '#FFFFFF',
          border: '1px solid var(--color-orinoco)',
          borderRadius: 'var(--radius-2xl)',
          overflow: 'hidden',
          boxShadow: '0 12px 36px rgba(37, 40, 25, 0.08)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            alignItems: 'stretch'
          }}>
            {/* Embedded Responsive Google Map */}
            <div style={{
              position: 'relative',
              minHeight: '380px',
              height: '100%',
              background: 'var(--color-orinoco)',
              borderRight: '1px solid var(--color-orinoco)'
            }}>
              <iframe
                title="Sri Balaji Real Estate Office Location Map"
                src={embedMapUrl}
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: 'contrast(1.02)',
                  display: 'block',
                  minHeight: '380px'
                }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Polished Location & Directions Panel */}
            <div style={{
              padding: '2.5rem 2.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: '#FFFFFF'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-verdun)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '0.5rem' }}>
                  <Compass size={14} style={{ color: 'var(--color-green-smoke)' }} />
                  <span>Verified Business Location</span>
                </div>

                <h3 style={{
                  fontSize: '1.6rem',
                  fontFamily: 'var(--font-serif)',
                  color: 'var(--color-verdun)',
                  lineHeight: 1.25,
                  marginBottom: '1rem'
                }}>
                  Sri Balaji Real Estate
                </h3>

                {/* Supplied Address — Translucent Glass Panel */}
                <div style={{
                  background: 'rgba(252, 255, 245, 0.75)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(219, 218, 175, 0.6)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem 1.5rem',
                  marginBottom: '1.5rem',
                  boxShadow: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.85)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <MapPin size={18} style={{ color: 'var(--color-verdun)', marginTop: '2px', flexShrink: 0 }} />
                    <div style={{ fontSize: '0.92rem', color: 'var(--color-text)', lineHeight: 1.6 }}>
                      {addressText}
                    </div>
                  </div>

                  <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                      onClick={handleCopyAddress}
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--color-orinoco)',
                        borderRadius: 'var(--radius-pill)',
                        color: copied ? 'var(--color-verdun)' : 'var(--color-muted)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.35rem 0.85rem',
                        fontWeight: 600,
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      {copied ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copied ? 'Address Copied' : 'Copy Address'}</span>
                    </button>
                  </div>
                </div>

                {/* Contact Phone & Advisory Notice */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--color-muted)', fontSize: '0.9rem' }}>
                  <Phone size={15} style={{ color: 'var(--color-green-smoke)' }} />
                  <span>Phone: <a href="tel:+919535854614" style={{ color: 'var(--color-verdun)', fontWeight: 600 }}>+91 95358 54614</a></span>
                </div>

                <p style={{ fontSize: '0.84rem', color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
                  Located on 5th Main Road in Amrita Nagar, providing localized assistance for prospective tenants, home buyers, and property seekers around Sarjapur Road and Halanayakanahalli.
                </p>
              </div>

              {/* Functional CTA Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{
                    fontSize: '0.85rem',
                    padding: '0.8rem 1.6rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  aria-label="Get Directions to Sri Balaji Real Estate on Google Maps"
                >
                  <Navigation size={15} />
                  <span>Get Directions</span>
                </a>

                <a
                  href={mapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                  style={{
                    fontSize: '0.85rem',
                    padding: '0.8rem 1.4rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  aria-label="Open Sri Balaji Real Estate listing in Google Maps"
                >
                  <span>Open in Maps</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
