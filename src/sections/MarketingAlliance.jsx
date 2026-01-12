import React, { useState } from 'react';
import './marketing.css';
import PlayToggleVideo from '../components/PlayToggleVideo';

const Vid = ({ src, className = '' }) => (
  <div className={`media media--video ${className}`.trim()}>
    <video
      className="ma__video ma__videoEl"
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      controls={false}
    />
  </div>
);

const Img = ({ src, className = '', alt = '' }) => (
  <img className={`media ${className}`.trim()} src={src} alt={alt} loading="lazy" />
);

export default function MarketingAlliance() {
  const [activeMAClipId, setActiveMAClipId] = useState(null);

  return (
    <section id="marketing-alliance" className="ma au">
      {/* ROW 1 — Video left, Heading/Role + Circular Logo right */}
      <div className="ma__row1">
        <div className="ma__videoBlock">
          <video
            className="media media--video ma__heroVideo"
            src="/ma-video1.webm"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            controls={false}
            aria-hidden="true"
          />
          <a
            className="ma__link"
            href="https://www.marketingallianceinc.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            marketingallianceinc.com/
          </a>
          <span className="ma__linkRule" />
        </div>

        <div className="ma__heading">
          <h2 className="ma__title">Marketing Alliance</h2>
          <span className="ma__rule ruleFade--left" />
          <div className="ma__roles">
            Videographer / Editor • Dec 2024 – Present
          </div>

          <div className="ma__logoWrap">
            <Img src="/ma-image1.png" className="ma__logo" alt="Marketing Alliance logo" />
          </div>
        </div>
      </div>

      {/* ROW 2 — Paragraph under the video (left column width) */}
      <div className="ma__row2 au-grid">
        <div className="ma__colText">
          <p className="ma__desc">
            Marketing Alliance is an economic development marketing company that has helped transform over
            450 communities into prosperous, thriving economic engines.
          </p>
        </div>
        <div className="ma__colRight" aria-hidden="true" />
      </div>

      {/* LOOPING HEADERS */}
      <div className="ma__fold ma__testimonials">
        <div className="ma__subhead ma__subhead--left">
          <h3>Looping Headers</h3>
          <span className="ma__rule ruleFade--right" />
        </div>

        <div className="ma__videoGrid ma__videoGrid--quad">
          <div className="ma__videoBox"><Vid src="/ma-video2.webm" /></div>
          <div className="ma__videoBox"><Vid src="/ma-video3.webm" /></div>
          <div className="ma__videoBox"><Vid src="/ma-video4.webm" /></div>
          <div className="ma__videoBox"><Vid src="/ma-video5.webm" /></div>
        </div>
      </div>

      {/* PHOTOGRAPHY — two strips */}
      <div className="ma__fold ma__photos">
        <div className="ma__subhead ma__subhead--right">
          <h3>Photography</h3>
          <span className="ma__rule ruleFade--left" />
        </div>

        <div className="ma__photoStrip">
          <Img src="/ma-image2.jpg" alt="Marketing Alliance photo 2" />
          <Img src="/ma-image3.jpg" alt="Marketing Alliance photo 3" />
          <Img src="/ma-image4.jpg" alt="Marketing Alliance photo 4" />
          <Img src="/ma-image5.jpg" alt="Marketing Alliance photo 5" />
          <Img src="/ma-image6.jpg" alt="Marketing Alliance photo 6" />
        </div>

        <div className="ma__photoStrip ma__photoStrip--lower">
          <Img src="/ma-image7.jpg" alt="Marketing Alliance photo 7" />
          <Img src="/ma-image8.jpg" alt="Marketing Alliance photo 8" />
          <Img src="/ma-image9.jpg" alt="Marketing Alliance photo 9" />
          <Img src="/ma-image10.jpg" alt="Marketing Alliance photo 10" />
          <Img src="/ma-image11.jpg" alt="Marketing Alliance photo 11" />
        </div>
      </div>

      {/* TESTIMONIALS — grid */}
      <div className="ma__fold ma__shortsBlock">
        <div className="ma__subhead ma__subhead--left ma__subhead--testimonials">
          <h3>Testimonials</h3>
          <span className="ma__rule ma__rule--testimonials" />
        </div>

        <div className="ma__testimonialsGrid">
          <div className="ma__videoCard ma__testimonial ma__testimonial--v6">
            <PlayToggleVideo
              src="/ma-video6.mp4"
              wrapperClassName="media media--video"
              videoClassName="ma__video ma__videoEl"
              loop={true}
              muted={false}
              onRequestPlay={() => setActiveMAClipId('ma-clip-testimonial-1')}
              forcePause={activeMAClipId !== 'ma-clip-testimonial-1'}
            />
          </div>
          <div className="ma__videoCard ma__testimonial ma__testimonial--v7">
            <PlayToggleVideo
              src="/ma-video7.mp4"
              wrapperClassName="media media--video"
              videoClassName="ma__video ma__videoEl"
              loop={true}
              muted={false}
              onRequestPlay={() => setActiveMAClipId('ma-clip-testimonial-2')}
              forcePause={activeMAClipId !== 'ma-clip-testimonial-2'}
            />
          </div>
          <div className="ma__videoCard ma__testimonial ma__testimonial--v8">
            <PlayToggleVideo
              src="/ma-video8.mp4"
              wrapperClassName="media media--video"
              videoClassName="ma__video ma__videoEl"
              loop={true}
              muted={false}
              onRequestPlay={() => setActiveMAClipId('ma-clip-testimonial-3')}
              forcePause={activeMAClipId !== 'ma-clip-testimonial-3'}
            />
          </div>
          <div className="ma__videoCard ma__testimonial ma__testimonial--v9">
            <PlayToggleVideo
              src="/ma-video9.mp4"
              wrapperClassName="media media--video"
              videoClassName="ma__video ma__videoEl"
              loop={true}
              muted={false}
              onRequestPlay={() => setActiveMAClipId('ma-clip-testimonial-4')}
              forcePause={activeMAClipId !== 'ma-clip-testimonial-4'}
            />
          </div>
        </div>
      </div>

      {/* SHORTS + HEADSHOTS */}
      <div className="ma__fold ma__shortsHeadshots">
        <div className="ma__shortsColumn">
          <div className="ma__subhead ma__subhead--left ma__subhead--shorts">
            <h3>Shorts</h3>
            <span className="ma__rule ma__rule--shorts ruleFade--right" />
          </div>

          <div className="ma__shortsGrid">
            <div className="ma__shortCard ma__shortCard--v10">
              <PlayToggleVideo
                src="/ma-video10.mp4"
                wrapperClassName="media media--short ma__shortMedia"
                videoClassName="ma__shortVideo"
                loop={true}
                muted={false}
                onRequestPlay={() => setActiveMAClipId('ma-clip-short-1')}
                forcePause={activeMAClipId !== 'ma-clip-short-1'}
              />
            </div>
            <div className="ma__shortCard ma__shortCard--v11">
              <PlayToggleVideo
                src="/ma-video11.mp4"
                wrapperClassName="media media--short ma__shortMedia"
                videoClassName="ma__shortVideo"
                loop={true}
                muted={false}
                onRequestPlay={() => setActiveMAClipId('ma-clip-short-2')}
                forcePause={activeMAClipId !== 'ma-clip-short-2'}
              />
            </div>
            <div className="ma__shortCard ma__shortCard--v12">
              <PlayToggleVideo
                src="/ma-video12.mp4"
                wrapperClassName="media media--short ma__shortMedia"
                videoClassName="ma__shortVideo"
                loop={true}
                muted={false}
                onRequestPlay={() => setActiveMAClipId('ma-clip-short-3')}
                forcePause={activeMAClipId !== 'ma-clip-short-3'}
              />
            </div>
          </div>
        </div>

        <div className="ma__headshotsColumn">
          <div className="ma__subhead ma__subhead--right ma__subhead--headshots">
            <h3>Headshots</h3>
            <span className="ma__rule ma__rule--headshots ruleFade--left" />
          </div>

          <div className="ma__headshotPile">
            <Img src="/ma-image12.jpg" className="shot shot--12" alt="Marketing Alliance headshot 1" />
            <Img src="/ma-image13.jpg" className="shot shot--13" alt="Marketing Alliance headshot 2" />
          </div>
        </div>
      </div>
    </section>
  );
}

