import React, { useState } from 'react';
import './marketing.css';
import HlsVideo from '../components/HlsVideo';
import ClickToPlayHlsVideo from '../components/ClickToPlayHlsVideo';

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
          <div className="media media--video ma__heroFrame">
            <HlsVideo
              className="ma__heroVideoEl"
              src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/f33e2bc3aed778a80d5050985fda79cc/manifest/video.m3u8"
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
          <div className="ma__videoBox">
            <div className="media media--video">
              <HlsVideo
                className="ma__video ma__videoEl"
                src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/4a3192f46de64a4520d1016df1cb7f5d/manifest/video.m3u8"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                priority
                lazy={false}
                controls={false}
              />
            </div>
          </div>
          <div className="ma__videoBox">
            <div className="media media--video">
              <HlsVideo
                className="ma__video ma__videoEl"
                src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/8d37b772e30474a2732049adce0b06e5/manifest/video.m3u8"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                priority
                lazy={false}
                controls={false}
              />
            </div>
          </div>
          <div className="ma__videoBox">
            <div className="media media--video">
              <HlsVideo
                className="ma__video ma__videoEl"
                src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/2f8e29eac63ca9da416929175435e274/manifest/video.m3u8"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                priority
                lazy={false}
                controls={false}
              />
            </div>
          </div>
          <div className="ma__videoBox">
            <div className="media media--video">
              <HlsVideo
                className="ma__video ma__videoEl"
                src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/5ea790e9fb658a9365ea6c755577ffdd/manifest/video.m3u8"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                priority
                lazy={false}
                controls={false}
              />
            </div>
          </div>
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
              src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/3f27d4b270ed0b1d66058691bcbddaca/manifest/video.m3u8"
              videoId="ma-clip-testimonial-1"
              wrapperClassName="media media--video"
              className="ma__video ma__videoEl"
              loop={true}
              muted={false}
              startQuality="high"
              onRequestPlay={() => {
                setActiveMAClipId('ma-clip-testimonial-1');
              }}
              forcePause={activeMAClipId !== null && activeMAClipId !== 'ma-clip-testimonial-1'}
            />
          </div>
          <div className="ma__videoCard ma__testimonial ma__testimonial--v7">
            <ClickToPlayHlsVideo
              src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/8d1954f73f3a307cfb0e49446e2b05be/manifest/video.m3u8"
              videoId="ma-clip-testimonial-2"
              wrapperClassName="media media--video"
              className="ma__video ma__videoEl"
              loop={true}
              muted={false}
              startQuality="high"
              onRequestPlay={() => {
                setActiveMAClipId('ma-clip-testimonial-2');
              }}
              forcePause={activeMAClipId !== null && activeMAClipId !== 'ma-clip-testimonial-2'}
            />
          </div>
          <div className="ma__videoCard ma__testimonial ma__testimonial--v8">
            <ClickToPlayHlsVideo
              src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/58c6309a3d0282d2b8e468d177d3d3a5/manifest/video.m3u8"
              videoId="ma-clip-testimonial-3"
              wrapperClassName="media media--video"
              className="ma__video ma__videoEl"
              loop={true}
              muted={false}
              startQuality="high"
              onRequestPlay={() => {
                setActiveMAClipId('ma-clip-testimonial-3');
              }}
              forcePause={activeMAClipId !== null && activeMAClipId !== 'ma-clip-testimonial-3'}
            />
          </div>
          <div className="ma__videoCard ma__testimonial ma__testimonial--v9">
            <ClickToPlayHlsVideo
              src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/b2f5bf4ade64aac387b2e7e986cc74bd/manifest/video.m3u8"
              videoId="ma-clip-testimonial-4"
              wrapperClassName="media media--video"
              className="ma__video ma__videoEl"
              loop={true}
              muted={false}
              startQuality="high"
              onRequestPlay={() => {
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
                src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/2f320453f80ec991033c4a329754774c/manifest/video.m3u8"
                videoId="ma-clip-short-1"
                wrapperClassName="media media--short ma__shortMedia"
                className="ma__shortVideo"
                loop={true}
                muted={false}
                startQuality="high"
                onRequestPlay={() => {
                  setActiveMAClipId('ma-clip-short-1');
                }}
                forcePause={activeMAClipId !== null && activeMAClipId !== 'ma-clip-short-1'}
              />
            </div>
            <div className="ma__shortCard ma__shortCard--v11">
              <ClickToPlayHlsVideo
                src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/0d603ba86d8a7b549e5e464724045ecb/manifest/video.m3u8"
                videoId="ma-clip-short-2"
                wrapperClassName="media media--short ma__shortMedia"
                className="ma__shortVideo"
                loop={true}
                muted={false}
                startQuality="high"
                onRequestPlay={() => {
                  setActiveMAClipId('ma-clip-short-2');
                }}
                forcePause={activeMAClipId !== null && activeMAClipId !== 'ma-clip-short-2'}
              />
            </div>
            <div className="ma__shortCard ma__shortCard--v12">
              <ClickToPlayHlsVideo
                src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/f37981c80a7928ff6446ee52a43e9ece/manifest/video.m3u8"
                videoId="ma-clip-short-3"
                wrapperClassName="media media--short ma__shortMedia"
                className="ma__shortVideo"
                loop={true}
                muted={false}
                startQuality="high"
                onRequestPlay={() => {
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

