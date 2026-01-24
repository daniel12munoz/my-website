import React, { useEffect, useRef } from 'react';
import './home.css';
import HlsVideo from '../components/HlsVideo';

export default function Home() {
  // Lock scrolling on mobile (real iPhones) using position:fixed technique
  // This prevents scroll WITHOUT clipping the spotlight blur shadow
  const scrollYRef = useRef(0);

  useEffect(() => {
    // Only apply on mobile (max-width: 600px)
    const mediaQuery = window.matchMedia('(max-width: 600px)');
    
    const lockScroll = () => {
      if (!mediaQuery.matches) return; // Desktop: do nothing

      // Save current scroll position
      scrollYRef.current = window.scrollY;

      // Freeze the page using position:fixed
      document.documentElement.style.height = '100%';
      document.body.style.height = '100%';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.body.style.overscrollBehavior = 'none';
    };

    const unlockScroll = () => {
      // Clear all styles
      document.documentElement.style.height = '';
      document.body.style.height = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.touchAction = '';
      document.body.style.overscrollBehavior = '';

      // Restore scroll position
      window.scrollTo(0, scrollYRef.current);
    };

    // Lock on mount if mobile
    lockScroll();

    // Cleanup on unmount
    return () => {
      unlockScroll();
    };
  }, []);

  return (
    <section
      id="home"
      className="home au"
    >
      <div className="home__spotlight" aria-hidden="true"></div>

      <header className="home__top">
        <h1 className="home__headline">
          Let's create <span className="home__it">it</span>.
        </h1>
      </header>

      <main className="home__center">
        <figure className="home__heroArt" aria-label="Home hero illustration">
          <div className="home__heroComposite">
            {/* Desktop static (original behavior) */}
            <HlsVideo
              className="home__tvStatic"
              src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/ec00cd5eef23481e587f6bd15263546b/manifest/video.m3u8"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              priority
            />

            {/* Mobile static clipped to TV screen */}
            <div className="home__tvScreen" aria-hidden="true">
              <HlsVideo
                className="home__tvStaticScreen"
                src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/ec00cd5eef23481e587f6bd15263546b/manifest/video.m3u8"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                priority
              />
            </div>

            <img
              className="home__heroImg"
              src="/vonixproductions-homelogo.png"
              alt="A desk with a TV, camera, and microphone"
              loading="eager"
              decoding="async"
            />
          </div>
        </figure>
      </main>

      <footer className="home__bottom">
        <p className="home__copy home__description">
          <span className="home__copyLine">
            <strong>Vonix Productions</strong> is a creator-led production company focused on original media and visual storytelling.
          </span>
          <span className="home__copyLine">
            It serves as the professional portfolio and authorship of <strong>Daniel Muñoz</strong>.
          </span>
        </p>
      </footer>
    </section>
  );
}

