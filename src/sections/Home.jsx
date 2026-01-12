import React from 'react';
import './home.css';

export default function Home() {

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
            <video
              className="home__tvStatic"
              src={`/box-static-2.mp4?v=${Date.now()}`}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            />
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
        <p className="home__copy">
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

