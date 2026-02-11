import React, { useState } from 'react';
import './vonix.css';
import HlsVideo from '../components/HlsVideo';
import ClickToPlayHlsVideo from '../components/ClickToPlayHlsVideo';

export default function Vonix() {
  const [activeVonixClipId, setActiveVonixClipId] = useState(null);

  return (
    <section id="vonix" className="vo au">
      {/* ROW 1 — hero video + link on the left, heading/roles/logo on the right */}
      <div className="vo__row1">
        <div className="vo__videoBlock">
          <div className="media media--video vo__heroMedia">
            <HlsVideo
              src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/61d67aad31ee537fd8dd0cda7830def7/manifest/video.m3u8"
              posterSrc="/vonixthumb.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              priority
              hero
              lazy={false}
              remountLoop
              className="vo__heroVideo"
            />
          </div>

          {/* Hero link under the video */}
          <div className="vo__linkWrap heroLinkWrap vpHeroLink">
            <a
              className="vo__link heroLink vpHeroLink__a"
              href="https://youtube.com/Vonix"
              target="_blank"
              rel="noopener noreferrer"
            >
              youtube.com/Vonix
            </a>
            <span className="vo__linkRule" />
          </div>
        </div>

        <div className="vo__heading">
          <h2 className="vo__title">Vonix</h2>
          <span className="vo__rule vo__rule--main" aria-hidden="true" />

          <div className="vo__roles">
            Producer • Feb 2013 – Present
          </div>

          <div className="vo__logoWrap vonix__topRight">
            <img
              src="/vonix-masterlogo.png"
              alt="Vonix master logo"
              className="vo__masterLogo vo__masterLogo--desktop"
              loading="eager"
              fetchPriority="high"
              decoding="sync"
            />
            <img
              src="/vonix-masterlogomobilesecond.png"
              alt="Vonix master logo"
              className="vo__masterLogo vo__masterLogo--mobile"
              loading="eager"
              fetchPriority="high"
              decoding="sync"
            />
          </div>
        </div>
      </div>

      {/* ROW 2 — description paragraph in its own row (decoupled from video width) */}
      <div className="vo__rowDesc">
        <p className="vo__desc">
          Vonix is a long-running creative platform that showcases a wide range of
          self-produced content, evolving from gaming, vlogs, and commentary videos
          to documentaries and experimental storytelling. Built from over a decade
          of continuous production, it reflects a personal vision shaped through
          thousands of hours behind the camera and in the edit. Today it serves as
          my personal central outlet for original ideas and creative exploration.
        </p>
      </div>

      {/* ==================== PSYCHOLOGY (Shorts + Main videos) ==================== */}
      <section className="vo__fold vo__psychology">
        <div className="vo__subhead vo__subhead--left">
          <h3>Psychology</h3>
          <span className="vo__rule vo__rule--psychology" aria-hidden="true" />
        </div>

        <div className="vo__psychGrid">
          {/* Duo 1 */}
          <article className="vo__psychDuo" key="/vo-video2.mp4">
            {/* Main horizontal video */}
            <div className="media media--video vo__psychMain">
              <div className="comingSoonTile" aria-label="Coming soon">
                <div className="comingSoonTile__center">Coming very soon...</div>
              </div>
            </div>
            <div className="vo__linkWrap">
              <div className="vo__link vo__link--mini vo__link--disabled">
                youtube.com/i-tried-to-find-myself
              </div>
              <span className="vo__linkRule" />
            </div>

            {/* Overlapping vertical short in top-right */}
            <div className="vo__psychShort" key="/vo-short1.mp4">
              <div className="media media--short vo__psychShortMedia">
                <div className="comingSoonTile comingSoonTile--short" aria-label="Short coming soon">
                  <div className="comingSoonTile__center">Mar 2026</div>
                </div>
              </div>
              <div className="vo__linkWrap">
                <div className="vo__shortLink vo__shortLink--disabled">
                  (short coming soon)
                </div>
                <span className="vo__linkRule" />
              </div>
            </div>
          </article>

          {/* Duo 2 - Right side */}
          <article className="vo__psychDuo" key="/vo-video3againagain.mp4">
            <ClickToPlayHlsVideo
              src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/cfa5c80d23b7f2e4ac671c94d67cfe1f/manifest/video.m3u8"
              videoId="vo-clip-3"
              wrapperClassName="media media--video vo__psychMain"
              className="vo__videoEl"
              muted={false}
              loop={true}
              startQuality="high"
              debugTag="VONIX PTV"
              onRequestPlay={() => setActiveVonixClipId('vo-clip-3')}
              forcePause={activeVonixClipId !== null && activeVonixClipId !== 'vo-clip-3'}
            />
            <div className="vo__linkWrap">
              <a
                className="vo__link vo__link--mini"
                href="https://youtube.com/watch?v=gSIcBxet37s&t"
                target="_blank"
                rel="noopener noreferrer"
              >
                youtube.com/watch?v=gSIcBxet37s&t
              </a>
              <span className="vo__linkRule" />
            </div>

            <div className="vo__psychShort" key="/vo-short2.mp4">
              <ClickToPlayHlsVideo
                src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/6f53b55acfdc162ff0772c1b8c58bd93/manifest/video.m3u8"
                videoId="vo-clip-short-2"
                wrapperClassName="media media--short vo__psychShortMedia"
                className="vo__shortVideo"
                muted={false}
                loop={true}
                startQuality="high"
                debugTag="VONIX PTV"
                onRequestPlay={() => setActiveVonixClipId('vo-clip-short-2')}
                forcePause={activeVonixClipId !== null && activeVonixClipId !== 'vo-clip-short-2'}
              />
              <div className="vo__linkWrap">
                <a
                  className="vo__shortLink"
                  href="https://youtube.com/shorts/Lng8cEThQK8"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-vonix-short2-link="true"
                >
                  youtube.com/shorts/Lng8cEThQK8
                </a>
                <span className="vo__linkRule" />
              </div>
            </div>
          </article>
        </div>
      </section>

      <div className="vo__belowHeroDesktop" data-vonix-tech-block="true">
      {/* ==================== TECHNOLOGY (5-video 3+2 grid) ==================== */}
      <section className="vo__fold vo__technology">
        <div className="vo__subhead vo__subhead--left">
          <h3>Technology</h3>
          <span className="vo__rule vo__rule--technology" aria-hidden="true" />
        </div>

        <div className="vo__videoGrid vo__videoGrid--tech">
          {/* Top row: 3 videos */}
          <article className="vo__videoCard" key="/vo-video4againagain.mp4">
            <ClickToPlayHlsVideo
              src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/46766f3b28684d293686ecc81cc2bd4c/manifest/video.m3u8"
              videoId="vo-clip-4"
              wrapperClassName="media media--video"
              className="vo__videoEl"
              muted={false}
              loop={true}
              startQuality="high"
              debugTag="VONIX PTV"
              onRequestPlay={() => setActiveVonixClipId('vo-clip-4')}
              forcePause={activeVonixClipId !== null && activeVonixClipId !== 'vo-clip-4'}
            />
            <div className="vo__linkWrap">
              <a
                className="vo__link vo__link--mini"
                href="https://youtube.com/watch?v=IDjteTYMz8o&t"
                target="_blank"
                rel="noopener noreferrer"
              >
                youtube.com/watch?v=IDjteTYMz8o&t
              </a>
              <span className="vo__linkRule" />
            </div>
          </article>

          <article className="vo__videoCard" key="/vo-video5againagain.mp4">
            <ClickToPlayHlsVideo
              src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/be7c3244f5eae13a7920232603a2c3a1/manifest/video.m3u8"
              videoId="vo-clip-5"
              wrapperClassName="media media--video"
              className="vo__videoEl"
              muted={false}
              loop={true}
              startQuality="high"
              debugTag="VONIX PTV"
              onRequestPlay={() => setActiveVonixClipId('vo-clip-5')}
              forcePause={activeVonixClipId !== null && activeVonixClipId !== 'vo-clip-5'}
            />
            <div className="vo__linkWrap">
              <a
                className="vo__link vo__link--mini"
                href="https://youtube.com/watch?v=pTbGXUKMO_0&t"
                target="_blank"
                rel="noopener noreferrer"
              >
                youtube.com/watch?v=pTbGXUKMO_0&t
              </a>
              <span className="vo__linkRule" />
            </div>
          </article>

          <article className="vo__videoCard" key="/vo-video6againagain.mp4">
            <ClickToPlayHlsVideo
              src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/53da8db5d5f4ece4a1791a53037fc06c/manifest/video.m3u8"
              videoId="vo-clip-6"
              wrapperClassName="media media--video"
              className="vo__videoEl"
              muted={false}
              loop={true}
              startQuality="high"
              debugTag="VONIX PTV"
              onRequestPlay={() => setActiveVonixClipId('vo-clip-6')}
              forcePause={activeVonixClipId !== null && activeVonixClipId !== 'vo-clip-6'}
            />
            <div className="vo__linkWrap">
              <a
                className="vo__link vo__link--mini"
                href="https://youtube.com/watch?v=BDcBxf5dPUE&t"
                target="_blank"
                rel="noopener noreferrer"
              >
                youtube.com/watch?v=BDcBxf5dPUE&t
              </a>
              <span className="vo__linkRule" />
            </div>
          </article>

          {/* Bottom row: 2 centered videos */}
          <article className="vo__videoCard vo__videoCard--bottom" key="/vo-video7againagain.mp4">
            <ClickToPlayHlsVideo
              src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/f08db30369dc64985bf08f0ed045cef7/manifest/video.m3u8"
              videoId="vo-clip-7"
              wrapperClassName="media media--video"
              className="vo__videoEl"
              muted={false}
              loop={true}
              startQuality="high"
              debugTag="VONIX PTV"
              onRequestPlay={() => setActiveVonixClipId('vo-clip-7')}
              forcePause={activeVonixClipId !== null && activeVonixClipId !== 'vo-clip-7'}
            />
            <div className="vo__linkWrap">
              <a
                className="vo__link vo__link--mini"
                href="https://youtube.com/watch?v=Z9-QiW4JTT8"
                target="_blank"
                rel="noopener noreferrer"
              >
                youtube.com/watch?v=Z9-QiW4JTT8
              </a>
              <span className="vo__linkRule" />
            </div>
          </article>

          <article className="vo__videoCard vo__videoCard--bottom" key="/vo-video8againagain.mp4">
            <ClickToPlayHlsVideo
              src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/37f00028853e15b8aa71aec035d77c80/manifest/video.m3u8"
              videoId="vo-clip-8"
              wrapperClassName="media media--video"
              className="vo__videoEl"
              muted={false}
              loop={true}
              startQuality="high"
              debugTag="VONIX PTV"
              onRequestPlay={() => setActiveVonixClipId('vo-clip-8')}
              forcePause={activeVonixClipId !== null && activeVonixClipId !== 'vo-clip-8'}
            />
            <div className="vo__linkWrap">
              <a
                className="vo__link vo__link--mini"
                href="https://youtube.com/watch?v=UyiQPe9n-PM&t"
                target="_blank"
                rel="noopener noreferrer"
              >
                youtube.com/watch?v=UyiQPe9n-PM&t
              </a>
              <span className="vo__linkRule" />
            </div>
          </article>
        </div>
      </section>

      {/* ==================== VLOGS (same 5-video 3+2 grid) ==================== */}
      <section className="vo__fold vo__vlogs">
        <div className="vo__subhead vo__subhead--left">
          <h3>Vlogs</h3>
          <span className="vo__rule vo__rule--vlogs" aria-hidden="true" />
        </div>

        <div className="vo__videoGrid vo__videoGrid--vlogs">
          {/* Top row: 3 videos */}
          <article className="vo__videoCard" key="/vo-video9againagain.mp4">
            <ClickToPlayHlsVideo
              src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/9bbfffd245d9c5286645f7b767ec2993/manifest/video.m3u8"
              videoId="vo-clip-9"
              wrapperClassName="media media--video"
              className="vo__videoEl"
              muted={false}
              loop={true}
              startQuality="high"
              debugTag="VONIX PTV"
              onRequestPlay={() => setActiveVonixClipId('vo-clip-9')}
              forcePause={activeVonixClipId !== null && activeVonixClipId !== 'vo-clip-9'}
            />
            <div className="vo__linkWrap">
              <a
                className="vo__link vo__link--mini"
                href="https://youtube.com/watch?v=NyWk-z0KXYc&t"
                target="_blank"
                rel="noopener noreferrer"
              >
                youtube.com/watch?v=NyWk-z0KXYc&t
              </a>
              <span className="vo__linkRule" />
            </div>
          </article>

          <article className="vo__videoCard" key="/vo-video10againagain.mp4">
            <ClickToPlayHlsVideo
              src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/31358e5c87201ba65239f5afede0d7e7/manifest/video.m3u8"
              videoId="vo-clip-10"
              wrapperClassName="media media--video"
              className="vo__videoEl"
              muted={false}
              loop={true}
              startQuality="high"
              debugTag="VONIX PTV"
              onRequestPlay={() => setActiveVonixClipId('vo-clip-10')}
              forcePause={activeVonixClipId !== null && activeVonixClipId !== 'vo-clip-10'}
            />
            <div className="vo__linkWrap">
              <a
                className="vo__link vo__link--mini"
                href="https://youtube.com/watch?v=2ahmcssNCI8"
                target="_blank"
                rel="noopener noreferrer"
              >
                youtube.com/watch?v=2ahmcssNCI8
              </a>
              <span className="vo__linkRule" />
            </div>
          </article>

          <article className="vo__videoCard" key="/vo-video11againagain.mp4">
            <ClickToPlayHlsVideo
              src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/6450925208e4b8a51d27b0a48f201fec/manifest/video.m3u8"
              videoId="vo-clip-11"
              wrapperClassName="media media--video"
              className="vo__videoEl"
              muted={false}
              loop={true}
              startQuality="high"
              debugTag="VONIX PTV"
              onRequestPlay={() => setActiveVonixClipId('vo-clip-11')}
              forcePause={activeVonixClipId !== null && activeVonixClipId !== 'vo-clip-11'}
            />
            <div className="vo__linkWrap">
              <a
                className="vo__link vo__link--mini"
                href="https://youtube.com/watch?v=eF96zNEwzHQ"
                target="_blank"
                rel="noopener noreferrer"
              >
                youtube.com/watch?v=eF96zNEwzHQ
              </a>
              <span className="vo__linkRule" />
            </div>
          </article>

          {/* Bottom row: 2 centered videos */}
          <article className="vo__videoCard vo__videoCard--bottom" key="/vo-video12againagain.mp4">
            <ClickToPlayHlsVideo
              src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/142b13ec93fb2adf6b764a7d2d4262bf/manifest/video.m3u8"
              videoId="vo-clip-12"
              wrapperClassName="media media--video"
              className="vo__videoEl"
              muted={false}
              loop={true}
              startQuality="high"
              debugTag="VONIX PTV"
              onRequestPlay={() => setActiveVonixClipId('vo-clip-12')}
              forcePause={activeVonixClipId !== null && activeVonixClipId !== 'vo-clip-12'}
            />
            <div className="vo__linkWrap">
              <a
                className="vo__link vo__link--mini"
                href="https://youtube.com/watch?v=iNnGwYnQtPc&t"
                target="_blank"
                rel="noopener noreferrer"
              >
                youtube.com/watch?v=iNnGwYnQtPc&t
              </a>
              <span className="vo__linkRule" />
            </div>
          </article>

          <article className="vo__videoCard vo__videoCard--bottom" key="/vo-video13againagain.mp4">
            <ClickToPlayHlsVideo
              src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/cdeba6393a83ff080b70bbddcc6d4024/manifest/video.m3u8"
              videoId="vo-clip-13"
              wrapperClassName="media media--video"
              className="vo__videoEl"
              muted={false}
              loop={true}
              startQuality="high"
              debugTag="VONIX PTV"
              onRequestPlay={() => setActiveVonixClipId('vo-clip-13')}
              forcePause={activeVonixClipId !== null && activeVonixClipId !== 'vo-clip-13'}
            />
            <div className="vo__linkWrap">
              <a
                className="vo__link vo__link--mini"
                href="https://youtube.com/watch?v=PqryyCNpC7Y"
                target="_blank"
                rel="noopener noreferrer"
              >
                youtube.com/watch?v=PqryyCNpC7Y
              </a>
              <span className="vo__linkRule" />
            </div>
          </article>
        </div>
      </section>

      {/* ==================== OTHER FAVORITES (same 5-video 3+2 grid) ==================== */}
      <section className="vo__fold vo__favorites">
        <div className="vo__subhead vo__subhead--right">
          <h3>Other Favorites</h3>
          <span className="vo__rule vo__rule--favorites" aria-hidden="true" />
        </div>

        <div className="vo__videoGrid vo__videoGrid--favorites">
          {/* Video 14 */}
          <article className="vo__videoCard" key="/vo-video14againagain.mp4">
            <ClickToPlayHlsVideo
              src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/f2ebd06a38d2a4d871fd528e771750f8/manifest/video.m3u8"
              videoId="vo-clip-14"
              wrapperClassName="media media--video"
              className="vo__videoEl"
              muted={false}
              loop={true}
              startQuality="high"
              debugTag="VONIX PTV"
              onRequestPlay={() => setActiveVonixClipId('vo-clip-14')}
              forcePause={activeVonixClipId !== null && activeVonixClipId !== 'vo-clip-14'}
            />
            <div className="vo__linkWrap">
              <a
                className="vo__link vo__link--mini"
                href="https://youtube.com/watch?v=7Cr52H2YGJM&t"
                target="_blank"
                rel="noopener noreferrer"
              >
                youtube.com/watch?v=7Cr52H2YGJM&t
              </a>
              <span className="vo__linkRule" />
            </div>
          </article>

          {/* Video 15 */}
          <article className="vo__videoCard" key="/vo-video15againagainagain.mp4">
            <ClickToPlayHlsVideo
              src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/6b01fbe3a77e639bf9298eb813ff356e/manifest/video.m3u8"
              videoId="vo-clip-15"
              wrapperClassName="media media--video"
              className="vo__videoEl"
              muted={false}
              loop={true}
              startQuality="high"
              debugTag="VONIX PTV"
              onRequestPlay={() => setActiveVonixClipId('vo-clip-15')}
              forcePause={activeVonixClipId !== null && activeVonixClipId !== 'vo-clip-15'}
            />
            <div className="vo__linkWrap">
              <a
                className="vo__link vo__link--mini"
                href="https://www.youtube.com/watch?v=VN0jljxtmj4"
                target="_blank"
                rel="noopener noreferrer"
              >
                youtube.com/watch?v=VN0jljxtmj4
              </a>
              <span className="vo__linkRule" />
            </div>
          </article>

          {/* Video 16 */}
          <article className="vo__videoCard" key="/vo-video16againagain.mp4">
            <ClickToPlayHlsVideo
              src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/956c523692f9793d1862421d4b5b9009/manifest/video.m3u8"
              videoId="vo-clip-16"
              wrapperClassName="media media--video"
              className="vo__videoEl"
              muted={false}
              loop={true}
              startQuality="high"
              debugTag="VONIX PTV"
              onRequestPlay={() => setActiveVonixClipId('vo-clip-16')}
              forcePause={activeVonixClipId !== null && activeVonixClipId !== 'vo-clip-16'}
            />
            <div className="vo__linkWrap">
              <a
                className="vo__link vo__link--mini"
                href="https://youtube.com/watch?v=Xe3G8M1r4AU"
                target="_blank"
                rel="noopener noreferrer"
              >
                youtube.com/watch?v=Xe3G8M1r4AU
              </a>
              <span className="vo__linkRule" />
            </div>
          </article>

          {/* Video 17 */}
          <article className="vo__videoCard" key="/vo-video17againagain.mp4">
            <ClickToPlayHlsVideo
              src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/da5102ebe7634b16880f18ba9b4ebb0b/manifest/video.m3u8"
              videoId="vo-clip-17"
              wrapperClassName="media media--video"
              className="vo__videoEl"
              muted={false}
              loop={true}
              startQuality="high"
              debugTag="VONIX PTV"
              onRequestPlay={() => setActiveVonixClipId('vo-clip-17')}
              forcePause={activeVonixClipId !== null && activeVonixClipId !== 'vo-clip-17'}
            />
            <div className="vo__linkWrap">
              <a
                className="vo__link vo__link--mini"
                href="https://youtube.com/watch?v=Csi8VOHYv2w&t"
                target="_blank"
                rel="noopener noreferrer"
              >
                youtube.com/watch?v=Csi8VOHYv2w&t
              </a>
              <span className="vo__linkRule" />
            </div>
          </article>

          {/* Video 18 */}
          <article className="vo__videoCard" key="/vo-video18againagain.mp4">
            <ClickToPlayHlsVideo
              src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/c00e1bd44b221b15d2fd9e9b8707f9ba/manifest/video.m3u8"
              videoId="vo-clip-18"
              wrapperClassName="media media--video"
              className="vo__videoEl"
              muted={false}
              loop={true}
              startQuality="high"
              debugTag="VONIX PTV"
              onRequestPlay={() => setActiveVonixClipId('vo-clip-18')}
              forcePause={activeVonixClipId !== null && activeVonixClipId !== 'vo-clip-18'}
            />
            <div className="vo__linkWrap">
              <a
                className="vo__link vo__link--mini"
                href="https://youtube.com/watch?v=9lgbuEOvG18&t"
                target="_blank"
                rel="noopener noreferrer"
              >
                youtube.com/watch?v=9lgbuEOvG18&t
              </a>
              <span className="vo__linkRule" />
            </div>
          </article>
        </div>
      </section>
      </div>
    </section>
  );
}

