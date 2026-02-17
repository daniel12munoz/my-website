import React, { useEffect } from 'react';
import './otherChannels.css';

export default function OtherChannels() {
  useEffect(() => {
    document.body.classList.add('no-scroll-otherchannels');
    return () => {
      document.body.classList.remove('no-scroll-otherchannels');
    };
  }, []);

  return (
    <section className="otherChannels">
      <div className="otherChannels__spotlight" aria-hidden="true"></div>

      <div className="otherChannels__frame">
        <header className="otherChannels__hero">
          <div className="otherChannels__stats">
            <div className="otherChannels__heroLine1">
              <strong>46,637,987</strong> Total Views
            </div>
            <div className="otherChannels__heroLine2">
              Across <strong>10 Channels</strong>
            </div>
          </div>
        </header>

        <footer className="otherChannels__bottom">
          <p className="otherChannels__copy">
            In addition to the primary projects, Vonix Productions serves as the creative and production backbone for a network of digital media channels across multiple genres, including <strong>travel</strong>, <strong>fashion</strong>, <strong>gaming</strong>, <strong>celebrity news</strong>, <strong>entertainment</strong>, <strong>business</strong>, and <strong>horror</strong>. These channels are developed and produced collaboratively with teams of editors, writers, and producers. Together, these channels have amassed tens of millions of views, reflecting over a decade of hands-on experience, scaling content across platforms and genres.
          </p>
        </footer>
      </div>
    </section>
  );
}
