import React, { useState, useEffect } from 'react';
import { MessageSquare, Phone, MapPin, X } from 'lucide-react';

export const WhatsAppFloatingButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isNearBottom, setIsNearBottom] = useState(false);

  const phoneTel = "tel:+919535854614";
  const whatsappUrl = "https://wa.me/919535854614?text=Hello%20Sri%20Balaji%20Real%20Estate,%20I%20would%20like%20to%20consult%20regarding%20properties%20on%20Sarjapur%20Road.";

  useEffect(() => {
    const handleScroll = () => {
      // Check if user is near the footer to avoid obstructing footer links
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      
      if (documentHeight - (scrollTop + windowHeight) < 120) {
        setIsNearBottom(true);
      } else {
        setIsNearBottom(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* 1. Desktop Floating Contact Action (Hidden on mobile) */}
      <aside 
        aria-label="Direct Advisory Contacts" 
        className="desktop-sticky-contact"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 85,
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          transition: 'transform 0.3s ease, opacity 0.3s ease',
          opacity: isNearBottom ? 0.85 : 1
        }}
      >
        {/* Direct Call Button — Liquid Glass Pill */}
        <a 
          href={phoneTel}
          aria-label="Call Sri Balaji Real Estate at +91 95358 54614"
          style={{
            height: '46px',
            borderRadius: 'var(--radius-pill)',
            background: 'rgba(252, 255, 245, 0.78)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(252, 255, 245, 0.85)',
            color: 'var(--color-verdun)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0 1.25rem',
            boxShadow: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.9), 0 8px 24px rgba(37, 40, 25, 0.15)',
            fontSize: '0.84rem',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.borderColor = 'var(--color-green-smoke)';
            e.currentTarget.style.boxShadow = 'inset 0 1px 1.5px 0 rgba(255, 255, 255, 1), 0 12px 28px rgba(37, 40, 25, 0.22)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(252, 255, 245, 0.85)';
            e.currentTarget.style.boxShadow = 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.9), 0 8px 24px rgba(37, 40, 25, 0.15)';
          }}
        >
          <Phone size={15} style={{ color: 'var(--color-verdun)' }} />
          <span>Call Desk</span>
        </a>

        {/* WhatsApp Button */}
        <a 
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Sri Balaji Real Estate on WhatsApp"
          style={{
            height: '46px',
            borderRadius: 'var(--radius-pill)',
            background: '#25D366',
            color: '#0D2314',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.55rem',
            padding: '0 1.35rem',
            boxShadow: '0 8px 24px rgba(37, 211, 102, 0.35)',
            fontWeight: 700,
            fontSize: '0.84rem',
            textDecoration: 'none',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(37, 211, 102, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 211, 102, 0.35)';
          }}
        >
          <MessageSquare size={17} />
          <span>WhatsApp</span>
        </a>
      </aside>

      {/* 2. Mobile Compact Bottom Contact Bar (Hidden on desktop) */}
      <nav 
        aria-label="Mobile Quick Contact Actions" 
        className="mobile-sticky-bar"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 85,
          background: 'rgba(252, 255, 245, 0.82)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          borderTop: '1px solid rgba(252, 255, 245, 0.7)',
          borderTopLeftRadius: 'var(--radius-lg)',
          borderTopRightRadius: 'var(--radius-lg)',
          padding: '0.75rem 1rem max(0.75rem, env(safe-area-inset-bottom))',
          boxShadow: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.85), 0 -4px 24px rgba(37, 40, 25, 0.12)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}
      >
        {/* Mobile Call CTA */}
        <a 
          href={phoneTel}
          className="btn-outline"
          aria-label="Call +91 95358 54614"
          style={{
            flex: 1,
            height: '44px',
            padding: '0 0.85rem',
            justifyContent: 'center',
            fontSize: '0.82rem',
            color: 'var(--color-verdun)',
            borderColor: 'var(--color-green-smoke)',
            background: 'var(--color-eggshell)'
          }}
        >
          <Phone size={15} />
          <span>Call Desk</span>
        </a>

        {/* Mobile WhatsApp CTA */}
        <a 
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp"
          aria-label="Chat on WhatsApp with Sri Balaji Real Estate"
          style={{
            flex: 1.25,
            height: '44px',
            padding: '0 0.85rem',
            justifyContent: 'center',
            fontSize: '0.82rem'
          }}
        >
          <MessageSquare size={16} />
          <span>WhatsApp</span>
        </a>
      </nav>

      {/* Responsive Styles */}
      <style>{`
        @media (min-width: 768px) {
          .mobile-sticky-bar { display: none !important; }
          .desktop-sticky-contact { display: flex !important; }
        }
        @media (max-width: 767px) {
          .desktop-sticky-contact { display: none !important; }
          .mobile-sticky-bar { display: flex !important; }
          body { padding-bottom: 58px; }
        }
      `}</style>
    </>
  );
};
