import React from "react";
import "./aboutMe.css";

export default function AboutMe() {
  return (
    <section className="aboutMe" aria-label="About Me">
      <div className="aboutMe__spotlight" aria-hidden="true" />

      {/* Left text column */}
      <div className="aboutMe__left">
        <p className="aboutMe__copy">
          I'm a producer and creator based in Austin, Texas. I was raised in Costa Rica and moved to the United States at the age of 10, where I first discovered storytelling as a creative outlet and a way to connect with others. That early curiosity grew into a deeper passion for media, including editing, writing, recording, and shaping ideas into meaningful work. I went on to study Radio-Television-Film at the University of Texas at Austin, along with a minor in Business, which allowed me to develop both my creative voice and practical skills. I am deeply fascinated by how stories transmit emotion and complex thought from one person to another, and I find beauty in the process of turning ideas into something others can experience and relate to. Through Vonix Productions I continue to create with the goal of telling stories that resonate and connect.
        </p>
      </div>

      {/* Right visual column */}
      <div className="aboutMe__right">
        <h1 className="aboutMe__name">
          <span className="aboutMe__first">Daniel</span>
          <span className="aboutMe__last">Muñoz</span>
        </h1>

        <div className="aboutMe__photos" aria-label="Photo collage">
          <img 
            className="aboutMe__photo aboutMe__photo--a" 
            src="/aboutmepic-1.jpg" 
            alt="Daniel Muñoz portrait 1"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
          />
          <img 
            className="aboutMe__photo aboutMe__photo--b" 
            src="/aboutmepic-2.jpg" 
            alt="Daniel Muñoz portrait 2"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
          />
          <img 
            className="aboutMe__photo aboutMe__photo--c" 
            src="/aboutmepic-3.jpg" 
            alt="Daniel Muñoz portrait 3"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
          />
        </div>
      </div>
    </section>
  );
}
