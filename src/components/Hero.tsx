import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';

import { PropertyCategory } from '../types/property';

interface HeroProps {
  onOpenEnquiry: (propertyTitle?: string) => void;
  onSelectCategory?: (cat: PropertyCategory) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenEnquiry }) => {
  const [scrollY, setScrollY] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    let cleanupMedia: (() => void) | undefined;
    if (typeof window !== 'undefined' && window.matchMedia) {
      try {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setIsReducedMotion(mediaQuery.matches);

        const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
          setIsReducedMotion('matches' in e ? e.matches : (e as MediaQueryList).matches);
        };

        if (mediaQuery.addEventListener) {
          mediaQuery.addEventListener('change', handleMediaChange as any);
          cleanupMedia = () => mediaQuery.removeEventListener('change', handleMediaChange as any);
        } else if ((mediaQuery as any).addListener) {
          (mediaQuery as any).addListener(handleMediaChange);
          cleanupMedia = () => (mediaQuery as any).removeListener(handleMediaChange);
        }
      } catch (err) {
        console.warn('matchMedia error:', err);
      }
    }

    // Subtle restrained parallax on desktop only
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (cleanupMedia) cleanupMedia();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Compute subtle parallax translate (clamped, max 80px)
  const parallaxOffset = isReducedMotion ? 0 : Math.min(scrollY * 0.28, 80);

  const scrollToAbout = () => {
    const el = document.getElementById('about');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      style={{
        padding: '0.65rem clamp(0.65rem, 2vw, 1.25rem) 1.5rem',
        backgroundColor: 'var(--color-eggshell)',
        position: 'relative'
      }}
    >
      <section 
        id="hero"
        style={{
          position: 'relative',
          minHeight: 'calc(100svh - 2rem)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
          color: 'var(--ivory-pure)',
          borderRadius: 'var(--radius-2xl)',
          border: '1px solid var(--color-orinoco)',
          boxShadow: '0 24px 60px rgba(37, 40, 25, 0.16)'
        }}
        aria-label="Welcome to Sri Balaji Real Estate"
      >
        {/* 1. Cinematic Architectural Background Image with Parallax & Masks */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            overflow: 'hidden',
            backgroundColor: '#0F1013',
            borderRadius: 'inherit'
          }}
          aria-hidden="true"
        >
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop" 
            alt="Modern architectural luxury residence in Bengaluru" 
            loading="eager"
            // @ts-ignore
            fetchpriority="high"
            className="hero-img-animated"
            style={{
              width: '100%',
              height: '115%',
              objectFit: 'cover',
              objectPosition: 'center 38%',
              filter: 'brightness(0.68) contrast(1.08)',
              transform: `translateY(${parallaxOffset}px) scale(1.02)`,
              transition: 'transform 0.1s cubic-bezier(0.16, 1, 0.3, 1), filter 1.2s ease',
              willChange: 'transform'
            }}
          />

          {/* Verdun Green subtle architectural overlay for optimal legibility */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(37, 40, 25, 0.72) 0%, rgba(72, 82, 28, 0.38) 45%, rgba(37, 40, 25, 0.88) 85%, var(--color-text) 100%)'
          }} />

          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 25% 45%, transparent 25%, rgba(37, 40, 25, 0.7) 100%)'
          }} />
        </div>

        {/* 2. Top Spacer to balance floating pill navigation */}
        <div style={{ height: '5rem' }} aria-hidden="true" />

        {/* 3. Main Hero Content — Asymmetric Editorial Alignment */}
        <div 
          className="container" 
          style={{
            position: 'relative',
            zIndex: 10,
            paddingTop: '1.5rem',
            paddingBottom: '2.5rem',
            maxWidth: '1280px',
            width: '100%'
          }}
        >
          <div style={{ maxWidth: '820px' }}>
            {/* Eyebrow */}
            <div className="hero-enter-1" style={{ marginBottom: '1.25rem' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                fontSize: '0.78rem',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: 'var(--color-orinoco)',
                fontWeight: 600
              }}>
                <span style={{
                  width: '28px',
                  height: '1.5px',
                  background: 'var(--color-green-smoke)',
                  display: 'inline-block'
                }} />
                REAL ESTATE • BENGALURU
              </span>
            </div>

            {/* Main Headline in Eggshell */}
            <h1 
              className="hero-enter-2"
              style={{
                fontSize: 'clamp(2.15rem, 6.2vw, 5.4rem)',
                fontFamily: 'var(--font-serif)',
                fontWeight: 400,
                lineHeight: 1.08,
                color: 'var(--color-eggshell)',
                letterSpacing: '-0.025em',
                marginBottom: '1.75rem',
                textShadow: '0 4px 24px rgba(37, 40, 25, 0.7)'
              }}
            >
              Find a Place <br />
              <span style={{
                fontStyle: 'italic',
                fontFamily: 'var(--font-serif)',
                color: 'var(--color-orinoco)',
                fontWeight: 400
              }}>
                That Feels Like Home.
              </span>
            </h1>

            {/* Supporting Text */}
            <p 
              className="hero-enter-3"
              style={{
                fontSize: 'clamp(1.05rem, 1.8vw, 1.28rem)',
                color: 'rgba(252, 255, 245, 0.92)',
                lineHeight: 1.7,
                maxWidth: '620px',
                fontWeight: 300,
                marginBottom: '2.5rem',
                textShadow: '0 2px 12px rgba(37, 40, 25, 0.6)'
              }}
            >
              Thoughtful property assistance for finding a space that fits your lifestyle. Based on Sarjapur Road, Sri Balaji Real Estate helps you discover verified residences with legal integrity and personal care.
            </p>

            {/* Call to Actions — Fully Pill-Shaped */}
            <div 
              className="hero-enter-4"
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.1rem'
              }}
            >
              <a 
                href="#properties"
                className="btn-primary"
                style={{
                  padding: '1.05rem 2.2rem',
                  fontSize: '0.88rem',
                  borderRadius: 'var(--radius-pill)',
                  boxShadow: '0 8px 24px rgba(72, 82, 28, 0.4)'
                }}
              >
                <span>EXPLORE PROPERTIES</span>
                <span className="btn-arrow">
                  <ArrowRight size={16} />
                </span>
              </a>

              <button 
                onClick={() => onOpenEnquiry()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1.05rem 2.2rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--color-green-smoke)',
                  color: 'var(--color-eggshell)',
                  background: 'rgba(72, 82, 28, 0.35)',
                  backdropFilter: 'blur(8px)',
                  transition: 'all var(--transition-smooth)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--color-verdun)';
                  e.currentTarget.style.borderColor = 'var(--color-orinoco)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(72, 82, 28, 0.35)';
                  e.currentTarget.style.borderColor = 'var(--color-green-smoke)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>TALK TO OUR TEAM</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4. Minimal Scroll Indicator — Fully Pill-Shaped */}
        <div 
          className="hero-enter-5"
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: '2.5rem',
            cursor: 'pointer'
          }}
          onClick={scrollToAbout}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              scrollToAbout();
            }
          }}
          aria-label="Scroll down to introduction"
        >
          <span style={{
            fontSize: '0.7rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--color-orinoco)',
            marginBottom: '0.5rem',
            fontWeight: 600,
            transition: 'color var(--transition-fast)'
          }}>
            SCROLL TO EXPLORE
          </span>

          {/* Minimal Scroll Pill */}
          <div 
            className="scroll-indicator-bob"
            style={{
              width: '22px',
              height: '36px',
              borderRadius: 'var(--radius-pill)',
              border: '1.5px solid var(--color-green-smoke)',
              display: 'flex',
              justifyContent: 'center',
              paddingTop: '6px',
              background: 'rgba(72, 82, 28, 0.45)',
              backdropFilter: 'blur(4px)'
            }}
          >
            <div style={{
              width: '3px',
              height: '8px',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--color-orinoco)'
            }} />
          </div>
        </div>

        {/* Mobile border-radius override */}
        <style>{`
          @media (max-width: 768px) {
            #hero {
              border-radius: var(--radius-md) !important;
            }
          }
        `}</style>
      </section>
    </div>
  );
};
