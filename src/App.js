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
  const mainRef = useRef(null);

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [activeItem]);

  return (
    <div className="App">
      <header className="vp-brand">
        <h1 className="vp-logo">Vonix Productions</h1>
        <span className="vp-rule" aria-hidden="true" />
        <nav className="vp-nav">
          <button type="button" className={`nav-link ${activeItem === 'home' ? 'active' : ''}`} onClick={() => setActiveItem('home')}>Home</button>
          <button type="button" className={`nav-link ${activeItem === 'vonix' ? 'active' : ''}`} onClick={() => setActiveItem('vonix')}>Vonix</button>
          <button type="button" className={`nav-link ${activeItem === 'blaze' ? 'active' : ''}`} onClick={() => setActiveItem('blaze')}>Blaze</button>
          <button type="button" className={`nav-link ${activeItem === 'marketing-alliance' ? 'active' : ''}`} onClick={() => setActiveItem('marketing-alliance')}>Marketing Alliance</button>
          <button type="button" className={`nav-link ${activeItem === 'austin-underground' ? 'active' : ''}`} onClick={() => setActiveItem('austin-underground')}>Austin Underground</button>
          <button type="button" className={`nav-link ${activeItem === 'other-channels' ? 'active' : ''}`} onClick={() => setActiveItem('other-channels')}>Other Channels</button>
          <button type="button" className={`nav-link ${activeItem === 'about-me' ? 'active' : ''}`} onClick={() => setActiveItem('about-me')}>About me</button>
          <button type="button" className={`nav-link ${activeItem === 'contact' ? 'active' : ''}`} onClick={() => setActiveItem('contact')}>Contact</button>
        </nav>
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
