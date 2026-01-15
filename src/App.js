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

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
    window.scrollTo(0, 0);
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

  const handleNavClick = (item) => {
    setActiveItem(item);
    setMobileNavOpen(false);
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
