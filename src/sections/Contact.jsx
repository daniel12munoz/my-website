import React from "react";
import "./contact.css";

export default function Contact() {
  return (
    <section className="contact" aria-label="Contact">
      <div className="contact__center">
        <div className="contact__email" aria-label="Email">
          daniel@vonixproductions.com
        </div>

        <a
          className="contact__ig"
          href="https://www.instagram.com/vonix.jpg"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram: vonix.jpg"
        >
          {/* Inline SVG so we don't depend on PNG files */}
          <svg
            className="contact__igIcon"
            viewBox="0 0 24 24"
            width="22"
            height="22"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9A3.5 3.5 0 0 0 20 16.5v-9A3.5 3.5 0 0 0 16.5 4h-9zm10.25 1.75a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
            />
          </svg>
          <span className="contact__igHandle">vonix.jpg</span>
        </a>
      </div>
    </section>
  );
}
