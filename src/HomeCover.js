import React from 'react';
import './HomeCover.css';

export default function HomeCover() {
  const projects = [
    { title: 'Project One', description: 'A creative exploration of color and form' },
    { title: 'Project Two', description: 'Innovative design meets functionality' },
    { title: 'Project Three', description: 'Storytelling through visual media' },
    { title: 'Project Four', description: 'Pushing boundaries in digital art' },
    { title: 'Project Five', description: 'Collaborative creative excellence' },
    { title: 'Project Six', description: 'Future-forward production techniques' }
  ];

  return (
    <div className="homecover-root">
      <section className="hero-section-pastel">
        <h1 className="hero-title-bubbly">Bonix Productions</h1>
        <p className="hero-subtitle">Creating magical moments, one project at a time ✨</p>
      </section>

      <section className="work-section">
        <h2 className="work-title">Work</h2>
        <div className="work-grid">
          {projects.map((project, index) => (
            <div key={index} className="project-card">
              <div className="project-number">{index + 1}</div>
              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">{project.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 