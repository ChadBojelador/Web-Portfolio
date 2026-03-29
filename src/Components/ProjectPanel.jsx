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
      {/* Track */}
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

      {/* Arrows */}
      <button
        type="button"
        className="carousel-arrow carousel-arrow-prev"
        onClick={prev}
        aria-label="Previous image"
      >
        ‹
      </button>
      <button
        type="button"
        className="carousel-arrow carousel-arrow-next"
        onClick={next}
        aria-label="Next image"
      >
        ›
      </button>

      {/* Dots */}
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
  details,
  picture,
  videoSrc,
  link,
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
  const hasDetails = Boolean(details);
  const badgeVariant = (projectIndex % 6) + 1;
  const visibleTags = Array.isArray(tags) ? tags.slice(0, 6) : [];
  const panelId = `project-expand-${(title || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  // Carousel slides: use `images` array; fall back to the thumbnail if none provided
  const carouselSlides = Array.isArray(images) && images.length > 0
    ? images
    : mediaSrc ? [mediaSrc] : [];

  return (
    <BorderGlow {...borderGlowProps} className={`project-panel-glow${isExpanded ? ' expanded' : ''}`}>
      <article className={`project-panel${isExpanded ? ' expanded' : ''}`}>

        {/* ── Top row: always visible ── */}
        <div className="project-nav-row">
          <span className={`project-badge project-badge-${badgeVariant}`}>Project {projectIndex + 1}</span>
          <div className="project-media">
            {hasMedia && isVideo ? (
              <video className="video-player" autoPlay loop muted playsInline>
                <source src={mediaSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : hasMedia ? (
              <img className="project-image" src={mediaSrc} alt={`${title || 'Project'} preview`} />
            ) : (
              <div className="project-media-fallback">
                <span>Media</span>
              </div>
            )}
          </div>
          <h2 className="panel-title">{title || 'Untitled Project'}</h2>
          <button
            type="button"
            className="view-button"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            aria-controls={panelId}
          >
            {isExpanded ? 'Close' : 'View Project'}
          </button>
        </div>

        {/* ── Collapsed preview: description + tag pills ── */}
        <div className={`project-collapsed-preview${isExpanded ? ' hidden' : ''}`} aria-hidden={isExpanded}>
          {hasDetails && (
            <p className="project-preview-description">{details}</p>
          )}
          {visibleTags.length > 0 && (
            <div className="project-preview-tags">
              {visibleTags.map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className={`project-tag project-badge-${((projectIndex + index) % 6) + 1}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── Expanded right panel: carousel → description → tags → link ── */}
        <aside className="project-expand-panel" id={panelId} aria-hidden={!isExpanded}>

          {/* Image carousel */}
          {carouselSlides.length > 0 && (
            <PanelCarousel slides={carouselSlides} />
          )}

          {/* Description */}
          <p className="project-description">
            {hasDetails ? details : 'No description added yet.'}
          </p>

          {/* Tags */}
          {visibleTags.length > 0 && (
            <div className="project-tags">
              {visibleTags.map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className={`project-tag project-badge-${((projectIndex + index) % 6) + 1}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Link */}
          {hasLink ? (
            <a href={link} target="_blank" rel="noopener noreferrer" className="open-project-button">
              Open Project Link
            </a>
          ) : (
            <span className="open-project-button open-project-button-disabled">Link Not Added</span>
          )}
        </aside>

      </article>
    </BorderGlow>
  );
};

export default ProjectPanel;
