import React from 'react';
import { ArrowRight, MapPin, Compass, ShieldCheck } from 'lucide-react';

export const EditorialIntro: React.FC = () => {
  return (
    <section 
      id="about" 
      className="section-wrapper" 
      style={{
        backgroundColor: 'var(--color-eggshell)',
        color: 'var(--color-text)',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '6.5rem',
        paddingBottom: '6.5rem',
        borderTop: '1px solid var(--color-orinoco)',
        borderBottom: '1px solid var(--color-orinoco)'
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Asymmetric Two-Column Editorial Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: 'clamp(2.5rem, 5vw, 4.5rem)',
          alignItems: 'center'
        }}>
          {/* Left Column: Visual Architectural Composition */}
          <div className="reveal-fade-up" style={{ position: 'relative' }}>
            {/* Primary Main Image with Subtle Mask Framing */}
            <div 
              className="reveal-image-mask"
              style={{
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: '0 20px 48px rgba(37, 40, 25, 0.08)',
                border: '1px solid var(--color-orinoco)',
                position: 'relative',
                backgroundColor: 'var(--color-orinoco)'
              }}
            >
              <img 
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop" 
                alt="Architectural residential interior in Bengaluru" 
                loading="lazy"
                style={{
                  width: '100%',
                  height: '500px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 65%, rgba(37, 40, 25, 0.4) 100%)'
              }} />
            </div>

            {/* Subtle Green Smoke Accent Framing */}
            <div 
              className="accent-corner-frame"
              style={{
                position: 'absolute',
                top: '-0.75rem',
                left: '-0.75rem',
                width: '80px',
                height: '80px',
                borderTop: '2px solid var(--color-green-smoke)',
                borderLeft: '2px solid var(--color-green-smoke)',
                borderTopLeftRadius: 'var(--radius-xl)',
                zIndex: -1,
                opacity: 0.75
              }} 
            />

            {/* Clean Location Tag Card — Liquid Glass Panel */}
            <div 
              className="reveal-scale-in delay-250 editorial-location-tag"
              style={{
                position: 'absolute',
                bottom: '-1.25rem',
                right: 'clamp(0rem, 2vw, -0.75rem)',
                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.85) 0%, rgba(252, 255, 245, 0.65) 100%)',
                backdropFilter: 'blur(20px) saturate(160%)',
                WebkitBackdropFilter: 'blur(20px) saturate(160%)',
                border: '1px solid rgba(219, 218, 175, 0.6)',
                borderRadius: 'var(--radius-md)',
                padding: '1.15rem 1.35rem',
                maxWidth: 'min(280px, calc(100% - 1rem))',
                boxShadow: 'inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.95), 0 16px 36px rgba(37, 40, 25, 0.08)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-verdun)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
                <MapPin size={14} style={{ color: 'var(--color-green-smoke)' }} />
                <span>Advisory Office</span>
              </div>
              <div style={{ fontSize: '0.92rem', color: 'var(--color-text)', fontWeight: 600, lineHeight: 1.4 }}>
                6, 5th Main Road, Amrita Nagar, Halanayakanahalli
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)', marginTop: '0.25rem' }}>
                Sarjapur Road, Bengaluru 560035
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Narrative */}
          <div>
            {/* Eyebrow */}
            <div className="eyebrow reveal-fade-up">
              A MORE PERSONAL PROPERTY EXPERIENCE
            </div>

            {/* Headline */}
            <h2 className="section-title-charcoal reveal-fade-up delay-100" style={{ fontSize: 'clamp(2.3rem, 4.6vw, 3.6rem)', lineHeight: 1.16 }}>
              Finding the Right Space Starts with the Right Guidance.
            </h2>

            {/* Supporting Copy */}
            <p className="reveal-fade-up delay-150" style={{
              fontSize: '1.18rem',
              color: 'var(--color-text)',
              lineHeight: 1.8,
              marginBottom: '1.75rem',
              fontWeight: 400
            }}>
              Whether you're exploring rental homes or looking for a property that fits your needs, Sri Balaji Real Estate helps you navigate your search with a more personal approach.
            </p>

            <p className="reveal-fade-up delay-200" style={{
              fontSize: '0.96rem',
              color: 'var(--color-muted)',
              lineHeight: 1.75,
              marginBottom: '2.5rem'
            }}>
              Based on 5th Main Road in Amrita Nagar, we offer localized assistance across Sarjapur Road, Halanayakanahalli, and nearby residential neighbourhoods. We listen closely to your space and budget requirements, guiding you through genuine options without pressure or ambiguity.
            </p>

            {/* Service Pillars Overview — Translucent Glass Panels */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2.5rem'
            }}>
              <div className="reveal-fade-up delay-250" style={{
                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.78) 0%, rgba(252, 255, 245, 0.52) 100%)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(219, 218, 175, 0.55)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                boxShadow: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.9), 0 4px 14px rgba(37, 40, 25, 0.04)'
              }}>
                <div style={{ 
                  display: 'inline-block',
                  fontSize: '0.72rem', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.1em', 
                  color: 'var(--color-verdun)', 
                  fontWeight: 700, 
                  background: 'rgba(219, 218, 175, 0.35)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-pill)',
                  marginBottom: '0.5rem' 
                }}>
                  Attentive
                </div>
                <div style={{ fontSize: '0.95rem', color: 'var(--color-text)', fontWeight: 600 }}>
                  Personal Support
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginTop: '0.2rem', lineHeight: 1.5 }}>
                  Assistance tailored to your search criteria.
                </div>
              </div>

              <div className="reveal-fade-up delay-300" style={{
                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.78) 0%, rgba(252, 255, 245, 0.52) 100%)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(219, 218, 175, 0.55)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                boxShadow: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.9), 0 4px 14px rgba(37, 40, 25, 0.04)'
              }}>
                <div style={{ 
                  display: 'inline-block',
                  fontSize: '0.72rem', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.1em', 
                  color: 'var(--color-verdun)', 
                  fontWeight: 700, 
                  background: 'rgba(219, 218, 175, 0.35)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-pill)',
                  marginBottom: '0.5rem' 
                }}>
                  Transparent
                </div>
                <div style={{ fontSize: '0.95rem', color: 'var(--color-text)', fontWeight: 600 }}>
                  Clear Communication
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginTop: '0.2rem', lineHeight: 1.5 }}>
                  Straightforward information at every step.
                </div>
              </div>
            </div>

            {/* Direct Action Link */}
            <div className="reveal-fade-up delay-350" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              <a 
                href="#properties" 
                className="btn-primary"
              >
                <span>Explore Curated Properties</span>
                <span className="btn-arrow">
                  <ArrowRight size={15} />
                </span>
              </a>

              <a 
                href="tel:+919535854614"
                style={{
                  color: 'var(--color-verdun)',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'opacity var(--transition-fast)'
                }}
              >
                <span>Call Advisory: +91 95358 54614</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
