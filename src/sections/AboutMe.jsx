import React from "react";
import "./aboutMe.css";

export default function AboutMe() {
  return (
    <section className="aboutMe about" aria-label="About Me">
      <div className="aboutMe__spotlight" aria-hidden="true" />

      {/* Mobile stack structure */}
      <div className="about__stack">
        <div className="about__topRow">
          <h1 className="aboutMe__name about__name">
            <span className="aboutMe__first">Daniel</span>
            <br className="about__nameBreak" />
            <span className="aboutMe__last">Muñoz</span>
          </h1>

          <div className="aboutMe__photos about__collage" aria-label="Photo collage">
            <img
              className="aboutMe__photoCombined"
              src="/all-aboutmeimages.png"
              alt="Daniel Muñoz collage"
              loading="eager"
              fetchPriority="high"
              decoding="sync"
            />
          </div>
        </div>

        <p className="aboutMe__copy about__bio">
          I'm a producer and creator based in Austin, Texas. I was raised in Costa Rica and moved to the United States at the age of 10, where I first discovered storytelling as a creative outlet and a way to connect with others. That early curiosity grew into a deeper passion for media, including editing, writing, recording, and shaping ideas into meaningful work. I went on to study Radio-Television-Film at the University of Texas at Austin, along with a minor in Business, which allowed me to develop both my creative voice and practical skills. I am deeply fascinated by how stories transmit complex thoughts and emotions from one person to another, allowing others to experience and connect through storytelling. Through Vonix Productions I continue to create with the goal of telling stories that resonate.
        </p>
      </div>

      {/* Desktop structure (hidden on mobile via CSS) */}
      <div className="aboutMe__left">
        <p className="aboutMe__copy">
          I'm a producer and creator based in Austin, Texas. I was raised in Costa Rica and moved to the United States at the age of 10, where I first discovered storytelling as a creative outlet and a way to connect with others. That early curiosity grew into a deeper passion for media, including editing, writing, recording, and shaping ideas into meaningful work. I went on to study Radio-Television-Film at the University of Texas at Austin, along with a minor in Business, which allowed me to develop both my creative voice and practical skills. I am deeply fascinated by how stories transmit complex thoughts and emotions from one person to another, allowing others to experience and connect through storytelling. Through Vonix Productions I continue to create with the goal of telling stories that resonate.
        </p>
      </div>

      <div className="aboutMe__right">
        <h1 className="aboutMe__name">
          <span className="aboutMe__first">Daniel</span>
          <span className="aboutMe__last">Muñoz</span>
        </h1>

        <div className="aboutMe__photos" aria-label="Photo collage">
          <img
            className="aboutMe__photoCombined"
            src="/all-aboutmeimages.png"
            alt="Daniel Muñoz collage"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
          />
        </div>
      </div>
    </section>
  );
}
