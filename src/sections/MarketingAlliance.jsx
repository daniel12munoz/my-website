import React, { useState, useLayoutEffect, useCallback, useRef, useEffect } from 'react';
import './marketing.css';
import HlsVideo from '../components/HlsVideo';
import ClickToPlayHlsVideo from '../components/ClickToPlayHlsVideo';

const Img = ({ src, className = '', alt = '', loading = 'lazy', fetchPriority, decoding }) => (
  <img 
    className={`media ${className}`.trim()} 
    src={src} 
    alt={alt} 
    loading={loading}
    fetchPriority={fetchPriority}
    decoding={decoding}
  />
);

function LoopingHeaderVideo({ src, onClick }) {
  const wrapperRef = useRef(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const video = wrapperRef.current?.querySelector('video');
    if (!video) return;
    const onPlay = () => setPaused(false);
    const onPause = () => setPaused(true);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="ma__videoBox"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="media media--video" style={{ position: 'relative' }}>
        <HlsVideo
          className="ma__video ma__videoEl"
          src={src}
          autoPlay
          muted
          loop
          playsInline
          controls={false}
        />
        {paused && (
          <div className="playOverlay" style={{ zIndex: 3 }}>
            <span className="playOverlay__icon" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function MarketingAlliance() {
  const [activeMAClipId, setActiveMAClipId] = useState(null);

  useLayoutEffect(() => {
    const main = document.querySelector('main.vp-main') || document.querySelector('main');
    if (main) { main.scrollTop = 0; main.scrollLeft = 0; }
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    try { window.scrollTo(0, 0); } catch (_) {}
  }, []);

  const pauseAutoplayVideos = useCallback(() => {
    const section = document.getElementById('marketing-alliance');
    if (!section) return;
    section.querySelectorAll('video').forEach(v => {
      if (v.muted && !v.paused && !v.classList.contains('ma__heroVideoEl')) {
        v.pause();
      }
    });
  }, []);

  const handleHeaderClick = useCallback((e) => {
    const video = e.currentTarget.querySelector('video');
    if (!video) return;
    if (video.paused) {
      setActiveMAClipId('ma-header-active');
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, []);

  return (
    <section id="marketing-alliance" className="ma au">
      {/* ROW 1 — Video left, Heading/Role + Circular Logo right */}
      <div className="ma__row1">
        <div className="ma__videoBlock">
          <div className="media media--video ma__heroFrame">
            <HlsVideo
              className="ma__heroVideoEl"
              src="https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/ma-newmasterfinal.webm"
              posterSrc="/marketingalliancethumb.jpg"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              priority
              hero
              lazy={false}
              controls={false}
              aria-hidden="true"
            />
          </div>
          <div className="ma__linkWrap heroLinkWrap vpHeroLink">
            <a
              className="ma__link heroLink vpHeroLink__a"
              href="https://www.marketingallianceinc.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              marketingallianceinc.com
            </a>
          </div>
          <span className="ma__linkRule" />
        </div>

        <div className="ma__heading">
          <div className="ma__headingUnit">
            <h2 className="ma__title">Marketing Alliance</h2>
            <span className="ma__rule ruleFade--left" />
            <div className="ma__roles">
              Videographer / Editor • Dec 2024 – Present
            </div>
          </div>

          <div className="ma__logoWrap">
            <Img 
              src="/ma-image1.png" 
              className="ma__logo" 
              alt="Marketing Alliance logo"
              loading="eager"
              fetchPriority="high"
              decoding="sync"
            />
          </div>
        </div>
      </div>

      <div className="ma__belowRow1">
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
          <LoopingHeaderVideo
            src="https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/ma-video2.webm"
            onClick={handleHeaderClick}
          />
          <LoopingHeaderVideo
            src="https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/ma-video3.webm"
            onClick={handleHeaderClick}
          />
          <LoopingHeaderVideo
            src="https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/ma-video4.webm"
            onClick={handleHeaderClick}
          />
          <LoopingHeaderVideo
            src="https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/ma-video5.webm"
            onClick={handleHeaderClick}
          />
        </div>
      </div>

      {/* PHOTOGRAPHY — grid */}
      <div className="ma__fold ma__photos">
        <div className="ma__subhead ma__subhead--right">
          <h3>Photography</h3>
          <span className="ma__rule ruleFade--left" />
        </div>

        <div className="ma__photoGrid">
          <Img src="/ma-image2.jpg" alt="Marketing Alliance photo 2" />
          <Img src="/ma-image3.jpg" alt="Marketing Alliance photo 3" />
          <Img src="/ma-image4.jpg" alt="Marketing Alliance photo 4" />
          <Img src="/ma-image5.jpg" alt="Marketing Alliance photo 5" />
          <Img src="/ma-image6.jpg" alt="Marketing Alliance photo 6" />
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
            <ClickToPlayHlsVideo
              src="https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/ma-video6.webm"
              poster="/ma-video6thumb.jpg"
              videoId="ma-clip-testimonial-1"
              wrapperClassName="media media--video"
              className="ma__video ma__videoEl"
              loop={true}
              muted={false}
              startQuality="high"
              onRequestPlay={() => {
                pauseAutoplayVideos();
                setActiveMAClipId('ma-clip-testimonial-1');
              }}
              forcePause={activeMAClipId !== null && activeMAClipId !== 'ma-clip-testimonial-1'}
            />
          </div>
          <div className="ma__videoCard ma__testimonial ma__testimonial--v7">
            <ClickToPlayHlsVideo
              src="https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/ma-video7.webm"
              poster="/ma-video7thumb.jpg"
              videoId="ma-clip-testimonial-2"
              wrapperClassName="media media--video"
              className="ma__video ma__videoEl"
              loop={true}
              muted={false}
              startQuality="high"
              onRequestPlay={() => {
                pauseAutoplayVideos();
                setActiveMAClipId('ma-clip-testimonial-2');
              }}
              forcePause={activeMAClipId !== null && activeMAClipId !== 'ma-clip-testimonial-2'}
            />
          </div>
          <div className="ma__videoCard ma__testimonial ma__testimonial--v8">
            <ClickToPlayHlsVideo
              src="https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/ma-video8.webm"
              poster="/ma-video8thumb.jpg"
              videoId="ma-clip-testimonial-3"
              wrapperClassName="media media--video"
              className="ma__video ma__videoEl"
              loop={true}
              muted={false}
              startQuality="high"
              onRequestPlay={() => {
                pauseAutoplayVideos();
                setActiveMAClipId('ma-clip-testimonial-3');
              }}
              forcePause={activeMAClipId !== null && activeMAClipId !== 'ma-clip-testimonial-3'}
            />
          </div>
          <div className="ma__videoCard ma__testimonial ma__testimonial--v9">
            <ClickToPlayHlsVideo
              src="https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/ma-video9.webm"
              poster="/ma-video9thumb.jpg"
              videoId="ma-clip-testimonial-4"
              wrapperClassName="media media--video"
              className="ma__video ma__videoEl"
              loop={true}
              muted={false}
              startQuality="high"
              onRequestPlay={() => {
                pauseAutoplayVideos();
                setActiveMAClipId('ma-clip-testimonial-4');
              }}
              forcePause={activeMAClipId !== null && activeMAClipId !== 'ma-clip-testimonial-4'}
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
              <ClickToPlayHlsVideo
                src="https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/ma-video10.webm"
                poster="/ma-video10thumb.jpg"
                videoId="ma-clip-short-1"
                wrapperClassName="media media--short ma__shortMedia"
                className="ma__shortVideo"
                loop={true}
                muted={false}
                startQuality="high"
                onRequestPlay={() => {
                  pauseAutoplayVideos();
                  setActiveMAClipId('ma-clip-short-1');
                }}
                forcePause={activeMAClipId !== null && activeMAClipId !== 'ma-clip-short-1'}
              />
            </div>
            <div className="ma__shortCard ma__shortCard--v12">
              <ClickToPlayHlsVideo
                src="https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/ma-video12.webm"
                poster="/ma-video12thumb.jpg"
                videoId="ma-clip-short-2"
                wrapperClassName="media media--short ma__shortMedia"
                className="ma__shortVideo"
                loop={true}
                muted={false}
                startQuality="high"
                onRequestPlay={() => {
                  pauseAutoplayVideos();
                  setActiveMAClipId('ma-clip-short-2');
                }}
                forcePause={activeMAClipId !== null && activeMAClipId !== 'ma-clip-short-2'}
              />
            </div>
            <div className="ma__shortCard ma__shortCard--v11">
              <ClickToPlayHlsVideo
                src="https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/ma-video11.webm"
                poster="/ma-video11thumb.jpg"
                videoId="ma-clip-short-3"
                wrapperClassName="media media--short ma__shortMedia"
                className="ma__shortVideo"
                loop={true}
                muted={false}
                startQuality="high"
                onRequestPlay={() => {
                  pauseAutoplayVideos();
                  setActiveMAClipId('ma-clip-short-3');
                }}
                forcePause={activeMAClipId !== null && activeMAClipId !== 'ma-clip-short-3'}
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
      </div>
    </section>
  );
}

