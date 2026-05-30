import { useState, useCallback } from 'react';
import BorderGlow from './BorderGlow';
import '../Styles/ProjectPanel.css';

const borderGlowProps = {
  edgeSensitivity: 30,
  glowColor: '0 0 100',
  backgroundColor: '#121212',
  borderRadius: 28,
  glowRadius: 40,
  glowIntensity: 0.9,
  coneSpread: 25,
  animated: false,
  colors: ['#ffffff', '#d6d6d6', '#8a8a8a'],
  fillOpacity: 0,
};

/* ── GitHub SVG Icon ─────────────────────────────────────── */
const GitHubIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    style={{ flexShrink: 0 }}
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

/* ── External Link Icon ──────────────────────────────────── */
const ExternalLinkIcon = ({ size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ flexShrink: 0 }}
  >
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

/* ── Chevron Icon ────────────────────────────────────────── */
const ChevronIcon = ({ size = 16, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    style={{ flexShrink: 0 }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/* ── Carousel (pure React + CSS) ─────────────────────────── */
const PanelCarousel = ({ slides }) => {
  const [active, setActive] = useState(0);
  const total = slides.length;

  const prev = useCallback(() => setActive((i) => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setActive((i) => (i + 1) % total), [total]);

  if (total === 0) return null;

  if (total === 1) {
    return (
      <div className="panel-carousel single">
        <img
          src={slides[0]}
          alt="Project screenshot 1"
          className="carousel-img"
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div className="panel-carousel">
      <div className="carousel-track" style={{ transform: `translateX(-${active * 100}%)` }}>
        {slides.map((src, i) => (
          <div className="carousel-slide" key={i}>
            <img
              src={src}
              alt={`Project screenshot ${i + 1}`}
              className="carousel-img"
              draggable={false}
            />
          </div>
        ))}
      </div>

      <button type="button" className="carousel-arrow carousel-arrow-prev" onClick={prev} aria-label="Previous image">‹</button>
      <button type="button" className="carousel-arrow carousel-arrow-next" onClick={next} aria-label="Next image">›</button>

      <div className="carousel-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`carousel-dot${i === active ? ' active' : ''}`}
            onClick={() => setActive(i)}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

/* ── Main ProjectPanel ────────────────────────────────────── */
const ProjectPanel = ({
  title,
  description,
  details,
  picture,
  videoSrc,
  link,
  githubLink,
  mediaType,
  tags = [],
  images = [],
  projectIndex = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const mediaSrc = picture || videoSrc;
  const hasMedia = Boolean(mediaSrc);
  const isVideo = mediaType === 'video' || /\.(mp4|webm|ogg)$/i.test(mediaSrc || '');
  const hasLink = Boolean(link);
  const hasGithubLink = Boolean(githubLink);
  const hasDescription = Boolean(description);
  const hasDetails = Boolean(details);
  const badgeVariant = (projectIndex % 6) + 1;
  const visibleTags = Array.isArray(tags) ? tags.slice(0, 6) : [];
  const panelId = `project-expand-${(title || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  const carouselSlides = Array.isArray(images) && images.length > 0
    ? images
    : mediaSrc ? [mediaSrc] : [];

  return (
    <BorderGlow {...borderGlowProps} className="project-card-glow">
      <article className={`project-card${isExpanded ? ' expanded' : ''}`}>

        {/* ── Hero image area ── */}
        <div className="project-card-hero">
          {hasMedia && isVideo ? (
            <video className="project-card-hero-media" autoPlay loop muted playsInline>
              <source src={mediaSrc} type="video/mp4" />
            </video>
          ) : hasMedia ? (
            <img className="project-card-hero-media" src={mediaSrc} alt={`${title || 'Project'} preview`} />
          ) : (
            <div className="project-card-hero-placeholder">
              <span>No Preview</span>
            </div>
          )}
          <div className="project-card-hero-overlay" />
          <span className={`project-card-number project-badge-${badgeVariant}`}>
            {String(projectIndex + 1).padStart(2, '0')}
          </span>
        </div>

        {/* ── Card body ── */}
        <div className="project-card-body">

          {/* Title row */}
          <div className="project-card-header">
            <h2 className="project-card-title">{title || 'Untitled Project'}</h2>
            {hasGithubLink && (
              <a
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="project-card-github-icon"
                aria-label="View on GitHub"
              >
                <GitHubIcon size={18} />
              </a>
            )}
          </div>

          {/* Short description */}
          {hasDescription && (
            <p className="project-card-description">{description}</p>
          )}

          {/* Tags */}
          {visibleTags.length > 0 && (
            <div className="project-card-tags">
              {visibleTags.map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className="project-card-tag"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Expand / Collapse toggle */}
          <button
            type="button"
            className={`project-card-toggle${isExpanded ? ' open' : ''}`}
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            aria-controls={panelId}
          >
            <span>{isExpanded ? 'Show Less' : 'View Details'}</span>
            <ChevronIcon size={15} className={`toggle-chevron${isExpanded ? ' rotated' : ''}`} />
          </button>

          {/* ── Expandable details section ── */}
          <div
            className={`project-card-details${isExpanded ? ' open' : ''}`}
            id={panelId}
            aria-hidden={!isExpanded}
          >
            <div className="project-card-details-inner">

              {/* Carousel (if multiple images) */}
              {carouselSlides.length > 1 && (
                <PanelCarousel slides={carouselSlides} />
              )}

              {/* Full details text */}
              {hasDetails && (
                <p className="project-card-details-text">{details}</p>
              )}

              {/* Action buttons */}
              <div className="project-card-actions">
                {hasGithubLink && (
                  <a
                    href={githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-action-btn github-btn"
                  >
                    <GitHubIcon size={15} />
                    <span>View on GitHub</span>
                  </a>
                )}
                {hasLink && (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-action-btn demo-btn"
                  >
                    <ExternalLinkIcon size={14} />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

      </article>
    </BorderGlow>
  );
};

export default ProjectPanel;
