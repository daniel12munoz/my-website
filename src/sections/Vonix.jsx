import React, { useState } from 'react';
import './vonix.css';
import PlayToggleVideo from '../components/PlayToggleVideo';

export default function Vonix() {
  const [activeVonixClipId, setActiveVonixClipId] = useState(null);

  return (
    <section id="vonix" className="vo au">
      {/* ROW 1 — hero video + link on the left, heading/roles/logo on the right */}
      <div className="vo__row1">
        <div className="vo__videoBlock">
          <div className="media media--video vo__heroMedia">
            <video
              className="vo__heroVideo"
              src="/vo-video1.webm"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              controls={false}
            />
          </div>

          {/* Hero link under the video */}
          <div className="vo__linkWrap">
            <a
              className="vo__link"
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
              src="/vo-logo1.png"
              alt="Vonix logo"
              className="vo__logo"
              loading="lazy"
            />
            <img
              className="vonix__plaque"
              src="/100plaque.png"
              alt=""
              aria-hidden="true"
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
                  <div className="comingSoonTile__center">Feb 2026</div>
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
          <article className="vo__psychDuo" key="/vo-video3again.mp4">
            <PlayToggleVideo
              src="/vo-video3again.mp4"
              wrapperClassName="media media--video vo__psychMain"
              videoClassName="vo__videoEl"
              muted={false}
              loop={true}
              preload="auto"
              onRequestPlay={() => setActiveVonixClipId('vo-clip-3')}
              forcePause={activeVonixClipId !== 'vo-clip-3'}
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
              <PlayToggleVideo
                src="/vo-short2.mp4"
                wrapperClassName="media media--short vo__psychShortMedia"
                videoClassName="vo__shortVideo"
                muted={false}
                loop={true}
                preload="auto"
                onRequestPlay={() => setActiveVonixClipId('vo-clip-short-2')}
                forcePause={activeVonixClipId !== 'vo-clip-short-2'}
              />
              <div className="vo__linkWrap">
                <a
                  className="vo__shortLink"
                  href="https://youtube.com/shorts/Lng8cEThQK8"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  youtube.com/shorts/Lng8cEThQK8
                </a>
                <span className="vo__linkRule" />
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ==================== TECHNOLOGY (5-video 3+2 grid) ==================== */}
      <section className="vo__fold vo__technology">
        <div className="vo__subhead vo__subhead--left">
          <h3>Technology</h3>
          <span className="vo__rule vo__rule--technology" aria-hidden="true" />
        </div>

        <div className="vo__videoGrid vo__videoGrid--tech">
          {/* Top row: 3 videos */}
          <article className="vo__videoCard" key="/vo-video4again.mp4">
            <PlayToggleVideo
              src="/vo-video4again.mp4"
              wrapperClassName="media media--video"
              videoClassName="vo__videoEl"
              muted={false}
              loop={true}
              preload="auto"
              onRequestPlay={() => setActiveVonixClipId('vo-clip-4')}
              forcePause={activeVonixClipId !== 'vo-clip-4'}
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

          <article className="vo__videoCard" key="/vo-video5again.mp4">
            <PlayToggleVideo
              src="/vo-video5again.mp4"
              wrapperClassName="media media--video"
              videoClassName="vo__videoEl"
              muted={false}
              loop={true}
              preload="auto"
              onRequestPlay={() => setActiveVonixClipId('vo-clip-5')}
              forcePause={activeVonixClipId !== 'vo-clip-5'}
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

          <article className="vo__videoCard" key="/vo-video6again.mp4">
            <PlayToggleVideo
              src="/vo-video6again.mp4"
              wrapperClassName="media media--video"
              videoClassName="vo__videoEl"
              muted={false}
              loop={true}
              preload="auto"
              onRequestPlay={() => setActiveVonixClipId('vo-clip-6')}
              forcePause={activeVonixClipId !== 'vo-clip-6'}
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
          <article className="vo__videoCard vo__videoCard--bottom" key="/vo-video7again.mp4">
            <PlayToggleVideo
              src="/vo-video7again.mp4"
              wrapperClassName="media media--video"
              videoClassName="vo__videoEl"
              muted={false}
              loop={true}
              preload="auto"
              onRequestPlay={() => setActiveVonixClipId('vo-clip-7')}
              forcePause={activeVonixClipId !== 'vo-clip-7'}
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

          <article className="vo__videoCard vo__videoCard--bottom" key="/vo-video8again.mp4">
            <PlayToggleVideo
              src="/vo-video8again.mp4"
              wrapperClassName="media media--video"
              videoClassName="vo__videoEl"
              muted={false}
              loop={true}
              preload="auto"
              onRequestPlay={() => setActiveVonixClipId('vo-clip-8')}
              forcePause={activeVonixClipId !== 'vo-clip-8'}
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
          <article className="vo__videoCard" key="/vo-video9again.mp4">
            <PlayToggleVideo
              src="/vo-video9again.mp4"
              wrapperClassName="media media--video"
              videoClassName="vo__videoEl"
              muted={false}
              loop={true}
              preload="auto"
              onRequestPlay={() => setActiveVonixClipId('vo-clip-9')}
              forcePause={activeVonixClipId !== 'vo-clip-9'}
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

          <article className="vo__videoCard" key="/vo-video10again.mp4">
            <PlayToggleVideo
              src="/vo-video10again.mp4"
              wrapperClassName="media media--video"
              videoClassName="vo__videoEl"
              muted={false}
              loop={true}
              preload="auto"
              onRequestPlay={() => setActiveVonixClipId('vo-clip-10')}
              forcePause={activeVonixClipId !== 'vo-clip-10'}
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

          <article className="vo__videoCard" key="/vo-video11again.mp4">
            <PlayToggleVideo
              src="/vo-video11again.mp4"
              wrapperClassName="media media--video"
              videoClassName="vo__videoEl"
              muted={false}
              loop={true}
              preload="auto"
              onRequestPlay={() => setActiveVonixClipId('vo-clip-11')}
              forcePause={activeVonixClipId !== 'vo-clip-11'}
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
          <article className="vo__videoCard vo__videoCard--bottom" key="/vo-video12again.mp4">
            <PlayToggleVideo
              src="/vo-video12again.mp4"
              wrapperClassName="media media--video"
              videoClassName="vo__videoEl"
              muted={false}
              loop={true}
              preload="auto"
              onRequestPlay={() => setActiveVonixClipId('vo-clip-12')}
              forcePause={activeVonixClipId !== 'vo-clip-12'}
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

          <article className="vo__videoCard vo__videoCard--bottom" key="/vo-video13again.mp4">
            <PlayToggleVideo
              src="/vo-video13again.mp4"
              wrapperClassName="media media--video"
              videoClassName="vo__videoEl"
              muted={false}
              loop={true}
              preload="auto"
              onRequestPlay={() => setActiveVonixClipId('vo-clip-13')}
              forcePause={activeVonixClipId !== 'vo-clip-13'}
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
          <article className="vo__videoCard" key="/vo-video14again.mp4">
            <PlayToggleVideo
              src="/vo-video14again.mp4"
              wrapperClassName="media media--video"
              videoClassName="vo__videoEl"
              muted={false}
              loop={true}
              preload="auto"
              onRequestPlay={() => setActiveVonixClipId('vo-clip-14')}
              forcePause={activeVonixClipId !== 'vo-clip-14'}
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
          <article className="vo__videoCard" key="/vo-video15again.mp4">
            <PlayToggleVideo
              src="/vo-video15again.mp4"
              wrapperClassName="media media--video"
              videoClassName="vo__videoEl"
              muted={false}
              loop={true}
              preload="auto"
              onRequestPlay={() => setActiveVonixClipId('vo-clip-15')}
              forcePause={activeVonixClipId !== 'vo-clip-15'}
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
          <article className="vo__videoCard" key="/vo-video16again.mp4">
            <PlayToggleVideo
              src="/vo-video16again.mp4"
              wrapperClassName="media media--video"
              videoClassName="vo__videoEl"
              muted={false}
              loop={true}
              preload="auto"
              onRequestPlay={() => setActiveVonixClipId('vo-clip-16')}
              forcePause={activeVonixClipId !== 'vo-clip-16'}
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
          <article className="vo__videoCard" key="/vo-video17again.mp4">
            <PlayToggleVideo
              src="/vo-video17again.mp4"
              wrapperClassName="media media--video"
              videoClassName="vo__videoEl"
              muted={false}
              loop={true}
              preload="auto"
              onRequestPlay={() => setActiveVonixClipId('vo-clip-17')}
              forcePause={activeVonixClipId !== 'vo-clip-17'}
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
          <article className="vo__videoCard" key="/vo-video18again.mp4">
            <PlayToggleVideo
              src="/vo-video18again.mp4"
              wrapperClassName="media media--video"
              videoClassName="vo__videoEl"
              muted={false}
              loop={true}
              preload="auto"
              onRequestPlay={() => setActiveVonixClipId('vo-clip-18')}
              forcePause={activeVonixClipId !== 'vo-clip-18'}
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
    </section>
  );
}

