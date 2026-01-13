import React from "react";
import "./austin.css";

export default function AustinUnderground() {
  return (
    <section className="au au__section">
      {/* Row 1: Video (left) + Heading/Roles (right) */}
      <div className="au__row1">
        <div className="au__videoBlock">
          <div className="media media--video au__heroMedia">
            <video
              src="/au-video.webm"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              controls={false}
              className="au__video"
            />
          </div>
          <div className="au__linkWrap">
            <a
              className="au__link"
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

      {/* ROW 2 (Paragraph + Two Small Images) */}
      <div className="au__row2 au-grid">
        <div className="au__colText">
          <p className="au__desc">
          Austin Underground is an FCC-licensed television show and journalistic publication that focuses on the music culture within Austin. Produced by a team of over 25 members, the show covers local artists, events, and the city’s evolving music scene.
          </p>
        </div>
        <div className="au__colImages">
          <div className="au__sideImages">
            <img src="/au-image1.jpg" alt="Austin Underground image 1" className="media img1" />
            <img src="/au-image2.jpg" alt="Austin Underground image 2" className="media img2" />
            <img src="/au-image3.jpg" alt="Austin Underground image 3" className="media img3" />
          </div>
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
                <video
                  src="/au-video2.webm"
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
                <video
                  src="/au-video3.webm"
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
                <video
                  src="/au-video4.webm"
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
                <video
                  src="/au-video5.webm"
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
                <video
                  src="/au-video6.webm"
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

          {/* Row 1: images 4–8 (centered) */}
          <div className="au__photoStrip" role="list">
            <img className="media" src="/au-image4.jpg" alt="Concert photo 4" role="listitem" />
            <img className="media" src="/au-image5.jpg" alt="Concert photo 5" role="listitem" />
            <img className="media" src="/au-image6.jpg" alt="Concert photo 6" role="listitem" />
            <img className="media" src="/au-image7.jpg" alt="Concert photo 7" role="listitem" />
            <img className="media" src="/au-image8.jpg" alt="Concert photo 8" role="listitem" />
          </div>

          {/* Row 2: images 9–13 (identical behavior) */}
          <div className="au__photoStrip au__photoStrip--lower" role="list">
            <img className="media" src="/au-image9.jpg" alt="Concert photo 9" role="listitem" />
            <img className="media" src="/au-image10.jpg" alt="Concert photo 10" role="listitem" />
            <img className="media" src="/au-image11.jpg" alt="Concert photo 11" role="listitem" />
            <img className="media" src="/au-image12.jpg" alt="Concert photo 12" role="listitem" />
            <img className="media" src="/au-image13.jpg" alt="Concert photo 13" role="listitem" />
          </div>
        </div>
      </section>
    </section>
  );
}

