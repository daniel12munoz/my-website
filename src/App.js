import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Home from './sections/Home';
import AustinUnderground from './sections/AustinUnderground';
import MarketingAlliance from './sections/MarketingAlliance';
import Blaze from './sections/Blaze';
import Vonix from './sections/Vonix';
import OtherChannels from './sections/OtherChannels';
import AboutMe from './sections/AboutMe';
import Contact from './sections/Contact';

function App() {
  const [activeItem, setActiveItem] = useState('home');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const mainRef = useRef(null);

  // Helper functions for mobile scroll reset
  const clearScrollLock = () => {
    document.documentElement.classList.remove('menu-open', 'no-scroll');
    document.body.classList.remove('menu-open', 'no-scroll', 'nav-open');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
  };

  const scrollToTopNow = () => {
    // covers Safari/Chrome quirks
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  };

  // Scroll to top on ALL devices when route changes
  // Mobile-only: also clear scroll lock
  useEffect(() => {
    const isMobile =
      window.matchMedia('(max-width: 600px)').matches ||
      window.matchMedia('(pointer: coarse)').matches;

    // Mobile-only: clear scroll lock (hamburger menu bug fix)
    if (isMobile) {
      clearScrollLock();
    }

    // ALL devices: scroll to top on route change
    // Defer to allow route paint, prevents weird "stuck" bottom scroll
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToTopNow();
      });
    });
  }, [activeItem]);

  // Handle body scroll lock when mobile nav is open
  useEffect(() => {
    if (mobileNavOpen) {
      document.body.classList.add('nav-open');
    } else {
      document.body.classList.remove('nav-open');
    }
    return () => {
      document.body.classList.remove('nav-open');
    };
  }, [mobileNavOpen]);

  // Detect macOS desktop and add class to html element
  useEffect(() => {
    const platform = navigator.platform || '';
    const ua = navigator.userAgent || '';
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    const isMac = !isIOS && (/Macintosh|MacIntel|MacPPC|Mac68K/i.test(platform) || /Mac OS X/i.test(ua));
    const isDesktopPointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;

    if (isMac && isDesktopPointer) {
      document.documentElement.classList.add('os-mac');
    } else {
      document.documentElement.classList.remove('os-mac');
    }

    return () => document.documentElement.classList.remove('os-mac');
  }, []);

  const handleNavClick = (item) => {
    setMobileNavOpen(false);

    const isMobile =
      window.matchMedia('(max-width: 600px)').matches ||
      window.matchMedia('(pointer: coarse)').matches;

    // Mobile-only: clear scroll lock (hamburger menu bug fix)
    if (isMobile) {
      clearScrollLock();
    }

    // ALL devices: scroll to top when navigating
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToTopNow();
      });
    });

    setActiveItem(item);
  };

  return (
    <div className="App">
      {/* Mobile hamburger button */}
      <button
        className="vp-mobile-menu-toggle"
        type="button"
        onClick={() => setMobileNavOpen(prev => !prev)}
        aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
      >
        ☰
      </button>

      {/* Mobile overlay */}
      {mobileNavOpen && (
        <div
          className="vp-mobile-overlay"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar/Drawer */}
      <header className={`vp-brand ${mobileNavOpen ? 'vp-brand--open' : ''}`}>
        <div className="vp-brand-inner">
          <h1 className="vp-logo">Vonix Productions</h1>
          <span className="vp-rule" aria-hidden="true" />
          <nav className="vp-nav">
            <button type="button" className={`nav-link ${activeItem === 'home' ? 'active' : ''}`} onClick={() => handleNavClick('home')}>Home</button>
            <button type="button" className={`nav-link ${activeItem === 'vonix' ? 'active' : ''}`} onClick={() => handleNavClick('vonix')}>Vonix</button>
            <button type="button" className={`nav-link ${activeItem === 'blaze' ? 'active' : ''}`} onClick={() => handleNavClick('blaze')}>Blaze</button>
            <button type="button" className={`nav-link ${activeItem === 'marketing-alliance' ? 'active' : ''}`} onClick={() => handleNavClick('marketing-alliance')}>Marketing Alliance</button>
            <button type="button" className={`nav-link ${activeItem === 'austin-underground' ? 'active' : ''}`} onClick={() => handleNavClick('austin-underground')}>Austin Underground</button>
            <button type="button" className={`nav-link ${activeItem === 'other-channels' ? 'active' : ''}`} onClick={() => handleNavClick('other-channels')}>Other Channels</button>
            <button type="button" className={`nav-link ${activeItem === 'about-me' ? 'active' : ''}`} onClick={() => handleNavClick('about-me')}>About me</button>
            <button type="button" className={`nav-link ${activeItem === 'contact' ? 'active' : ''}`} onClick={() => handleNavClick('contact')}>Contact</button>
          </nav>
        </div>
      </header>
      <main
        ref={mainRef}
        className={
          activeItem === 'home'
            ? 'vp-main vp-main--home'
            : activeItem === 'other-channels'
            ? 'vp-main vp-main--other'
            : activeItem === 'about-me'
            ? 'vp-main vp-main--about'
            : activeItem === 'contact'
            ? 'vp-main vp-main--contact'
            : 'vp-main'
        }
      >
        {activeItem === 'home' ? <Home /> : null}
        {activeItem === 'marketing-alliance' ? <MarketingAlliance /> : null}
        {activeItem === 'austin-underground' ? <AustinUnderground /> : null}
        {activeItem === 'blaze' ? <Blaze /> : null}
        {activeItem === 'vonix' ? <Vonix /> : null}
        {activeItem === 'other-channels' ? <OtherChannels /> : null}
        {activeItem === 'about-me' ? <AboutMe /> : null}
        {activeItem === 'contact' ? <Contact /> : null}
      </main>
    </div>
  );
}

export default App;
