import React, { useState } from 'react';
import './blaze.css';
import HlsVideo from '../components/HlsVideo';
import ClickToPlayHlsVideo from '../components/ClickToPlayHlsVideo';

const BLAZE_HERO_LINK = {
  href: 'https://youtube.com/@DanielMunozBusiness',
  label: 'youtube.com/@DanielMunozBusiness',
};

const BLAZE_SHORT_LINKS = [
  { href: 'https://youtube.com/shorts/Bwc4EOdtZWU', label: 'youtube.com/shorts/Bwc4EOdtZWU' }, // video 2
  { href: 'https://youtube.com/shorts/4lDwYASsY_c', label: 'youtube.com/shorts/4lDwYASsY_c' }, // video 3
  { href: 'https://youtube.com/shorts/Yj1ghpHCqgA', label: 'youtube.com/shorts/Yj1ghpHCqgA' }, // video 4
  { href: 'https://youtube.com/shorts/QmBDm7uOodE', label: 'youtube.com/shorts/QmBDm7uOodE' }, // video 5
  { href: 'https://youtube.com/shorts/EMKE1JjT6pg', label: 'youtube.com/shorts/EMKE1JjT6pg' }, // video 6
  { href: 'https://youtube.com/shorts/kEScczKBM2Q', label: 'youtube.com/shorts/kEScczKBM2Q' }, // video 7
  { href: 'https://youtube.com/shorts/IAQ0w_8CCZk', label: 'youtube.com/shorts/IAQ0w_8CCZk' }, // video 8
  { href: 'https://youtube.com/shorts/_uRodqWJJts', label: 'youtube.com/shorts/_uRodqWJJts' }, // video 9
  { href: 'https://youtube.com/shorts/cnUh2f7wJuc', label: 'youtube.com/shorts/cnUh2f7wJuc' }, // video 10
  { href: 'https://youtube.com/shorts/vqlE6Kwu5OU', label: 'youtube.com/shorts/vqlE6Kwu5OU' }, // video 11
  { href: 'https://youtube.com/shorts/9wQcGa9DRRU', label: 'youtube.com/shorts/9wQcGa9DRRU' }, // video 12
  { href: 'https://youtube.com/shorts/zEo9sahZLJ4', label: 'youtube.com/shorts/zEo9sahZLJ4' }, // video 13
  { href: 'https://youtube.com/shorts/EUwf5zjiVeM', label: 'youtube.com/shorts/EUwf5zjiVeM' }, // video 14
  { href: 'https://youtube.com/shorts/De_9mIhHZ-Y', label: 'youtube.com/shorts/De_9mIhHZ-Y' }, // video 15
  { href: 'https://youtube.com/shorts/F62wWLzMqb8', label: 'youtube.com/shorts/F62wWLzMqb8' }, // video 16
  { href: 'https://youtube.com/shorts/5LJwhJNEUUc', label: 'youtube.com/shorts/5LJwhJNEUUc' }, // video 17
  { href: 'https://youtube.com/shorts/HzqRD_eHaU4', label: 'youtube.com/shorts/HzqRD_eHaU4' }, // video 18
  { href: 'https://youtube.com/shorts/q9siOmpsUEM', label: 'youtube.com/shorts/q9siOmpsUEM' }, // video 19
  { href: 'https://youtube.com/shorts/l49pSzdCnUU', label: 'youtube.com/shorts/l49pSzdCnUU' }, // video 20
  { href: 'https://youtube.com/shorts/ohOMdmY2760', label: 'youtube.com/shorts/ohOMdmY2760' }, // video 21
];

const BLAZE_VIDEO_LINKS = [
  { href: 'https://youtube.com/watch?v=p4JWtMv4Krc', label: 'youtube.com/watch?v=p4JWtMv4Krc' },       // video 22
  { href: 'https://youtube.com/watch?v=6f7ExsouIHk', label: 'youtube.com/watch?v=6f7ExsouIHk' },       // video 23
  { href: 'https://youtube.com/watch?v=qr0tMVRC8HY', label: 'youtube.com/watch?v=qr0tMVRC8HY' },       // video 24
  { href: 'https://youtube.com/watch?v=8iP4Lt6X5Fs&t', label: 'youtube.com/watch?v=8iP4Lt6X5Fs&t' },   // video 25
  { href: 'https://youtube.com/watch?v=HM_1McM6Wc4', label: 'youtube.com/watch?v=HM_1McM6Wc4' },       // video 26
];

const BLAZE_SHORT_VIDEO_MAP = {
  2: 'https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/bl-short2.mp4',
  3: 'https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/bl-short3.mp4',
  4: 'https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/bl-short4.mp4',
  5: 'https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/bl-short5.mp4',
  6: 'https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/bl-short6.mp4',
  7: 'https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/bl-short7.mp4',
  8: 'https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/bl-short8.mp4',
  9: 'https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/bl-short9.mp4',
  10: 'https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/bl-short10.mp4',
  11: 'https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/bl-short11.mp4',
  12: 'https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/bl-short12.mp4',
  13: 'https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/bl-short13.mp4',
  14: 'https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/bl-short14.mp4',
  15: 'https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/bl-short15.mp4',
  16: 'https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/bl-short16.mp4',
  17: 'https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/bl-short17.mp4',
  18: 'https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/bl-short18.mp4',
  19: 'https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/bl-short19.mp4',
  20: 'https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/bl-short20.mp4',
  21: 'https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/bl-short21.mp4',
};

const BLAZE_LONG_VIDEO_MAP = {
  22: 'https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/bl-video22.mp4',
  23: 'https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/bl-video23.mp4',
  24: 'https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/bl-video24.mp4',
  25: 'https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/bl-video25.mp4',
  26: 'https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/bl-video26.mp4',
};

const BlazeShort = ({ src, poster, href, label, clipId, activeBlazeClipId, setActiveBlazeClipId }) => (
  <div className="bl__shortCard">
    <ClickToPlayHlsVideo
      src={src}
      poster={poster}
      videoId={clipId}
      wrapperClassName="media media--short bl__shortMedia"
      className="bl__shortVideo"
      loop={true}
      muted={false}
      startQuality="high"
      onRequestPlay={() => {
        setActiveBlazeClipId(clipId);
      }}
      forcePause={activeBlazeClipId !== null && activeBlazeClipId !== clipId}
    />
    <div className="bl__linkWrap">
      <a
        className="bl__link"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {label}
      </a>
      <span className="bl__linkRule" />
    </div>
  </div>
);

const BlazeVideo = ({ src, poster, href, label, clipId, activeBlazeClipId, setActiveBlazeClipId }) => (
  <div className="bl__videoBox">
    <ClickToPlayHlsVideo
      src={src}
      poster={poster}
      videoId={clipId}
      wrapperClassName="media media--video bl__videoMedia"
      className="bl__videoPlayer"
      loop={true}
      muted={false}
      startQuality="high"
      onRequestPlay={() => {
        setActiveBlazeClipId(clipId);
      }}
      forcePause={activeBlazeClipId !== null && activeBlazeClipId !== clipId}
    />
    <div className="bl__linkWrap">
      <a
        className="bl__link"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {label}
      </a>
      <span className="bl__linkRule" />
    </div>
  </div>
);

export default function Blaze() {
  const [activeBlazeClipId, setActiveBlazeClipId] = useState(null);

  return (
    <section id="blaze" className="bl au">
      {/* HERO ROW — direct grid children for stable layout (no display:contents / transform hacks) */}
      <div className="bl__row1">
        <div className="media media--video bl__heroMedia">
          <HlsVideo
            className="bl__heroVideo"
            src="https://pub-fb66b219406c478cabc59dde5af6f3d2.r2.dev/pre-blvideo1c.mp4"
            posterSrc="/blazethumb.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            priority
            hero
            lazy={false}
            controls={false}
          />
        </div>

        <div className="bl__heroLink">
          <div className="bl__linkWrap heroLinkWrap vpHeroLink">
            <a
              className="bl__link heroLink vpHeroLink__a"
              href={BLAZE_HERO_LINK.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {BLAZE_HERO_LINK.label}
            </a>
            <span className="bl__linkRule" />
          </div>
        </div>

        <div className="bl__heading">
          <h2 className="bl__title">Blaze</h2>
          <span className="bl__rule bl__rule--main" aria-hidden="true" />
          <div className="bl__roles">
            Content Creator • Nov 2023 – Jul 2024
          </div>
          <div className="bl__logoWrap">
            <img
              src="/bl-logo1.png"
              alt="Blaze logo"
              className="bl__logo"
              loading="eager"
              fetchPriority="high"
              decoding="sync"
            />
          </div>
        </div>

        <p className="bl__desc">
          Blaze is an AI-powered marketing platform that helps entrepreneurs,
          freelancers, and small businesses grow faster online by creating
          consistent, on-brand content.
        </p>
      </div>

      {/* SHORTS SECTION */}
      <section className="bl__fold bl__shortsSection">
        <div className="bl__subhead bl__subhead--left bl__subhead--shorts">
          <h3>Short-form Videos</h3>
          <span className="bl__rule bl__rule--shorts" />
        </div>

        <div className="bl__shortsGrid">
          {BLAZE_SHORT_LINKS.map((link, i) => {
            const index = i + 2; // still matches video 2–21
            return (
              <BlazeShort
                key={index}
                src={BLAZE_SHORT_VIDEO_MAP[index]}
                poster={`/bl-short${index}thumb.jpg`}
                href={link.href}
                label={link.label}
                clipId={`blaze-short-${index}`}
                activeBlazeClipId={activeBlazeClipId}
                setActiveBlazeClipId={setActiveBlazeClipId}
              />
            );
          })}
        </div>
      </section>

      {/* VIDEOS SECTION */}
      <section className="bl__fold bl__videosSection">
        <div className="bl__subhead bl__subhead--right bl__subhead--videos">
          <h3>Long-form Videos</h3>
          <span className="bl__rule bl__rule--long" />
        </div>

        <div className="bl__videoGrid">
          {BLAZE_VIDEO_LINKS.map((link, i) => {
            const index = i + 22; // 22–26
            return (
              <BlazeVideo
                key={index}
                src={BLAZE_LONG_VIDEO_MAP[index]}
                poster={`/bl-video${index}thumb.jpg`}
                href={link.href}
                label={link.label}
                clipId={`blaze-long-${index}`}
                activeBlazeClipId={activeBlazeClipId}
                setActiveBlazeClipId={setActiveBlazeClipId}
              />
            );
          })}
        </div>
      </section>
    </section>
  );
}

