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

// Mapping from video index to Cloudflare Stream HLS URLs
const BLAZE_SHORT_VIDEO_MAP = {
  2: 'https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/17a21beb4593118a1a9f1e330566b2f3/manifest/video.m3u8',
  3: 'https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/20c375e2ea549ef63fd9468429cd41f8/manifest/video.m3u8',
  4: 'https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/24a0279c508fee71d4cdb197b62e1f0d/manifest/video.m3u8',
  5: 'https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/6d87119a2c45b2a41be2df9dbb6f5121/manifest/video.m3u8',
  6: 'https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/5c637ad62cb31ac76c98253e35ddbca1/manifest/video.m3u8',
  7: 'https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/0c6f9fb0eb65eadefbfddf46f663fb0d/manifest/video.m3u8',
  8: 'https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/f9546d1073e291f779d6f7ee15c3eb0a/manifest/video.m3u8',
  9: 'https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/cfc19dc00c0f7429b7fde350b4aa6fd9/manifest/video.m3u8',
  10: 'https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/93e4b8bfb3eae25121881c427fdf15fa/manifest/video.m3u8',
  11: 'https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/68c78f265673f4f60d2797576f479d50/manifest/video.m3u8',
  12: 'https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/14321fd5db47a482025001ac6edd4095/manifest/video.m3u8',
  13: 'https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/62de9e9b046013bae59d860f667f3c34/manifest/video.m3u8',
  14: 'https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/91b1dfbdf9d071e1bc2319f58be1f48f/manifest/video.m3u8',
  15: 'https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/ff49afc130d8e14d1ba5b2dc62d48ab8/manifest/video.m3u8',
  16: 'https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/36f0729f83fc6fe83ef352340638e58c/manifest/video.m3u8',
  17: 'https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/d2cf8a55ec314abde1c02f3f8aade29d/manifest/video.m3u8',
  18: 'https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/11c2a0879413bd18165da6bcf0988d0a/manifest/video.m3u8',
  19: 'https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/0e61ecbe230f27ed47ee434e4eef29be/manifest/video.m3u8',
  20: 'https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/98cb9420ebea59a3cb20d6cf2dc3f1be/manifest/video.m3u8',
  21: 'https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/a5ce9cef1cd57ab1aa23fc27f5000db9/manifest/video.m3u8',
};

const BLAZE_LONG_VIDEO_MAP = {
  22: 'https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/bc47e6f78f3b2e713876c97f6f285531/manifest/video.m3u8',
  23: 'https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/54d225bb8eca0e7fecfccb78ee1e9696/manifest/video.m3u8',
  24: 'https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/4d61a1628a9f4640332679cf4ba75fbd/manifest/video.m3u8',
  25: 'https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/ae847f443f7c483e61308656d681bf50/manifest/video.m3u8',
  26: 'https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/e22257108d2eef2c0e70c44e6fdb1aa0/manifest/video.m3u8',
};

const BlazeShort = ({ src, href, label, clipId, activeBlazeClipId, setActiveBlazeClipId }) => (
  <div className="bl__shortCard">
    <ClickToPlayHlsVideo
      src={src}
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

const BlazeVideo = ({ src, href, label, clipId, activeBlazeClipId, setActiveBlazeClipId }) => (
  <div className="bl__videoBox">
    <ClickToPlayHlsVideo
      src={src}
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
            src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/eb7c470c81bbd956afe1e07e21f77d8e/manifest/video.m3u8"
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
              loading="lazy"
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

