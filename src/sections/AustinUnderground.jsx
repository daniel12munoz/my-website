import React from "react";
import "./austin.css";
import HlsVideo from "../components/HlsVideo";

export default function AustinUnderground() {
  // Concert Photography image order for mobile
  const auConcertOrderMobile = [4, 5, 8, 6, 7, 12, 10, 11, 9, 13];

  return (
    <section id="austin-underground" className="au au__section">
      {/* Row 1: Video (left) + Heading/Roles (right) */}
      <div className="au__row1">
        <div className="au__videoBlock">
          <div className="media media--video au__heroMedia">
            <HlsVideo
              src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/5403e21c3a5fdc02ce600c8e351d7fd5/manifest/video.m3u8"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              priority
              controls={false}
              className="au__video"
            />
          </div>
          <div className="au__linkWrap heroLinkWrap vpHeroLink">
            <a
              className="au__link heroLink vpHeroLink__a"
              href="https://youtube.com/AustinUnderground"
              target="_blank"
              rel="noopener noreferrer"
            >
              youtube.com/AustinUnderground
            </a>
            <span className="au__linkRule" />
          </div>
        </div>

        <div className="au__heading">
          <h2 className="au__title">Austin Underground</h2>
          <span className="au__rule au__rule--main" aria-hidden="true" />
          <div className="au__roles">
            <div>Master Control Manager • Jan 2022 – Jul 2022</div>
            <div>Executive Producer • Aug 2022 – Dec 2023</div>
          </div>
        </div>
      </div>

      {/* MOBILE COLLAGE (layered logo + images) */}
      <div className="au__mobileCollage" aria-hidden="true">
        <img
          src="/austin-underground-full-logo.png"
          alt="Austin Underground full logo"
          className="au__mobileLogo"
        />
        <div className="au__mobilePhotos">
          <img src="/au-image1.jpg" alt="Austin Underground 1" className="au__mobileImg au__mobileImg--1" />
          <img src="/au-image2.jpg" alt="Austin Underground 2" className="au__mobileImg au__mobileImg--2" />
          <img src="/au-image3.jpg" alt="Austin Underground 3" className="au__mobileImg au__mobileImg--3" />
        </div>
      </div>

      {/* ROW 2 — DESKTOP/TABLET layout (paragraph left, collage right) */}
      <div className="au__row2 au-grid au__row2--desktop">
        <div className="au__colText">
          <p className="au__desc">
          Austin Underground is an FCC-licensed television show and journalistic publication that focuses on the music culture within Austin. Produced by a team of over 25 members, the show covers local artists, events, and the city's evolving music scene.
          </p>
        </div>
        <div className="au__colImages">
          <div className="au__collageUnit">
            <img
              src="/austin-underground-full-logo.png"
              alt="Austin Underground full logo"
              className="au__fullLogo"
            />

            <div className="au__sideImages">
              <img src="/au-image1.jpg" alt="Austin Underground 1" className="media img1" />
              <img src="/au-image2.jpg" alt="Austin Underground 2" className="media img2" />
              <img src="/au-image3.jpg" alt="Austin Underground 3" className="media img3" />
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE ORDERED BLOCK (logo → paragraph → photos) */}
      <div className="au__row2Mobile au__row2--mobile">
        <img
          src="/austin-underground-full-logo.png"
          alt="Austin Underground full logo"
          className="au__fullLogo au__fullLogo--mobile"
        />

        <p className="au__desc au__desc--mobile">
          Austin Underground is an FCC-licensed television show and journalistic publication that focuses on the music culture within Austin. Produced by a team of over 25 members, the show covers local artists, events, and the city's evolving music scene.
        </p>

        <div className="au__mobilePhotos">
          <img src="/au-image1.jpg" alt="Austin Underground 1" className="media au__mImg au__mImg1" />
          <img src="/au-image2.jpg" alt="Austin Underground 2" className="media au__mImg au__mImg2" />
          <img src="/au-image3.jpg" alt="Austin Underground 3" className="media au__mImg au__mImg3" />
        </div>
      </div>

      {/* ==== AFTER-SCROLL SECTION (new) ==== */}
      <section className="au__fold2" id="au-more">

        <div className="au__interviews">
          {/* Interviews subhead (smaller than 'Austin Underground' title) */}
          <div className="au__subhead au__subhead--left">
            <h3>Interviews</h3>
            <span className="au__rule au__rule--interviews" />
          </div>

          {/* === INTERVIEWS SECTION (updated) === */}
          <div className="au__videoGrid">
            {/* Video 2 */}
            <div className="au__videoBox">
              <div className="au__videoContainer">
                <HlsVideo
                  src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/b69208204f5aad4bf156ce9e1b5242ae/manifest/video.m3u8"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="au__videoPlayer"
                />
              </div>
              <div className="au__linkWrap">
                <a
                  className="au__link"
                  href="https://youtube.com/watch?v=hVPCyIBEnIY"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  youtube.com/watch?v=hVPCyIBEnIY
                </a>
                <span className="au__linkRule" />
              </div>
            </div>

            {/* Video 3 */}
            <div className="au__videoBox">
              <div className="au__videoContainer">
                <HlsVideo
                  src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/8cffa70ef37255d753103ea9ede9e85e/manifest/video.m3u8"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="au__videoPlayer"
                />
              </div>
              <div className="au__linkWrap">
                <a
                  className="au__link"
                  href="https://youtube.com/watch?v=xDxciP4JI5U"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  youtube.com/watch?v=xDxciP4JI5U
                </a>
                <span className="au__linkRule" />
              </div>
            </div>

            {/* Video 4 */}
            <div className="au__videoBox">
              <div className="au__videoContainer">
                <HlsVideo
                  src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/e6f17cafa3adf74d90e397cf269f9b4e/manifest/video.m3u8"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="au__videoPlayer"
                />
              </div>
              <div className="au__linkWrap">
                <a
                  className="au__link"
                  href="https://youtube.com/watch?v=grR4Lyg6CBs&t"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  youtube.com/watch?v=grR4Lyg6CBs&t
                </a>
                <span className="au__linkRule" />
              </div>
            </div>

            {/* Video 5 */}
            <div className="au__videoBox au__videoBox--v5">
              <div className="au__videoContainer">
                <HlsVideo
                  src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/4a19306ce523fe2dd6b1a5c5cddcb4a2/manifest/video.m3u8"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="au__videoPlayer"
                />
              </div>
              <div className="au__linkWrap">
                <a
                  className="au__link"
                  href="https://youtube.com/watch?v=dAYLrfTmStI"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  youtube.com/watch?v=dAYLrfTmStI
                </a>
                <span className="au__linkRule" />
              </div>
            </div>

            {/* Video 6 */}
            <div className="au__videoBox au__videoBox--v6">
              <div className="au__videoContainer">
                <HlsVideo
                  src="https://customer-j47qk7l1wwcd8bxv.cloudflarestream.com/3dada1f38800be1d616737973de66c39/manifest/video.m3u8"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="au__videoPlayer"
                />
              </div>
              <div className="au__linkWrap">
                <a
                  className="au__link"
                  href="https://youtube.com/watch?v=nEhmrnzJOQ8"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  youtube.com/watch?v=nEhmrnzJOQ8
                </a>
                <span className="au__linkRule" />
              </div>
            </div>
          </div>
        </div>

        <div className="au__concertPhotography">
          {/* Concert Photography subhead (unchanged) */}
          <div className="au__subhead au__subhead--right">
            <h3>Concert Photography</h3>
            <span className="au__rule au__rule--concert" />
          </div>

          {/* Concert Photography: desktop grid (original order 4-13) */}
          <div className="au__concertGrid" role="list">
            <img className="media" src="/au-image4.jpg" alt="Concert 4" role="listitem" />
            <img className="media" src="/au-image5.jpg" alt="Concert 5" role="listitem" />
            <img className="media" src="/au-image6.jpg" alt="Concert 6" role="listitem" />
            <img className="media" src="/au-image7.jpg" alt="Concert 7" role="listitem" />
            <img className="media" src="/au-image8.jpg" alt="Concert 8" role="listitem" />
            <img className="media" src="/au-image9.jpg" alt="Concert 9" role="listitem" />
            <img className="media" src="/au-image10.jpg" alt="Concert 10" role="listitem" />
            <img className="media" src="/au-image11.jpg" alt="Concert 11" role="listitem" />
            <img className="media" src="/au-image12.jpg" alt="Concert 12" role="listitem" />
            <img className="media" src="/au-image13.jpg" alt="Concert 13" role="listitem" />
          </div>

          {/* Concert Photography: mobile-only grid (reordered) */}
          <div className="au__concertMobileGrid" role="list">
            {auConcertOrderMobile.map((n) => (
              <img
                key={n}
                className="media"
                src={`/au-image${n}.jpg`}
                alt={`Concert ${n}`}
                role="listitem"
              />
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}

