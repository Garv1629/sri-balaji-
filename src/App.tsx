import React, { useState, useEffect } from 'react';
import { Property, PropertyCategory } from './types/property';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { EditorialIntro } from './components/EditorialIntro';
import { PropertyDiscovery } from './components/PropertyDiscovery';
import { WhyChooseUs } from './components/WhyChooseUs';
import { LocalitySection } from './components/LocalitySection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { EnquirySection } from './components/EnquirySection';
import { Footer } from './components/Footer';
import { PropertyModal } from './components/PropertyModal';
import { EnquiryModal } from './components/EnquiryModal';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';

export const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<PropertyCategory>('all');
  const [activePropertyModal, setActivePropertyModal] = useState<Property | null>(null);
  const [enquiryProperty, setEnquiryProperty] = useState<Property | null>(null);
  const [enquiryPropertyTitle, setEnquiryPropertyTitle] = useState<string>('');
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  const handleOpenEnquiry = (propertyOrTitle?: Property | string) => {
    if (typeof propertyOrTitle === 'object' && propertyOrTitle !== null) {
      setEnquiryProperty(propertyOrTitle);
      setEnquiryPropertyTitle(propertyOrTitle.title);
    } else {
      setEnquiryPropertyTitle(propertyOrTitle || '');
      setEnquiryProperty(null);
    }
    setIsEnquiryModalOpen(true);
  };

  // Step 10: Production-Quality Cinematic Scroll Animation Observer
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const selector = '.reveal-fade-up, .reveal-fade-in, .reveal-scale-in, .reveal-image-mask, .reveal-divider';
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      document.querySelectorAll(selector).forEach((el) => {
        el.classList.add('is-visible');
      });
      return;
    }

    try {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { 
          threshold: window.innerWidth < 768 ? 0.05 : 0.12, 
          rootMargin: '0px 0px -35px 0px' 
        }
      );

      // Initial observation
      document.querySelectorAll(selector).forEach((el) => observer.observe(el));

      // Dynamic MutationObserver to catch dynamically rendered cards (filters, search, modals)
      const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              const element = node as HTMLElement;
              if (element.matches && element.matches(selector)) {
                observer.observe(element);
              }
              element.querySelectorAll?.(selector).forEach((child) => {
                observer.observe(child);
              });
            }
          });
        });
      });

      mutationObserver.observe(document.body, { childList: true, subtree: true });

      return () => {
        observer.disconnect();
        mutationObserver.disconnect();
      };
    } catch (e) {
      document.querySelectorAll(selector).forEach((el) => {
        el.classList.add('is-visible');
      });
    }
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sticky Adapted Luxury Navigation */}
      <Navbar onOpenEnquiry={() => handleOpenEnquiry()} />

      {/* Main Content Landmark */}
      <main id="main-content">
        {/* 1. Cinematic Hero with Architectural Visual & Scroll Transition */}
        <Hero 
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          onOpenEnquiry={() => handleOpenEnquiry()}
        />

        {/* 2. Editorial Introduction to Sri Balaji Real Estate */}
        <EditorialIntro />

        {/* 3. Property Discovery & Category Filter Portfolio */}
        <PropertyDiscovery 
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          onSelectProperty={(prop) => setActivePropertyModal(prop)}
          onEnquire={(title) => handleOpenEnquiry(title)}
        />

        {/* 4. Locality & Neighbourhood: Sarjapur Road Corridor */}
        <LocalitySection />

        {/* 5. Why Choose Us: Transparent Assistance & Legal Vetting */}
        <WhyChooseUs />

        {/* 6. Customer Testimonials: Genuine Google 5.0 Rating (68 Reviews) */}
        <TestimonialsSection />

        {/* 7. Bespoke Consultation & Working Contact Form with IndexedDB Persistence */}
        <EnquirySection 
          initialProperty={enquiryPropertyTitle} 
          selectedPropertyObj={enquiryProperty}
        />
      </main>

      {/* 8. Detailed Architectural Footer */}
      <Footer />

      {/* Floating Action Elements */}
      <WhatsAppFloatingButton />

      {/* Interactive Modal Dossier for Property Details */}
      <PropertyModal 
        property={activePropertyModal}
        onClose={() => setActivePropertyModal(null)}
        onEnquire={(title) => handleOpenEnquiry(activePropertyModal || title)}
      />

      {/* Interactive Modal for Quick Consultation Mandates */}
      <EnquiryModal 
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        prefilledProperty={enquiryPropertyTitle}
        prefilledPropertyId={enquiryProperty?.id}
        prefilledLocation={enquiryProperty?.location}
        prefilledConfiguration={enquiryProperty?.configuration}
      />
    </div>
  );
};

export default App;
