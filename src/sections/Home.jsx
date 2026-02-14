import React, { useEffect } from 'react';
import './home.css';
import HlsVideo from '../components/HlsVideo';

const MOBILE_BREAKPOINT = '(max-width: 600px)';

export default function Home() {
  useEffect(() => {
    const isMobile =
      typeof window !== 'undefined' && window.matchMedia(MOBILE_BREAKPOINT).matches;
    if (isMobile) {
      document.documentElement.classList.add('mobile-home-locked');
      document.body.classList.add('mobile-home-locked');
    }
    return () => {
      document.documentElement.classList.remove('mobile-home-locked');
      document.body.classList.remove('mobile-home-locked');
    };
  }, []);

  return (
    <div className="mobileHomeViewport">
      <div className="mobileHomeGroup">
        <section
          id="home"
          className="home au"
        >
          <div className="home__spotlight" aria-hidden="true"></div>

          <div className="home__stage">
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
              hero
              lazy={false}
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
                hero
                lazy={false}
              />
            </div>

            {/* Tablet/Laptop masked TV screen (601–1440px only) */}
            <div className="home__tvScreenTL" aria-hidden="true">
              <HlsVideo
                className="home__tvStaticScreenTL"
                src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/ec00cd5eef23481e587f6bd15263546b/manifest/video.m3u8"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                priority
                hero
                lazy={false}
              />
            </div>

            <img
              className="home__heroImg"
              src="/vonixproductions-homelogo.png"
              alt="A desk with a TV, camera, and microphone"
              loading="eager"
              fetchPriority="high"
              decoding="sync"
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
            It serves as the professional portfolio and authorship of{" "}
            <strong className="home__noBreakName">Daniel Muñoz</strong>.
          </span>
        </p>
      </footer>
          </div>
    </section>
      </div>
    </div>
  );
}

