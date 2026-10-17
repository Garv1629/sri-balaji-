import React from 'react';
import { Star, ExternalLink, ShieldCheck } from 'lucide-react';
import { GOOGLE_BUSINESS_REFERENCE, CUSTOMER_TESTIMONIALS } from '../data/testimonials';

export const TestimonialsSection: React.FC = () => {
  return (
    <section 
      id="reviews" 
      className="section-wrapper" 
      style={{
        backgroundColor: 'var(--color-verdun)',
        color: 'var(--color-eggshell)',
        borderTop: '1px solid rgba(219, 218, 175, 0.25)',
        borderBottom: '1px solid rgba(219, 218, 175, 0.25)',
        position: 'relative',
        paddingTop: '6.5rem',
        paddingBottom: '6.5rem'
      }}
    >
      <div className="container">
        {/* Section Header & Google Review Trust Display */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginBottom: '4rem'
        }}>
          {/* Eyebrow */}
          <div className="eyebrow eyebrow-light reveal-fade-up" style={{ justifyContent: 'center' }}>
            CLIENT TRUST & REPUTATION
          </div>

          {/* Heading */}
          <h2 className="section-title section-title-light reveal-fade-up delay-100" style={{ maxWidth: '780px' }}>
            Genuine Feedback from Home Seekers in Bengaluru.
          </h2>

          <p className="section-desc section-desc-light reveal-fade-up delay-150" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            Reference customer reviews reflecting personal guidance, responsive communication, and assistance in finding suitable homes around Sarjapur Road.
          </p>

          {/* Prominent 5.0 Rating Trust Banner — Fully Rounded */}
          <div 
            className="reveal-scale-in delay-200"
            style={{
              background: 'linear-gradient(135deg, rgba(252, 255, 245, 0.16) 0%, rgba(252, 255, 245, 0.05) 50%, rgba(37, 40, 25, 0.25) 100%)',
              border: '1px solid rgba(219, 218, 175, 0.45)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.75rem 2.5rem',
              maxWidth: '680px',
              width: '100%',
              boxShadow: 'inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.45), 0 20px 48px rgba(0, 0, 0, 0.35)',
              textAlign: 'center',
              backdropFilter: 'blur(20px) saturate(160%)',
              WebkitBackdropFilter: 'blur(20px) saturate(160%)'
            }}
          >
            {/* Top Google Branding & Star Rating */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.25rem',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-eggshell)' }}>Google Rating</span>
              </div>

              {/* 5-Star Visual Treatment */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#DBDAAF" color="#DBDAAF" />
                ))}
                <span style={{
                  fontSize: '1.4rem',
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 700,
                  color: 'var(--color-eggshell)',
                  marginLeft: '0.4rem'
                }}>
                  {GOOGLE_BUSINESS_REFERENCE.rating}.0 / 5.0
                </span>
              </div>
            </div>

            {/* Supplied Reference Information Notice */}
            <div style={{
              fontSize: '0.88rem',
              color: 'var(--color-orinoco)',
              marginBottom: '1rem',
              lineHeight: 1.5
            }}>
              Based on <strong style={{ color: 'var(--color-eggshell)' }}>{GOOGLE_BUSINESS_REFERENCE.reviewCount} Google reviews</strong> (provided reference count for Sri Balaji Real Estate).
            </div>

            {/* Clear Link to Actual Google Maps Listing — Pill Shaped */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <a
                href={GOOGLE_BUSINESS_REFERENCE.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '0.65rem 1.6rem',
                  fontSize: '0.82rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--color-eggshell)',
                  borderColor: 'var(--color-orinoco)',
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
                aria-label="Read all 68 reviews on Google Maps listing"
              >
                <span>Read all reviews on Google</span>
                <ExternalLink size={14} />
              </a>
            </div>

            {/* Integration Clarification Notice */}
            <div style={{
              fontSize: '0.72rem',
              color: 'rgba(252, 255, 245, 0.72)',
              marginTop: '1rem',
              borderTop: '1px solid rgba(219, 218, 175, 0.25)',
              paddingTop: '0.75rem',
              lineHeight: 1.5
            }}>
              Reference information: 5.0/5 rating based on 68 customer reviews provided in business records. Not an automated real-time API widget.
            </div>
          </div>
        </div>

        {/* Customer Testimonials Grid with Eggshell Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {CUSTOMER_TESTIMONIALS.map((review, idx) => {
            const delayClass = idx === 0 ? 'delay-100' : idx === 1 ? 'delay-200' : 'delay-300';
            return (
            <div 
              key={review.id}
              className={`reveal-fade-up ${delayClass}`}
              style={{
                background: 'linear-gradient(145deg, rgba(252, 255, 245, 0.94) 0%, rgba(252, 255, 245, 0.82) 100%)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                color: 'var(--color-text)',
                border: '1px solid rgba(219, 218, 175, 0.55)',
                borderRadius: 'var(--radius-lg)',
                padding: '2.25rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: 'inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.95), 0 12px 32px rgba(37, 40, 25, 0.18)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(153, 159, 84, 0.8)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'inset 0 1px 2px 0 rgba(255, 255, 255, 1), 0 20px 48px rgba(0, 0, 0, 0.28)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(219, 218, 175, 0.55)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.95), 0 12px 32px rgba(37, 40, 25, 0.18)';
              }}
            >
              <div>
                {/* Theme Badge & 5-Star Rating */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  marginBottom: '1.25rem'
                }}>
                  <span style={{
                    background: 'var(--color-orinoco)',
                    border: '1px solid rgba(72, 82, 28, 0.2)',
                    color: 'var(--color-verdun)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    padding: '0.35rem 0.85rem',
                    borderRadius: 'var(--radius-pill)'
                  }}>
                    {review.badge}
                  </span>

                  <div style={{ display: 'flex', gap: '0.2rem' }}>
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="#999F54" color="#999F54" />
                    ))}
                  </div>
                </div>

                {/* Paraphrased Summary Label */}
                <div style={{
                  fontSize: '0.72rem',
                  color: 'var(--color-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '0.65rem',
                  fontWeight: 600
                }}>
                  Paraphrased Client Feedback:
                </div>

                {/* Summary Text */}
                <p style={{
                  fontSize: '0.96rem',
                  color: 'var(--color-text)',
                  lineHeight: 1.75,
                  marginBottom: '1.75rem'
                }}>
                  "{review.summary}"
                </p>
              </div>

              {/* Attribution */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--color-orinoco)',
                paddingTop: '1.1rem',
                fontSize: '0.8rem',
                color: 'var(--color-muted)'
              }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-verdun)' }}>
                    {review.reviewerName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginTop: '2px' }}>
                    {review.locality}
                  </div>
                </div>

                <a 
                  href={GOOGLE_BUSINESS_REFERENCE.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--color-verdun)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textDecoration: 'underline'
                  }}
                  aria-label="View reference review on Google Maps"
                >
                  <span>Google Maps</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </section>
  );
};
