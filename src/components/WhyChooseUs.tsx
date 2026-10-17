import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const servicePrinciples = [
    {
      number: '01',
      title: 'Personal Guidance',
      description: 'Support throughout the property search.',
      detail: 'From understanding your distinct spatial requirements to guiding you through shortlisting and property visits, we offer focused, individual attention.'
    },
    {
      number: '02',
      title: 'Clear Communication',
      description: 'Straightforward information and responsive assistance.',
      detail: 'Clear, direct answers regarding property specifications, owner terms, and search progress, ensuring complete peace of mind at every step.'
    },
    {
      number: '03',
      title: 'Needs-Based Discovery',
      description: "Explore properties that align with the customer's requirements and budget.",
      detail: 'We prioritize finding the right match for your lifestyle and financial parameters rather than presenting arbitrary or mismatched listings.'
    },
    {
      number: '04',
      title: 'Local Property Assistance',
      description: 'Support for people exploring homes in Halanayakanahalli, Sarjapur Road and nearby areas.',
      detail: 'Deep familiarity with the immediate micro-markets of South-East Bengaluru, helping you navigate local enclaves with genuine context.'
    }
  ];

  return (
    <section 
      id="why-choose-us" 
      className="section-wrapper" 
      style={{
        backgroundColor: 'var(--color-orinoco)',
        color: 'var(--color-text)',
        borderTop: '1px solid rgba(72, 82, 28, 0.2)',
        borderBottom: '1px solid rgba(72, 82, 28, 0.2)',
        position: 'relative',
        paddingTop: '6rem',
        paddingBottom: '6rem'
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: 'clamp(1.5rem, 4vw, 3rem)',
          alignItems: 'flex-end',
          marginBottom: '4.5rem'
        }}>
          <div>
            <div className="eyebrow reveal-fade-up">
              SERVICE PRINCIPLES
            </div>
            <h2 className="section-title reveal-fade-up delay-100" style={{ color: 'var(--color-verdun)', marginBottom: '1rem' }}>
              Why Choose Sri Balaji Real Estate.
            </h2>
            <p className="reveal-fade-up delay-150" style={{ fontSize: '1.05rem', color: 'var(--color-text)', lineHeight: 1.75, fontWeight: 400, maxWidth: '580px' }}>
              A thoughtful, transparent approach grounded in personal guidance and local property knowledge across Sarjapur Road.
            </p>
          </div>

          <div className="reveal-fade-up delay-200" style={{
            background: 'linear-gradient(135deg, rgba(252, 255, 245, 0.82) 0%, rgba(252, 255, 245, 0.6) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(252, 255, 245, 0.85)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem 2rem',
            maxWidth: '460px',
            boxShadow: 'inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.95), 0 8px 24px rgba(72, 82, 28, 0.06)'
          }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-verdun)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '0.35rem' }}>
              Commitment to Service
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--color-muted)', lineHeight: 1.6, margin: 0 }}>
              These four principles define our day-to-day service delivery and client relationships. They reflect our standard of practice rather than automated performance claims.
            </p>
          </div>
        </div>

        {/* Elegant Numbered Editorial Layout with Thin Dividers */}
        <div className="reveal-divider" style={{
          borderTop: '1px solid rgba(72, 82, 28, 0.25)',
          borderBottom: '1px solid rgba(72, 82, 28, 0.25)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            position: 'relative'
          }}>
            {servicePrinciples.map((item, idx) => {
              const delayClass = idx === 0 ? 'delay-100' : idx === 1 ? 'delay-200' : idx === 2 ? 'delay-300' : 'delay-400';
              return (
              <div 
                key={idx}
                className={`reveal-fade-up ${delayClass}`}
                style={{
                  padding: 'clamp(1.75rem, 4vw, 3rem) clamp(1.25rem, 3vw, 2.25rem)',
                  borderRight: idx < 3 ? '1px solid rgba(72, 82, 28, 0.2)' : 'none',
                  borderBottom: '1px solid rgba(72, 82, 28, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative',
                  backgroundColor: 'transparent',
                  borderRadius: 'var(--radius-md)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(252, 255, 245, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div>
                  {/* Large Stylized Number */}
                  <div style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                    color: 'var(--color-verdun)',
                    lineHeight: 1,
                    marginBottom: '1.5rem',
                    fontWeight: 400,
                    letterSpacing: '-0.02em',
                    opacity: 0.95
                  }}>
                    {item.number}
                  </div>

                  {/* Principle Title */}
                  <h3 style={{
                    fontSize: '1.35rem',
                    fontFamily: 'var(--font-serif)',
                    color: 'var(--color-verdun)',
                    lineHeight: 1.3,
                    marginBottom: '0.85rem'
                  }}>
                    {item.title}
                  </h3>

                  {/* Concise Summary */}
                  <p style={{
                    fontSize: '0.98rem',
                    color: 'var(--color-text)',
                    lineHeight: 1.6,
                    fontWeight: 500,
                    marginBottom: '1rem'
                  }}>
                    {item.description}
                  </p>

                  {/* Elaboration */}
                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-muted)',
                    lineHeight: 1.65,
                    margin: 0
                  }}>
                    {item.detail}
                  </p>
                </div>

                {/* Subtle Bottom Accent Indicator */}
                <div style={{
                  marginTop: '2.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--color-verdun)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 600
                }}>
                  <span>Principle {item.number}</span>
                  <ArrowUpRight size={14} style={{ opacity: 0.7, color: 'var(--color-verdun)' }} />
                </div>
              </div>
            );
          })}
          </div>
        </div>

        {/* Bottom Editorial Callout — Liquid Glass Panel */}
        <div className="reveal-scale-in delay-200" style={{
          marginTop: '3.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          padding: '1.75rem 2.25rem',
          background: 'linear-gradient(135deg, rgba(252, 255, 245, 0.88) 0%, rgba(252, 255, 245, 0.68) 100%)',
          backdropFilter: 'blur(20px) saturate(160%)',
          WebkitBackdropFilter: 'blur(20px) saturate(160%)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid rgba(252, 255, 245, 0.9)',
          boxShadow: 'inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.95), 0 8px 24px rgba(72, 82, 28, 0.06)'
        }}>
          <div>
            <div style={{ fontSize: '0.95rem', color: 'var(--color-verdun)', fontWeight: 600 }}>
              Looking for a tailored property consultation?
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--color-muted)', marginTop: '0.2rem' }}>
              Connect with our team to discuss your budget, preferred configuration, and locality preferences.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a 
              href="tel:+919535854614"
              className="btn-outline"
              style={{
                fontSize: '0.82rem',
                padding: '0.65rem 1.25rem',
                backgroundColor: 'transparent'
              }}
            >
              <span>+91 95358 54614</span>
            </a>
            <a 
              href="#contact"
              className="btn-primary"
              style={{
                fontSize: '0.82rem',
                padding: '0.65rem 1.4rem'
              }}
            >
              <span>Request Guidance</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
